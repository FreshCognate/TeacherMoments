import { Run } from "~/modules/run/runs.types";

export default (run: Run) => {
  let text = 'This scenario has not been started';
  let icon = 'notStarted';
  if (run) {
    if (run.isComplete) {
      text = "This scenario has been completed";
      icon = 'complete';

    } else {
      text = "This scenario has been started";
      icon = "started";
    }
  }
  return {
    icon,
    text
  }
}