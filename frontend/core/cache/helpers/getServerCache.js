import each from 'lodash/each';
import omit from 'lodash/omit';
import axios from 'axios';
import getUrl from './getUrl';

const getServerCache = async (cacheObject, context, options = {}) => {

  try {

    const { req, query, params = {} } = context;

    const props = options.props || {};

    const initialState = {};

    const promises = [];

    const filteredQuery = omit(query, Object.keys(params)) || {};

    each(cacheObject, (cacheValue, cacheKey) => {
      if (!cacheValue.transform) cacheValue.transform = ({ data }) => { return data; };
      if (!cacheValue.getParams) cacheValue.getParams = () => { };
      if (!cacheValue.getQuery) cacheValue.getQuery = () => ({});
      if (!cacheValue.getDependencies) cacheValue.getDependencies = () => ([]);

      const dependencies = cacheValue.getDependencies(context);
      let hasValidDependencies = true;
      each(dependencies, (dependency) => {
        if (!dependency) {
          hasValidDependencies = false;
        }
      });

      if (cacheValue.url && hasValidDependencies) {
        cacheValue.isFetching = true;
        const proto = (req.headers["x-forwarded-proto"] || req.connection.encrypted) ? "https" : "http";

        const url = getUrl({ url: `${proto}://${req.headers.host}${cacheValue.url}`, params: cacheValue.getParams(context) });

        const fetchPromise = axios({
          method: cacheValue.method || "GET",
          url,
          params: { ...filteredQuery, ...cacheValue.getQuery(context) },
          headers: req.headers,
        });
        promises.push(fetchPromise);
      }
    });

    const resolvedPromises = await Promise.all(promises);

    let cacheIndex = 0;

    each(cacheObject, (cacheValue, cacheKey) => {
      if (cacheValue.url && cacheValue.isFetching) {
        const transformedData = cacheValue.transform({ data: resolvedPromises[cacheIndex].data });
        initialState[cacheKey] = {
          status: 'success',
          response: resolvedPromises[cacheIndex].data,
          data: transformedData,
          error: null,
          isServerLoaded: true,
          method: 'get',
          url: cacheValue.url
        };
        cacheIndex++;
      }
    });

    return {
      props: {
        __cache__: initialState,
        ...props
      }
    };

  } catch (error) {
    console.warn(error);
    return {
      redirect: (options.getRedirect && options.getRedirect(error)) || {
        destination: '/error',
        permanent: false,
      },
    };
  }

};

export default getServerCache;
