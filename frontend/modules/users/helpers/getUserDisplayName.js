export default (user) => {
  if (!user) return `Unknown user`;
  return `${user.firstName} ${user.lastName}`;
}