import Validators from '../forms.validators';
export default function registerValidator(validator, method) {
  Validators[validator] = method;
}