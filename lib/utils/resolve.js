module.exports = function resolve(reference, state) {
  if (reference === '#') {
    return 0;
  }

  if (typeof reference !== 'string') {
    return reference;
  }

  const referenceParts = reference.split(/#\/?/);
  const name = referenceParts[1];
  const components = name && name.split('/');
  let uri = referenceParts[0] || '#';
  let currentSchema;

  if (uri === '#') {
    currentSchema = state[state.current[state.current.length - 1]];
  } else {
    if (!Object.prototype.hasOwnProperty.call(state, uri)) {
      uri = state.slice(state.current[state.current.length - 1] + 1).map(schema => schema.id).join('') + uri;
    }

    currentSchema = state[uri].schema;
  }

  state.current.push(state.length);
  state.push(currentSchema);

  while (components && components.length > 0) {
    const currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
    if (!Object.prototype.hasOwnProperty.call(currentSchema, currentPath)) {
      throw new Error('Schema not found');
    }

    currentSchema = currentSchema[currentPath];
    state.push(currentSchema);
    components.shift();
  }

  return currentSchema;
}