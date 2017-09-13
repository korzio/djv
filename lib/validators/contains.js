const { hasProperty } = require('../utils');

module.exports = function contains(schema, tpl) {
  if (!hasProperty(schema, 'contains')) {
    return;
  }

  const error = tpl.error('contains');
  const fn = `${tpl.link(schema.contains)}`;
  const condition = `${fn}(%s)`;

  tpl('if (Array.isArray(%s)) {', tpl.data);
  tpl(`if (%s.length === 0) ${error}`, tpl.data);
  tpl('for ($1; $2 < $3.length; $2++) {', tpl.cache('0'), tpl.cache('0'), tpl.data);
  tpl.data.push(`[${tpl.cache('0')}]`);
  tpl(`if (!${condition}) break;`, tpl.data);
  tpl.data.pop();
  tpl(`if ($1 === $2.length - 1) ${error}`, tpl.cache('0'), tpl.data);
  tpl('}');
  tpl('}');
};
