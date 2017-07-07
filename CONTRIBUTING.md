# Contributing to djv <a name="title"></a>

This guide contains the information about to contribute to djv library.

## Table of contents <a name="content"></a>

1. [Contributing to djv](#title)
2. [Table of contents](#content)
3. [How to](#howto)
    1. [Debug tests](#tests)
    2. [Debug json-schema-test-suite](#test-suite)

## How to <a name="howto"></a>

This section contains help hints how to

### Debug tests <a name="tests"></a>

When some of the tests are failing use the following `vscode` configuration

```json
// windows
{
  "type": "node",
  "request": "launch",
  "name": "debug tests",
  "program": "${workspaceRoot}\\node_modules\\jasmine\\bin\\jasmine",
  "cwd": "${workspaceRoot}\\",
  "args": [
    "JASMINE_CONFIG_PATH=package.json"
  ]
},
// other
{
  "type": "node",
  "request": "launch",
  "name": "debug tests",
  "program": "${workspaceRoot}/node_modules/jasmine/bin/jasmine",
  "cwd": "${workspaceRoot}/",
  "args": [
    "JASMINE_CONFIG_PATH=package.json"
  ]
},
```

Put a debugger on `node_modules/json-schema-test-suite/index.js:147`
```javascript
testCase.result = validator.validate(testCase.data);
// something like
if(~testCase.description.indexOf('no additional items present')) {
  debugger;
}
```

### Debug json-schema-test-suite <a name="test-suite"></a>

For windows remove the following lines from `testRunner.js`

```js
require('child_process').exec('rm -f ' + path.join(__dirname, '/reports/*.md'), function (err) {
  if (err) {
    console.error('Error removing old reports');
    console.error(err);
  }
...
});
```

Put a debugger on `node_modules\json-schema-benchmark\testRunner.js`

:119 for generate

:139 for validate

```javascript
givenResult = validator.test(validatorInstance, test.data, testSuite.schema);
// something like
if(~testSuite.description.indexOf('an array of schemas for items')) {
  debugger;
}
```
