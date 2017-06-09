module.exports = function required(schema, tpl) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  schema.required.forEach((name) => {
    const condition = '!%s.hasOwnProperty("%s")';
    const error = tpl.error('required', name);

    tpl(`if (${condition}) ${error}`, tpl.data, name);
  });
};
