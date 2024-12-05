import bcrypt from 'bcryptjs';

const compareInputWithHash = async function (input, hash) {
  const compare = await bcrypt.compare(input, hash);
  return compare;
};

export default compareInputWithHash;