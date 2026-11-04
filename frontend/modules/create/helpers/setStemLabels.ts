import each from 'lodash/each';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { PositionedStem } from '../create.types';

type Options = {
  stemsByRef: Record<string, PositionedStem>;
  columnsByRef: Record<string, number>;
};

export default ({ stemsByRef, columnsByRef }: Options) => {
  const stemsByColumn = groupBy(stemsByRef, (stem) => columnsByRef[stem.ref]);

  each(stemsByColumn, (columnStems, column) => {
    const columnLetter = String.fromCharCode(65 + Number(column));

    if (Number(column) === 0) {
      each(columnStems, (stem) => { stem.label = columnLetter; });
      return;
    }

    each(sortBy(columnStems, 'y'), (stem, index) => {
      stem.label = `${columnLetter}${index + 1}`;
    });
  });
};
