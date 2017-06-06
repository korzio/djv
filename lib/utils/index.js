/**
 * @module utils
 * @description
 * Contains all utilities used inside djv project, including
 * - scope resolution (state),
 * - template
 * - keywords validators utilities (formats, types, properties)
 * - other (keywords, index)
 */
const types = require('./types');
const formats = require('./formats');
const State = require('./state');
const properties = require('./properties');
const keywords = require('./keywords');
const { template, restore, body } = require('./template');

module.exports = {
  body,
  formats,
  keywords,
  properties,
  restore,
  State,
  template,
  types,
};
