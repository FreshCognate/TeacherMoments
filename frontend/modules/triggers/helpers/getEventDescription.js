const TRIGGER_TYPE_MAPPINGS = {
  SLIDE: 'slide'
}
export default ({ triggerType }) => {
  return `On exit ${TRIGGER_TYPE_MAPPINGS[triggerType]}`
}