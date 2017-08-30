const { hasProperty } = require('../utils');

module.exports = function items(schema, tpl) {
  if (!hasProperty(schema, 'items')) {
    return;
  }

  tpl('if(Array.isArray(%s)) {', tpl.data);
  if (Array.isArray(schema.items)) {
    if (schema.additionalItems === false) {
      tpl('if (%s.length > %s)', tpl.data, schema.items.length)(tpl.error('additionalItems'));
    }

    schema.items.forEach((subSchema, index) => {
      tpl(`if(%s.length > ${index}) {`, tpl.data);
      tpl.data.push(`[${index}]`);
      tpl.visit(subSchema);
      tpl.data.pop();
      tpl('}');
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
  tpl('}');
};
