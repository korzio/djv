const djv = require('../../');
const fs = require('fs');

const JSONSchemaDraftV4 = JSON.parse(fs.readFileSync('./../resources/draft-04-schema.json', 'utf-8'));
const Swagger2 = JSON.parse(fs.readFileSync('./../resources/swagger.json', 'utf-8'));

const env = new djv();

env.addSchema('json-schema-draft-v4', JSONSchemaDraftV4);
env.addSchema('swagger2', Swagger2);

// env.validate('swagger2', {});
console.log("finished");