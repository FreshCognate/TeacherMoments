export default () => {

  const pathnameSplit = window.location.pathname.split('/');

  if (pathnameSplit[1] === 'play') return true;

  return false;

}