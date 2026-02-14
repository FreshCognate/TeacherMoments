export default (router: any) => {
  const searchParams = new URLSearchParams(router.location.search);
  return searchParams.get('cohort');
};
