/**
 * @module environment
 * @description
 * Update the given environment
 */
import properties from './properties';

import keywords from './keywords';
import validators from '../validators';
import formats from './formats';
import { keys } from './uri';
import { transformation } from './schema';

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

export {
  add,
  use,
};
