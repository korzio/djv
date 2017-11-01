const djv = require('../../');
const assert = require('assert');

const env = djv({
  errorHandler: function customErrorHandler(errorType, property) {
    return `errors.push({
      type: "${errorType}",
      property: "${property}",
    });`;
  }
});

const jsonSchema = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  title: 'Product',
  description: 'A product from Acme\'s catalog',
  type: 'object',
  properties: {
    id: {
      description: 'The unique identifier for a product',
      type: 'integer'
    },
    name: {
      description: 'Name of the product',
      type: 'string'
    },
    price: {
      type: 'number',
      exclusiveMinimum: 0
    }
  },
  required: ['id', 'name', 'price']
};

const product = {
  id: 'asdf', // Should be number
  name: 'A green door',
  price: 12.50
};

// Use `addSchema` to add json schema
env.addSchema('test', jsonSchema);

const error = env.validate('test', product);
assert.deepEqual(error, [{ type: 'type', property: 'integer' }]);
