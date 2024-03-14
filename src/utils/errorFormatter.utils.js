const errorFormatter = (error) => {
  return error.msg;
};
module.exports = errorFormatter;

// Example code

// const errors = validationResult(req).formatWith(errorFormatter);
// if (!errors.isEmpty()) {
//   return res.status(400).json({ error: errors.mapped() });
// }
