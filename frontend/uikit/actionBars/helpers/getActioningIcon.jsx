const ICON_MAPPINGS = {
  duplicate: 'paste',
  move: 'move'
};

export default (actionType) => {
  return ICON_MAPPINGS[actionType];
}