export default async (job) => {
  try {
    console.log(job);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}