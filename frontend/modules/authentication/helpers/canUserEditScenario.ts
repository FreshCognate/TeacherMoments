import getCache from "~/core/cache/helpers/getCache";
import { Scenario } from "~/modules/scenarios/scenarios.types";

export default (scenario: Scenario) => {
  const authentication = getCache('authentication');
  const userId = authentication?.data?._id;

  if (!userId || !scenario?.collaborators) {
    return false;
  }

  return scenario.collaborators.some(
    (collaborator) => collaborator.user === userId && ['OWNER', 'AUTHOR'].includes(collaborator.role)
  );
}
