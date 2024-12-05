export default async function (req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorised. Please login.", statusCode: 401, isLoginRequired: true });
  }
};