
import jwt from "jsonwebtoken";
import messages from "../utils/constants.js";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          statusCode: 403,
          message: messages.tokenError,
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      statusCode: 401,
      message: messages.unAuthorized,
    });
  }
};

export default authenticate;
