import Validators from "../forms.validators";
export default function getValidator(validator) {
  return Validators[validator];
}