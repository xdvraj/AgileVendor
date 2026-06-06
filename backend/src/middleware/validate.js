const { ZodError } = require("zod");

function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            field: e.path.filter((p) => p !== "body" && p !== "query" && p !== "params").join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

module.exports = validate;
