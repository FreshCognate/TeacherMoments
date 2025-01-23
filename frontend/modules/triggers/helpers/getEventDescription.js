const TRIGGER_TYPE_MAPPINGS = {
  SLIDE: 'slide'
}
export default ({ event, triggerType }) => {
  switch (event) {
    case 'ON_ENTER':
      return `On enter ${TRIGGER_TYPE_MAPPINGS[triggerType]}`
    case 'ON_EXIT':
      return `On exit ${TRIGGER_TYPE_MAPPINGS[triggerType]}`
    case 'ON_COMPLETE':
      return `On ${TRIGGER_TYPE_MAPPINGS[triggerType]} complete`
  }
}