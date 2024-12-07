import Conditions from "../forms.conditions";
export default function registerCondition(condition, method) {
  Conditions[condition] = method;
}