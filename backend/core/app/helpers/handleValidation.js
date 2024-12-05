import Joi from 'joi';

export default (param, bodyValidation, queryValidation, filesValidation, shouldSkipValidation) => (req, res, next) => {

  try {

    if (shouldSkipValidation) return next();

    if (param) {
      // console.log(param);
    }

    if (bodyValidation) {

      const { value, error } = bodyValidation.validate(req.body);
      if (error) {
        throw error.message;
      }
    }

    if (queryValidation) {
      const { value, error } = queryValidation.validate(req.query);
      if (error) {
        throw error.message;
      }
    }

    if (filesValidation) {
      const { value, error } = filesValidation.validate(req.files);
      if (error) {
        throw error.message;
      }
    }

    return next();

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error
    });
  }

};