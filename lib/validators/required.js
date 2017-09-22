module.exports = function required(schema, tpl) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  tpl('if (typeof %s === \'object\' && !Array.isArray(%s)) {', tpl.data);
  schema.required.forEach((name) => {
    const condition = '!%s.hasOwnProperty("%s")';
    const error = tpl.error('required', name);

    tpl(`if (${condition}) ${error}`, tpl.data, name);
  });
  tpl('}');
};
