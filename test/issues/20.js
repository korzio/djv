const djv = require('../../');
const fs = require('fs');

const JSONSchemaDraftV4 = require('../resources/draft-04-schema.json');
const Swagger2 = require('../resources/swagger.json');

const env = new djv();

env.addSchema('json-schema-draft-v4', JSONSchemaDraftV4);
env.addSchema('swagger2', Swagger2);

// env.validate('swagger2', {});
console.log("finished");