import bcrypt from 'bcryptjs';

const createHash = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export default createHash;