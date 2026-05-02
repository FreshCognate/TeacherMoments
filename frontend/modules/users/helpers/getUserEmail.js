export default (user) => {
  if (!user) return `Unknown email`;
  return user.email;
}