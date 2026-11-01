export default (type: 'ADD' | 'DUPLICATE') => {
  return {
    title: type === 'ADD' ? "Add slide" : "Duplicate slide",
    body: type === 'ADD' ? 'You cannot add a slide that is associated with a branching stem navigation. Clicking add slide will add this slide before the last slide.'
      : 'You cannot duplicate a slide that is associated with a branching stem navigation. Clicking duplicate slide will duplicate this slide before the last slide.',
    actions: [{
      type: 'CANCEL',
      text: 'Cancel'
    }, {
      type: 'CONFIRM',
      text: type === 'ADD' ? 'Add slide' : 'Duplicate slide',
      color: 'primary'
    }]
  };
}
