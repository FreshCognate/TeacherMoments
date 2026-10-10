import hasUserGotPermissions from './hasUserGotPermissions.js';

export default ({ currentUser, user }) => {
  if (!user) return false;
  if (user.role !== 'SUPER_ADMIN') return true;
  if (!currentUser) return false;
  return hasUserGotPermissions(currentUser, ['SUPER_ADMIN']);
};
