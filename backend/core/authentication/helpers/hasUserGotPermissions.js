import includes from 'lodash/includes.js';

export default (user, permissions) => {
  if (includes(permissions, user.role)) {
    return true;
  } else {
    return false;
  }
}