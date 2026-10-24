import { Stem } from '../stems.types';

type StemError = {
  message: string,
  elementType: string,
  elementId: string
};

export default (stem: Stem) => {
  const errors: StemError[] = [];

  return errors;
};
