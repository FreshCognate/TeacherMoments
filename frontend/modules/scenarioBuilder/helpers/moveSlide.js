import axios from "axios";
import getCache from "~/core/cache/helpers/getCache";
import getSlideSelectionFromQuery from "./getSlideSelectionFromQuery";
import handleRequestError from "~/core/app/helpers/handleRequestError";

export default ({ slideId, scenarioId, parentId, sortOrder, layerIndex, navigate }) => {

  const editor = getCache("editor");

  axios.put(`/api/slides/${slideId}`, {
    scenarioId: scenarioId,
    parentId,
    sortOrder
  }).then(async () => {
    const slides = getCache('slides');
    const blocks = getCache('blocks');
    await blocks.fetch();
    await slides.fetch();
    // Navigate to duplicated slide
    let slideSelection = getSlideSelectionFromQuery();

    slideSelection.splice(layerIndex, slideSelection.length - layerIndex);
    slideSelection.push(sortOrder);

    const scenarioId = getCache('scenario').data._id;
    navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`, { replace: true });


    editor.set({
      isCreatingFromAction: false,
      isActioning: false,
      actionId: null,
      actionElement: null
    });

  }).catch((error) => {
    handleRequestError(error);
    editor.set({
      isCreatingFromAction: false,
      isActioning: false,
      actionId: null,
      actionElement: null
    });
  });
}