## NPM

- `npm run`

run any command in the package.json "scripts" field.

`npm test` and `npm start` are just shortcuts for `npm run test` and `npm run start` and you can use **npm** run to run whichever entries in the scripts field you want! **npm** will automatically set up `$PATH` to look in `node_modules/.bin`, so you can just run commands supplied by dependencies and devDependencies directly without doing a global install.

```js
// package.json
{
    "scripts": {
      "build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js",
      "build-css": "cat static/pages/*.css tabs/*/*.css",
      "build": "npm run build-js && npm run build-css",
      "watch-js": "watchify browser/main.js -o static/bundle.js -dv",
      "watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v",
      "watch": "npm run watch-js & npm run watch-css",
      "start": "node server.js",
      "test": "tap test/*.js",
      "build-js": "bin/build.sh"
    }
}
```
