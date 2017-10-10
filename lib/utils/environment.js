/**
 * @module environment
 * @description
 * Update the given environment
 */
const exposedProperties = require('./properties');
const exposedKeywords = require('./keywords');
const exposedValidators = require('../validators');
const exposedFormats = require('./formats');
const { keys: exposedKeys } = require('./uri');
const { transformation: exposedTransformation } = require('./schema');

const exposed = {
  properties: exposedProperties,
  keywords: exposedKeywords,
  validators: exposedValidators,
  formats: exposedFormats,
  keys: exposedKeys,
  transformation: exposedTransformation,
};

const environmentConfig = {};

function add(version, config) {
  environmentConfig[version] = config;
}

function use(version) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment(exposed);
}

module.exports = {
  add,
  use,
};
