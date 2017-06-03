function State(schema, { resolved }) {
  this.push(schema);

  Object.assign(this, {
    current: [0],
    context: [],
    entries: new Map(),
  }, resolved);
}

State.prototype = Object.assign(Object.create(Array.prototype), {
  getContext(reference) {
    return this.entries.get(reference);
  },
  addContext(reference, context) {
    this.entries.set(reference, context);
    return this.context.push(context);
  }
});

module.exports = State;
