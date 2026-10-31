import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import last from 'lodash/last';
import getScenarioDetails from "./getScenarioDetails";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import getActiveStemRef from "~/modules/stems/helpers/getActiveStemRef";

export default ({ slideRef, stemRef }) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });

  currentStage.navigateToSlide = slideRef;


  if (isScenarioInPlay()) {
    return run.mutate({ stages }, { method: 'put' });
  } else {
    const editor = getCache('editor');
    const { stemPath = [] } = editor.data;
    const currentStemRef = getActiveStemRef();
    const currentStemPath = last(stemPath) === currentStemRef ? stemPath : [currentStemRef];
    editor.set({ stemPath: [...currentStemPath, stemRef] })
    return run.set({ stages });
  }


}