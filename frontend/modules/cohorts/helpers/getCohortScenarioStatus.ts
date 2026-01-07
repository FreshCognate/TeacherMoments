import { Run } from "~/modules/run/runs.types";

export default (run: Run) => {
  if (run) {
    if (run.isComplete) return "This scenario has been completed";
    return "This scenario has been started";
  } else {
    return "This scenario has not been started";
  }
}