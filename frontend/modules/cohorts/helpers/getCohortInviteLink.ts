import { Invite } from "../cohorts.types";

export default ({ cohortId, invite }: { cohortId: string, invite: Invite }) => {
  return `${window.location.host}/invite/${invite.token}`
}