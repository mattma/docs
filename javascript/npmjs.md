#### Introspecting package.json

`require()` can read and parse JSON files automatically, you can leverage it to easily introspect package.json:

```js
// considering the module lives in lib/module.js:
exports.version = require('../package').version;
// If you want to access package.json for other modules
require('my-module/package').name
```

#### Linking

leverage `npm link` to generate a global reference to a module, and then run `npm link <package>` to install it in other modules. ex: in which moduleB depends on the version of moduleA you’re currently developing, and moduleB specifies "moduleA" as a dependency in its package.json

```bash
cd moduleA/
npm link
cd ../moduleB

# if moduleB package.json is pointing to a yet-unpublished
# version of moduleA, npm install will fail:
npm install

# this will install your local version of moduleA
npm link moduleA

# since moduleA is now installed, npm install will ignore it:
npm install
```

#### Production flags

When deploying, you want `npm install` to be as fast as possible. To make sure NPM doesn’t waste time installing `devDependencies`, use the --production option:

```bash
npm install --production
```

If you’re logging its output, you also want it to only output the absolutely necessary.

```bash
npm install --loglevel warn
```

#### Git dependencies

point to a git:// URI instead of a version number in your `package.json`

```json
"dependencies": {
    "public": "git://github.com/user/repo.git#ref",
    "private": "git+ssh://git@github.com:user/repo.git#ref"
}
```

The `#ref` portion is optional, and it can be a branch (like master), tag (like 0.0.1) or a partial or full commit id. I recommend you use git tags as references to ensure npm install always keeps the module up to date.

#### Local binaries

Avoid referencing globally installed binaries, Instead, point it to the local node_modules, which installs the binaries in a hidden .bin directory:

```json
"scripts": {
  "test": "node_modules/.bin/mocha mytest.js",
  "build": "uglify mycode.js"
}
```

Make sure the module (in this case "mocha") is in your package.json under devDependencies, so that the binary is placed there when you run npm install.

```bash
# usage
npm run-script test
npm run-script build
npm test # shortcut for `run-script test`
```

#### Private repositories

If you never intend to publish a certain module, and you want to avoid accidental publication, make sure to set private like this in your package.json:

```json
"private": true
```

If you have many private repositories, you might want to consider setting up your own registry, in which case the configuration would look something like this:

```json
"publishConfig": { "registry": "https://yourregistry:1337/" }
```

#### Shrinkwrapping

`npm shrinkwrap` will generate a snapshot of the dependency graph suitable for deployments.
