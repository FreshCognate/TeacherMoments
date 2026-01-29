import getCache from "~/core/cache/helpers/getCache";
import { Cohort } from "~/modules/cohorts/cohorts.types";

export default (cohort: Cohort) => {
  const authentication = getCache('authentication');
  const userId = authentication?.data?._id;

  if (!userId || !cohort?.collaborators) {
    return false;
  }

  return cohort.collaborators.some(
    (collaborator) => {
      const collaboratorUserId = typeof collaborator.user === 'string'
        ? collaborator.user
        : collaborator.user._id;
      return collaboratorUserId === userId && ['OWNER', 'AUTHOR'].includes(collaborator.role);
    }
  );
}
