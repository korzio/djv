import { hasProperty } from '../utils';

export default function propertyNames(schema, tpl) {
  if (!hasProperty(schema, 'propertyNames')) {
    return;
  }

  const fn = tpl.link(schema.propertyNames);
  const error = tpl.error('propertyNames');

  tpl(`if (Object.keys(${tpl.data}).some(${fn})) ${error}`);
};
