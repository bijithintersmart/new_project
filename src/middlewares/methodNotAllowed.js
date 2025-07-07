export const methodNotAllowed = (allowed) => (req, res) => {
  res.status(405).json({
    status: "error",
    message: `Na kettathu ${allowed.join(", ")},ana avaru koduthathu ${
      req.method
    }`,
  });
};
