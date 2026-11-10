import { Run } from "~/modules/run/runs.types";

export default (run: Run) => {
  let text = "You haven't started this scenario";
  let icon = 'notStarted';
  if (run) {
    if (run.isComplete) {
      text = "You've finished this scenario";
      icon = 'complete';

    } else {
      text = "You've started this scenario";
      icon = "started";
    }
  }
  return {
    icon,
    text
  }
}