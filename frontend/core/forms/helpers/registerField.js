import Fields from '../forms.fields';

export default function registerField(type, component) {
  Fields[type] = component;
}
