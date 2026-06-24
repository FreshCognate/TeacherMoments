import connectDatabase from './connectDatabase.js';

export default async (work) => {
  const connection = await connectDatabase();
  try {
    return await work(connection);
  } finally {
    await connection.close();
  }
};
