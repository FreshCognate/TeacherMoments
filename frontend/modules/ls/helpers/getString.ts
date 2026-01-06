import getCache from '~/core/cache/helpers/getCache';
import isString from 'lodash/isString';
import getTextString from '~/core/slate/helpers/getTextString';

export default function getString({ model, field, isTitle }: { model: any, field: string, isTitle?: boolean }) {

  const app = getCache('app');

  const { language } = app.data;

  if (model) {

    const value = model[`${language}-${field}`];

    if (isString(value)) {
      return value;
    }

    return getTextString(value, isTitle);

  }

}