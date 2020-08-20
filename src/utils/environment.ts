/**
 * @module environment
 * @description
 * Update the given environment
 */
import properties from './properties';

import keywords from './keywords';
import { Validators } from '../validators';
import formats from './formats';
import { keys } from './uri';
import { transformation } from './schema';

type envConf = {
  [key: string]: Function | undefined;
}

const environmentConfig: envConf = {};

function add(version: string, config: Function) {
  environmentConfig[version] = config;
}

function use(version?: string) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment({
    properties,
    keywords,
    validators: {
      name: Validators.name,
      list: Validators.list,
    },
    formats,
    keys,
    transformation,
  });
}

export {
  add,
  use,
};
