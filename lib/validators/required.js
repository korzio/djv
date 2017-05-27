module.exports = function required(schema, fn) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  schema.required.forEach((name) => {
    fn('if (!%s.hasOwnProperty("%s"))', fn.data, name)(fn.error('required'));
  });
};
