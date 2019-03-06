module.exports = function required(schema, tpl) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  tpl(`if (${tpl.data} !== null && typeof ${tpl.data} === 'object' && !Array.isArray(${tpl.data})) {
    ${schema.required.map((name) => {
      const condition = `!${tpl.data}.hasOwnProperty("${name}")`;
      const error = tpl.error('required', name);
      return `if (${condition}) ${error}`;
    }).join('')}
  }`);
};
