import { hasProperty } from '../utils';
import { make as makeSchema } from '../utils/schema';

export function constant(schema, tpl) {
  if (!hasProperty(schema, 'const')) {
    return;
  }

  const constantInstanceSchema = makeSchema(schema.const);
  tpl.visit(constantInstanceSchema);
};
