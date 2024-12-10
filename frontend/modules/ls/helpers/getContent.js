import getCache from '~/core/cache/helpers/getCache';

export default function getContent({ model, field }) {

  const app = getCache('app');

  const { language } = app.data;

  if (model) {

    let value = model[`${language}-${field}`];

    return value;

  }

}