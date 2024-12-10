import getCache from '~/core/cache/helpers/getCache';

export default function setContent({ model, field, content }) {

  const app = getCache('app');

  const { language } = app.data;

  if (model) {

    model[`${language}-${field}`] = content;

    return model;

  }

}