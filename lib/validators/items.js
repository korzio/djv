module.exports = function items(schema, tpl) {
  if (!schema.items) {
    return;
  }

  if (Array.isArray(schema.items)) {
    if (schema.additionalItems === false) {
      tpl('if (%s.length > %s)', tpl.data, schema.items.length)(tpl.error('additionalItems'));
    }

    schema.items.forEach((subSchema, index) => {
      tpl.data.push(`[${index}]`);
      tpl.visit(subSchema);
      tpl.data.pop();
    });

    if (typeof schema.additionalItems === 'object') {
      tpl('for ($1; $2 < $3.length; $2++) {', tpl.cache(schema.items.length), tpl.cache(schema.items.length), tpl.data);
      tpl.data.push(`[${tpl.cache(schema.items.length)}]`);
      tpl.visit(schema.additionalItems);
      tpl.data.pop();
      tpl('}');
    }
  } else {
    tpl('for ($1; $2 < $3.length; $2++) {', tpl.cache('0'), tpl.cache('0'), tpl.data);
    tpl.data.push(`[${tpl.cache('0')}]`);
    tpl.visit(schema.items);
    tpl.data.pop();
    tpl('}');
  }
};
