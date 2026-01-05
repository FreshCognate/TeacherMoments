export default (user) => {
  if (!user) return `Unknown user`;
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
}