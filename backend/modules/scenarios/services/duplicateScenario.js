import omit from 'lodash/omit.js';
import map from 'lodash/map.js';
import each from 'lodash/each.js';
import duplicateSlides from '../../slides/services/duplicateSlides.js';
import duplicateStems from '../../stems/services/duplicateStems.js';
import duplicateTriggers from '../../triggers/services/duplicateTriggers.js';
import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user, connection } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const existingScenario = await models.Scenario.findById(scenarioId);

  if (!existingScenario) throw { message: "This scenario does not exist", statusCode: 404 };

  let newScenario;

  await connection.transaction(async (session) => {

    const duplicatedScenarioObject = omit(existingScenario, ['_id']);
    duplicatedScenarioObject.name = duplicatedScenarioObject.name + " - Duplicate";
    duplicatedScenarioObject.originalScenario = existingScenario._id;
    duplicatedScenarioObject.createdAt = new Date();
    duplicatedScenarioObject.createdBy = user._id;
    duplicatedScenarioObject.collaborators = [{ user: user._id, role: 'OWNER' }];
    duplicatedScenarioObject.cohorts = [];
    duplicatedScenarioObject.hasChanges = true;
    duplicatedScenarioObject.isPublished = false;
    duplicatedScenarioObject.publishLink = null;
    duplicatedScenarioObject.publishedAt = null;
    duplicatedScenarioObject.publishedBy = null;

    const bulkScenarios = await models.Scenario.create([duplicatedScenarioObject], { session });
    newScenario = bulkScenarios[0];

    const duplicatedSlides = await duplicateSlides({ scenarioId: existingScenario._id, newScenarioId: newScenario._id }, { ...context, session })

    for (const duplicatedSlide of duplicatedSlides) {
      await models.Slide.updateMany({ scenario: newScenario._id, children: duplicatedSlide.originalRef }, { $set: { 'children.$': duplicatedSlide.ref } }, { session });
    }

    // Build ref maps for triggers
    const slideRefMap = new Map();
    for (const duplicatedSlide of duplicatedSlides) {
      slideRefMap.set(duplicatedSlide.originalRef.toString(), duplicatedSlide.ref);
    }

    // Duplicate stems and remap their hierarchy + slide associations onto the new refs
    const duplicatedStems = await duplicateStems({ scenarioId: existingScenario._id, newScenarioId: newScenario._id }, { ...context, session });

    const stemRefMap = new Map();
    for (const duplicatedStem of duplicatedStems) {
      stemRefMap.set(duplicatedStem.originalRef.toString(), duplicatedStem.ref);
    }

    for (const duplicatedStem of duplicatedStems) {
      const stemUpdate = {};
      if (duplicatedStem.defaultBranchingStemRef) {
        const newDefaultBranchingStemRef = stemRefMap.get(String(duplicatedStem.defaultBranchingStemRef));
        if (newDefaultBranchingStemRef) stemUpdate.defaultBranchingStemRef = newDefaultBranchingStemRef;
      }
      if (duplicatedStem.slideRef) {
        const newSlideRef = slideRefMap.get(duplicatedStem.slideRef.toString());
        if (newSlideRef) stemUpdate.slideRef = newSlideRef;
      }
      if (Object.keys(stemUpdate).length) {
        await models.Stem.updateOne({ _id: duplicatedStem._id }, { $set: stemUpdate }, { session });
      }
    }

    // Remap stemRef on duplicated slides to point to the new stems
    for (const duplicatedSlide of duplicatedSlides) {
      if (!duplicatedSlide.stemRef) continue;
      const newStemRef = stemRefMap.get(duplicatedSlide.stemRef.toString());
      if (newStemRef) {
        await models.Slide.updateOne({ _id: duplicatedSlide._id }, { $set: { stemRef: newStemRef } }, { session });
      }
    }

    const newBlocks = await models.Block.find({ scenario: newScenario._id }, null, { session });
    const blockRefMap = new Map();
    for (const block of newBlocks) {
      if (block.originalRef) {
        blockRefMap.set(block.originalRef.toString(), block.ref);
      }
    }

    // Remap responseRef on duplicated blocks to point to new block refs
    const blocksWithResponseRef = newBlocks.filter(block => block.responseRef);
    for (const block of blocksWithResponseRef) {
      const newRef = blockRefMap.get(block.responseRef.toString());
      if (newRef) {
        await models.Block.updateOne({ _id: block._id }, { $set: { responseRef: newRef } }, { session });
      }
    }

    for (const duplicatedSlide of duplicatedSlides) {
      if (!duplicatedSlide.feedbackItems.length) continue;

      each(duplicatedSlide.feedbackItems, (feedbackItem) => {
        each(feedbackItem.conditions, (condition) => {
          each(condition.prompts, (prompt) => {
            if (prompt.ref) {
              prompt.ref = blockRefMap.get(prompt.ref.toString()) || prompt.ref;
            }
          });
        });
      });

      await models.Slide.updateOne({ _id: duplicatedSlide._id }, { $set: { feedbackItems: duplicatedSlide.feedbackItems } }, { session });
    }

    for (const duplicatedStem of duplicatedStems) {
      if (!duplicatedStem.branchingOptions.length) continue;

      const branchingOptions = map(duplicatedStem.branchingOptions, (branchingOption) => {
        const duplicatedBranchingOption = omit(branchingOption.toObject(), ['_id']);
        duplicatedBranchingOption.stemRef = stemRefMap.get(String(branchingOption.stemRef)) || branchingOption.stemRef;
        duplicatedBranchingOption.conditions = map(duplicatedBranchingOption.conditions, (condition) => ({
          ...omit(condition, ['_id']),
          prompts: map(condition.prompts, (prompt) => ({
            ...omit(prompt, ['_id']),
            ref: blockRefMap.get(String(prompt.ref)) || prompt.ref
          }))
        }));
        return duplicatedBranchingOption;
      });

      await models.Stem.updateOne({ _id: duplicatedStem._id }, { $set: { branchingOptions } }, { session });
    }

    await duplicateTriggers({ scenarioId: existingScenario._id, newScenarioId: newScenario._id, slideRefMap, blockRefMap, stemRefMap }, { ...context, session });

  }).catch(err => {
    console.log(err);
    throw { message: "Failed to duplicate scenario", statusCode: 500 };
  });

  return newScenario;

};