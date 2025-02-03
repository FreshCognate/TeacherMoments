import pick from 'lodash/pick.js';
import getModelsAndTenant from '#core/databases/helpers/getModelsAndTenant.js';
import getConnection from '#core/databases/helpers/getConnection.js';

export default ({ param, bodyArguments, queryArguments, filesArguments, props, method }) => async (req, res, next) => {

  try {

    const methodArguments = {};

    if (param) {
      methodArguments.param = req.params[param];
    }

    if (bodyArguments && Object.keys(bodyArguments).length) {
      methodArguments.body = pick(req.body, Object.keys(bodyArguments));
    }

    if (queryArguments && Object.keys(queryArguments).length) {
      methodArguments.query = pick(req.query, Object.keys(queryArguments));
    }

    if (filesArguments && Object.keys(filesArguments).length) {
      methodArguments.files = pick(req.files, Object.keys(filesArguments));
    }

    const { models, tenant } = await getModelsAndTenant(req);

    const connection = getConnection();

    methodArguments.props = props;

    try {

      const response = await method(methodArguments, { models, tenant, req, res, user: req.user, connection });

      return res.json(response);

    } catch (error) {

      const { statusCode, message } = error;

      if (!statusCode) {
        console.warn(error);
        return res.status(500).json({
          message: error.message || error
        });
      }

      return res.status(statusCode).json({
        message
      });
    }

  } catch (error) {
    const { statusCode, message } = error;

    if (!statusCode) {
      console.warn(error);
      return res.status(500).json({
        message: error.message || error
      });
    }

    return res.status(statusCode).json({
      message
    });
  }

};