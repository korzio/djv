const { hasProperty } = require('../utils');

module.exports = function items(schema, tpl) {
  if (!hasProperty(schema, 'items')) {
    return;
  }

  const itemsLength = schema.items.length;
  const error = tpl.error('additionalItems');
  const { data } = tpl;

  tpl(`if(Array.isArray(${data})) {`);
  if (Array.isArray(schema.items)) {
    if (schema.additionalItems === false) {
      tpl(`if (${data}.length > ${itemsLength}) ${error}`);
    }

    schema.items.forEach((subSchema, index) => {
      tpl(`if(${data}.length > ${index}) {`);
      data.push(`[${index}]`);
      tpl.visit(subSchema);
      data.pop();
      tpl('}');
    });

    if (typeof schema.additionalItems === 'object') {
      const zeroIndex = tpl.cache(itemsLength);
      const index = tpl.cache(itemsLength);

      tpl(`for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {`);
      data.push(`[${tpl.cache(itemsLength)}]`);
      tpl.visit(schema.additionalItems);
      data.pop();
      tpl('}');
    }
  } else {
    const zeroIndex = tpl.cache('0');
    const index = tpl.cache('0');

    tpl(`for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {`);
    data.push(`[${index}]`);
    tpl.visit(schema.items);
    data.pop();
    tpl('}');
  }
  tpl('}');
};
