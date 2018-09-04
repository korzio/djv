# Contributing to djv <a name="title"></a>

This guide contains the information about to contribute to djv library.

## Table of contents <a name="content"></a>

* [Contributing to djv](#title)
* [Table of contents](#content)
* [How to](#howto)
  * [Debug tests](#tests)
  * [Release](#release)

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
}
```

For json-schema-test suite put a debugger on `node_modules/json-schema-test/index.js:147`
```javascript
testCase.result = validator.validate(testCase.data);
// something like
if(~test.description.indexOf('no additional items present')) {
  debugger;
}
return doTest(validators)
```

### Release <a name="release"></a>

To release a package to npm follow the steps

- [ ] Create a release ticket in github. Copy this checklist.
- [ ] Make a release branch
```sh
VERSION="..."
VERSIONALPHA="$VERSION-alpha.0"
ISSUE="..."

git checkout -b release/$VERSION
```
- [ ] Update package.json version to $VERSIONALPHA and commit
```sh
git add .
git commit -m "release: Update package version to $VERSIONALPHA #$ISSUE"
```
- [ ] Tag with the alpha version
```sh
git tag $VERSIONALPHA
```
- [ ] Publish test npm version $VERSIONALPHA
```sh
npm publish
```
- [ ] Check package internals - contains all required files (`lib/`, `README.md`, `./djv.js`, `package.json`, ...), no extra files
- [ ] Check with updated json-schema test suite - check generated report
- [ ] Check speed metrics
- [ ] Update package.json version to $VERSION and commit
```sh
git commit -m "release: Update package version to $VERSION #$ISSUE"
```
- [ ] Create a changelog
```sh
npm run changelog
```
- [ ] Update Readme
- [ ] Tag $VERSION
```sh
git tag $VERSION
```
- [ ] Merge release branch to master (via github)
- [ ] Publish version $VERSION
```sh
npm publish
```
- [ ] Send update to gitter
