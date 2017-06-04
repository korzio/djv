module.exports = function required(schema, tpl) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  schema.required.forEach((name) => {
    tpl('if (!%s.hasOwnProperty("%s"))', tpl.data, name)
      .push(tpl.error('required'));
  });
};
