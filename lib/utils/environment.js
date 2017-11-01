/**
 * @module environment
 * @description
 * Update the given environment
 */
const properties = require('./properties');
const keywords = require('./keywords');
const validators = require('../validators');
const formats = require('./formats');
const { keys } = require('./uri');
const { transformation } = require('./schema');

const environmentConfig = {};

function add(version, config) {
  environmentConfig[version] = config;
}

function use(version) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment({
    properties,
    keywords,
    validators,
    formats,
    keys,
    transformation,
  });
}

module.exports = {
  add,
  use,
};
