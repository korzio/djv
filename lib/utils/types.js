module.exports = {
  null: '%s !== null',
  string: 'typeof %s !== "string"',
  boolean: 'typeof %s !== "boolean"',
  number: 'typeof %s !== "number" || %s !== %s',
  integer: 'typeof %s !== "number" || %s % 1 !== 0',
  object: '!%s || typeof %s !== "object" || Array.isArray(%s)',
  array: '!Array.isArray(%s)',
  date: '!(%s instanceof Date)'
};
