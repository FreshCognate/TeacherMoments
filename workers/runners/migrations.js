export default async (job) => {
  try {
    const { default: migrate } = await import(`../migrations/${job.name}.js`);
    await migrate(job.data);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
