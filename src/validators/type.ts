import types from '../utils/types';
import { hasProperty } from '../utils';
import { Validators } from '.';

const type: Validators.Validator = (schema, tpl) => {
  if (!hasProperty(schema, 'type')) {
    return;
  }

  const error = tpl.error('type', schema.type);
  const condition = `(${[].concat(schema.type).map(key => types[key]).join(') && (')})`;

  tpl(`if (${condition}) ${error}`, tpl.data);
}

export default type;
