const ROLES = {
  OWNER: 'Owner',
  AUTHOR: 'Author'
}

export default (user) => {
  if (!user) return 'Unknown'
  return ROLES[user.role];
}