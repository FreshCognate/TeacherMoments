import each from 'lodash/each';

const getUrl = ({ url, params }) => {
  if (!url) return null;
  let returnedUrl = url;
  each(params, (paramValue, paramKey) => {
    returnedUrl = returnedUrl.replace(`:${paramKey}`, `${paramValue}`);
  });
  return returnedUrl;
};

export default getUrl;
