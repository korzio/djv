import { hasProperty } from '../utils';

export default function anyOf(schema, tpl) {
  if (!hasProperty(schema, 'anyOf')) {
    return;
  }

  const error = tpl.error('anyOf');
  const condition = schema.anyOf
    .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .join(' && ');

  tpl(`if (${condition}) ${error}`);
};
