import messages from "../utils/constants.js";

export const methodNotAllowed = (allowed) => (req, res) => {
  res.status(405).json({
    status: "error",
    message: messages.methodNotAllowed(req.method, allowed.join(", ")),
  });
};
