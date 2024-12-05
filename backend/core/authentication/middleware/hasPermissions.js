import hasUserGotPermissions from "../helpers/hasUserGotPermissions.js";

export default (permissions) => (req, res, next) => {
  if (hasUserGotPermissions(req.user, permissions)) {
    req.status = 200;
    req.error = null;
    return next();
  } else {
    req.status = 401;
    req.error = "User doesn't have correct permissions";
    return next('route');
  }
};