import properties from '../utils/properties';
import keywords from '../utils/keywords';
import { asExpression } from '../utils';

export default function property(schema, tpl) {
  Object.keys(schema)
    .forEach((key) => {
      if (keywords.indexOf(key) !== -1 || key === 'format') {
        return;
      }

      const condition = asExpression(properties[key], schema, tpl);
      if (!condition) {
        return;
      }
      const error = tpl.error(key);

      tpl(`if (${condition}) ${error}`, tpl.data, schema[key]);
    });
};
