export default async (job) => {
  try {
    const { default: upgrade } = await import(`../tasks/upgrades/${job.name}.js`);
    await upgrade(job.data);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
