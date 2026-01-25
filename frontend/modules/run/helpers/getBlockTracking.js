import getCurrentStage from "./getCurrentStage";

export default ({ blockRef }) => {
  const currentStage = getCurrentStage();
  const blocksByRef = currentStage?.blocksByRef || {};
  return blocksByRef[blockRef] || {};
}
