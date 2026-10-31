import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import map from 'lodash/map.js';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import moveStemRefToBranchingOptions from '../moveStemRefToBranchingOptions.js';

const db = setupMongo();

const getStem = (Model, id) => Model.findById(id).lean();

const getBranchingOptionStemRefs = (stem) => map(stem.branchingOptions, (branchingOption) => String(branchingOption.stemRef));

const setLegacyBranchingOptions = (Model, stem, branchingOptions) => Model.collection.updateOne(
  { _id: stem._id },
  { $set: { branchingOptions } }
);

describe('moveStemRefToBranchingOptions (in-memory mongo)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models, close: vi.fn() });
  });

  it('adds each child stem to its parent branching options in sortOrder', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Children' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const secondChildStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 1 });
    const firstChildStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    await moveStemRefToBranchingOptions();

    const updatedRootStem = await getStem(Stem, rootStem._id);

    expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(firstChildStem.ref), String(secondChildStem.ref)]);
    expect(updatedRootStem.branchingOptions[0].conditions).toEqual([]);
  });

  it('keeps existing branching options and their conditions, renaming elementRef to stemRef', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Conditions' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const conditionedStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });
    const conditionlessStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 1 });

    const promptRef = new mongoose.Types.ObjectId();
    const existingBranchingOptionId = new mongoose.Types.ObjectId();

    await setLegacyBranchingOptions(Stem, rootStem, [{
      _id: existingBranchingOptionId,
      elementRef: conditionedStem.ref,
      conditions: [{ prompts: [{ ref: promptRef, options: ['a'] }] }]
    }]);

    await moveStemRefToBranchingOptions();

    const updatedRootStem = await getStem(Stem, rootStem._id);
    const [conditionedOption, conditionlessOption] = updatedRootStem.branchingOptions;

    expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(conditionedStem.ref), String(conditionlessStem.ref)]);
    expect(conditionedOption).not.toHaveProperty('elementRef');
    expect(String(conditionedOption._id)).toBe(String(existingBranchingOptionId));
    expect(String(conditionedOption.conditions[0].prompts[0].ref)).toBe(String(promptRef));
    expect(conditionedOption.conditions[0].prompts[0].options).toEqual(['a']);
    expect(conditionlessOption.conditions).toEqual([]);
  });

  it('removes empty options and options pointing at stems that are not live children', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Stale' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const childStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });
    const deletedChildStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 1, isDeleted: true });

    rootStem.branchingOptions = [{}, { stemRef: deletedChildStem.ref, conditions: [] }];
    await rootStem.save();

    await moveStemRefToBranchingOptions();

    const updatedRootStem = await getStem(Stem, rootStem._id);
    const updatedChildStem = await getStem(Stem, childStem._id);

    expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(childStem.ref)]);
    expect(updatedChildStem.branchingOptions).toEqual([]);
  });

  it('clears a default branching stem that is not a live child and keeps a valid one', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Defaults' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const childStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });
    const grandchildStem = await Stem.create({ scenario: scenario._id, stemRef: childStem.ref, sortOrder: 0 });

    rootStem.defaultBranchingStemRef = childStem.ref;
    await rootStem.save();

    childStem.defaultBranchingStemRef = new mongoose.Types.ObjectId();
    await childStem.save();

    await moveStemRefToBranchingOptions();

    const updatedRootStem = await getStem(Stem, rootStem._id);
    const updatedChildStem = await getStem(Stem, childStem._id);

    expect(String(updatedRootStem.defaultBranchingStemRef)).toBe(String(childStem.ref));
    expect(updatedChildStem.defaultBranchingStemRef).toBeNull();
    expect(getBranchingOptionStemRefs(updatedChildStem)).toEqual([String(grandchildStem.ref)]);
  });

  it('leaves stemRef in place', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Keep stemRef' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const childStem = await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    await moveStemRefToBranchingOptions();

    const updatedChildStem = await getStem(Stem, childStem._id);

    expect(String(updatedChildStem.stemRef)).toBe(String(rootStem.ref));
  });

  it('makes no changes when run a second time', async () => {
    const { Scenario, Stem } = db.models;
    const scenario = await Scenario.create({ name: 'Idempotent' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });
    await Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    await moveStemRefToBranchingOptions();
    const stemsAfterFirstRun = await Stem.find({}).sort({ _id: 1 }).lean();

    await moveStemRefToBranchingOptions();
    const stemsAfterSecondRun = await Stem.find({}).sort({ _id: 1 }).lean();

    expect(stemsAfterSecondRun).toEqual(stemsAfterFirstRun);
  });

  it('converts published stems', async () => {
    const { Published_Scenario, Published_Stem } = db.models;
    const scenario = await Published_Scenario.create({ name: 'Published' });

    const rootStem = await Published_Stem.create({ scenario: scenario._id, isRoot: true });
    const childStem = await Published_Stem.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    await moveStemRefToBranchingOptions();

    const updatedRootStem = await getStem(Published_Stem, rootStem._id);

    expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(childStem.ref)]);
  });

});
