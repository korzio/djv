const assert = require('assert');
const { makePath } = require('../../lib/utils');

describe('uri', () => {
  describe('makePath()', () => {
    it('should exist', () => {
      assert.equal(typeof makePath, 'function');
    });

    // @see https://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.2
    const tests = [
      { name: '#', parts: ['http://x.y.z/rootschema.json#'], res: 'http://x.y.z/rootschema.json#' },
      { name: '#/schema1', parts: ['http://x.y.z/rootschema.json#', '#foo'], res: 'http://x.y.z/rootschema.json#foo' },
      { name: '#/schema2', parts: ['http://x.y.z/rootschema.json#', 'otherschema.json'], res: 'http://x.y.z/otherschema.json#' },
      { name: '#/schema2/nested', parts: ['http://x.y.z/rootschema.json#', 'otherschema.json', '#bar'], res: 'http://x.y.z/otherschema.json#bar' },
      { name: '#/schema2/alsonested', parts: ['http://x.y.z/rootschema.json#', 't/inner.json#a'], res: 'http://x.y.z/t/inner.json#a' },
      { name: '#/schema3', parts: ['http://x.y.z/rootschema.json#', 'some://where.else/completely#'], res: 'some://where.else/completely#' },
      {
        name: '#/custom1',
        parts: [
          'http://localhost:1234/object',
          'name.json#/definitions/orNull',
          'name.json#/definitions/orNull'
        ],
        res: 'http://localhost:1234/name.json#/definitions/orNull'
      }
    ];

    tests.forEach((test) => {
      it(`should make correct path for ${test.name}`, () => {
        assert.equal(makePath(test.parts), test.res);
      });
    });
  });
});
