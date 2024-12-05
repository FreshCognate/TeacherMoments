import CONNECTIONS from "../connections.js";

export default async function (req, res, next) {

  if (CONNECTIONS['app'].connection) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorised. Please login.", statusCode: 401 });
  }

};