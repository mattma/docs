# [ember-cli](https://github.com/ember-cli/ember-cli)

Ember CLI parse arguments and calls the respective command, command calls a sequence of tasks, tasks do the acutal work.

## Architecture

#### UI

Pass an `UI` instance around. Instead of calling `console.log` or writing things directly to `process.stdout` we access those through this wrapper. This makes our code testing friendly because it lets us simulate user input and it lets us verify if the output matches the expected output in tests.

1. ui.prompt(options).then(...)

get user input. It wraps the [inquirer node package](https://github.com/SBoudrias/Inquirer.js).

2. ui.write()

write something to the output stream. It's just `this.outputStream.write(data);` internally.

3. ui.inputStream, ui.outputStream

used for things that require a stream. Also nice for testing, e.g. simulating input.

#### Commands

Located in `lib/commands/`. They get picked up by `requireAsHash()` automatically.

Best practice is to use the `run()` function only to execute tasks. The promise returned by `run()` should either  1) resolve to undefined,  2) reject with an `Error` instance if the error is unhandled   3) or reject with `undefined` if it was handled. In this case the command should log something via the `ui` first.

`requireAsHash()` assembles from the files in `commands/` a hash that looks like this:

```JavaScript
{
  DevelopEmberCLI: require('commands/develop-ember-cli')
}
```

##### Formatting colors

- white: `ember serve`
- yellow: `<arg-option `, `>`
- cyan: `--port`, `--important-option`
- cyan: `(Default: something)`, `(Default: 4200)`
- white: `Description 1`, `Description 2`
- cyan: `(Required)`

#### Tasks

Located in `lib/tasks`. They get picked up by `requireAsHash()` automatically.

Tasks do the real work. They should do only one thing. They should not call other tasks, That's because the
task sequence is determined by the command and thus should be declared there. So, tasks don't have a return value per design.

#### StyleGuide

- Everything Promise based ( use: lib/ext/promise)
- Everything async (except require)
- Short files
- Tests, tests, tests
- Recommended line length <= 80 characters
- No `console.log`, we've our own logging system
- HTML and CSS: Double quotes, JavaScript: Single quotes
- Naming conventions
  - Dasherized (`some-thing`)
    - file, folder and package names
    - CSS classes
    - HTML tags and attributes
    - Model relationships
  - Camel case (`someThing`)
    - JavaScript (and JSON) properties and variables
  - Pascal case (`SomeThing`)
    - JavaScript class names
  - Acronyms:
    - Okay: `url`, `id`, `rootURL` (property) or `URL`, `URLParser` (class)
    - Wrong: `Url`,`rootUrl`
    - We stick with how it's done in ember -> `rootURL`
- No comma separated var statements (`var cool = 123, supercool = 456;`)
- Line break at the end of every file
- Make constructors take an options object to avoid order-dependence

This list only contains style decisions not already covered by JSHint (e.g.
mandatory semicolons and other rules are omitted).

#### Sync vs async

[JavaScript uses an event loop](http://nodejs.org/about/), the use of blocking and compute intensive operations is discouraged. The general recommendation is to use asynchronous operations.

However, there are exceptions. Node's own `require` statement is synchronous. It is mainly used at program startup and only for a handful of files. Consequently, although it being synchronous, using it is harmless. Same thing goes for synchronous file globs in combination with `require` at startup.

## Runtime Configuration

Ember CLI can use a configuration file named `.ember-cli` in your home directory. In this file you can include any command-line options in a json file with the commands camelized; as in the following example:

```json
// ~/.ember-cli
{
  "skipGit" : true,
  "port" : 999,
  "host" : "0.1.0.1",
  "liveReload" : true,
  "environment" : "mock-development",
  "checkForUpdates" : false
}
```

## Using global variables or external scripts

If you want to use external libraries that write to a global namespace (e.g. moment.js), you need to add those to the `predef` section of your project’s `.jshintrc` file and set its value to true. If you use the lib in tests, you need to add it to your `tests/.jshintrc` file, too.

## Content security policy

Ember CLI comes bundled with the [ember-cli-content-security-policy](https://github.com/rwjblue/ember-cli-content-security-policy) addon which enables the [Content Security Policy](http://content-security-policy.com/) in modern browsers when running the development server. When enabled, the Content Security Policy guards your application against the risks of XSS attacks. While browser support is still limited, ember-cli makes it easy to build your app with the CSP in mind. This means enabling it on your production stack will mean little more than adding the correct header.

The default header sent by the addon sends a policy where only content from 'self' is allowed. It means the browser will restrict your app from loading assets and data outside of localhost:4200 or doing any inline style or script modifications. If your app does any of these, you’ll see a lot of these errors:

`Refused to execute inline script because it violates the following Content Security Policy directive: ...`

Note:

when running `ember serve` with live reload enabled, we also add the `liveReloadPort` to the `connect-src` and `script-src`whitelists.
when running in development we add 'unsafe-eval' to the `script-src`. This is to allow the wrapInEval functionality that ember-cli does by default (as a sourcemaps "hack").
when setting the values on `contentSecurityPolicy` object to 'self', 'none', 'unsafe-inline','unsafe-eval','inline-script' or 'eval-script', you must include the single quote.


The default contentSecurityPolicy value is:

```js
contentSecurityPolicy: {
  'default-src': "'none'",
  'script-src': "'self'",
  'font-src': "'self'",
  'connect-src': "'self'",
  'img-src': "'self'",
  'style-src': "'self'",
  'media-src': "'self'"
}
```

```js
// config/environment.js
ENV.contentSecurityPolicy = {
  'default-src': "'none'",
  'script-src': "'self' https://cdn.mxpnl.com", // Allow scripts from https://cdn.mxpnl.com
  'font-src': "'self' http://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
  'connect-src': "'self' https://api.mixpanel.com http://custom-api.local", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
  'img-src': "'self'",
  'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
  'media-src': "'self'"
}
```

## Installtion

```bash
npm install -g ember-cli bower phantomjs
brew install watchman
```

## Ember-CLI

#### Useful commands

```bash
ember new <app-name> --skip-git  # Creates a folder called <app-name> and generates an application structure, without git init
ember build -o <output_path> -e <environment>  --watch # default to "/dist", "development", watch to keep process running
ember server --proxy http://127.0.0.1:3002  # proxy all your apps XHR/ajax to your server running at port 8080.

ember generate <generator-name> <options>  # ember help generate
ember g resource friends firstName:string lastName:string email:string twitter:string totalArticles:number # generate resources
ember g template friends/-form  # generate the partial template

ember test # Run tests with Testem on CI mode. You can pass any options to Testem through `testem.json`, by default we’ll search for it under your project’s root or you can specify `config-file`.
ember install  # Installs npm and bower dependencies
ember install <addon-name>  # Installs the given addon to your project and saves it to the package.json. It will run the addon’s defaultBlueprint if it provides one.
ember install:bower <packages>  # Installs the given bower dependencies to your project and saves them to the bower.json
```

#### Folder Layout

1. app/

Contains your Ember application’s code. Javascript files in this folder are compiled through the ES6 module transpiler and concatenated into a file called `app.js`

- app/index.html

includes multiple hooks - `{{content-for 'head'}}` and `{{content-for 'body'}}` - that can be used by Add-ons to inject content into your application’s head or body. These hooks need to be left in place for your application to function properly, but they can be safely ignored unless you are working directly with a particular add-on.

2. dist/

Contains the distributable (that is, optimized and self-contained) output of your application. Deploy this to your server!

3. public/

This folder will be copied verbatim into the root of your built application. Use this for assets that don’t have a build step, such as images or fonts.

4. tests/

Includes unit and integration tests for your app, as well as various helpers to load and run your tests.

5. tmp/

Various temporary output of build steps, as well as the debug output of your application (tmp/public).

6. vendor/

Your external dependencies not installed with Bower or Npm.

## USING MODULES & THE RESOLVER

looking up code in your application and converting its naming conventions into the actual classes, functions, and templates that Ember needs to resolve its dependencies.

ex: `app/routes/index.js` would result in a module called `your-app/routes/index`. Import `your-app/routes/index`, Ember finds this module and use the object that it exports.

require modules directly with the following syntax:

```js
import FooMixin from "./mixins/foo";
// using either a relative or absolute path
import FooMixin from "appname/mixins/foo";
```

#### Module Directory Naming Structure

All modules in the `app` folder can be loaded by the resolver but typically classes such as `mixins` and `utils` should be loaded manually with an import statement.

1. app/components/   # Components must have a dash in their name.
2. app/controllers/     # Child controllers are defined in sub-directories, `parent/child.js`
3. app/helpers/          # Must register your helpers by exporting `makeBoundHelper` or calling `registerBoundHelper` explicitly.
4. app/initializers/     # Initializers are loaded automatically.
5. app/routes/           # Child routes are defined in sub-directories, `parent/child.js`
6. app/serializers/     # Serializers for your models or adapter, where `model-name.js` or `adapter-name.js`
7. app/transforms/    # Transforms for custom Ember Data attributes, where `attribute-name.js` is the new attribute.
8. app/views/            # Sub-directories can be used for organization.

#### Resolving from template helpers

1. Partial template helper

`{{partial "foo"}}`  # Renders the template within `templates/foo.hbs`

2. View template helper

`{{view "foo"}}`    # Renders the view within views/foo.js

3. render template helper

`{{render "foo" <context>}}`  # Renders the view within `views/foo.js` using the controller within `controllers/foo.js` and the template `templates/foo.hbs`

4. resolving Handlebars helpers (Custom Handlebars helpers)

Located at `app/helpers`, registering your custom helper allows it to be invoked from any of your Handlebars templates. If your custom helper contains a dash(upper-case, reverse-word, etc.), it will be found and loaded automatically by the resolver.

```js
// app/helpers/upper-case.js
import Ember from "ember";
export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return value.toUpperCase();
});
// usage in *.hbs:  {{upper-case "foo"}}
```

Limiting automatically-loaded helpers to those that contain dashes is an explicit decision made by Ember. The other loading option is to define only the function used by the helper and to load it explicitly:

```js
// app/helpers/trim.js
export default function(value, options) {
  return value.trim();
};

// app.js
import Ember from "ember";
import trimHelper from './helpers/trim';
Ember.Handlebars.registerBoundHelper('trim', trimHelper);
//  usage in *.hbs: {{trim "     foo"}}
```

#### [Naming conentions](http://www.ember-cli.com/#module-directory-naming-structure)

Resolver uses filenames to create the associations correctly. Test filenames should be suffixed with `-test.js` in order to run.

* Dashes:       file names, folder names, html tags/ember components, CSS classes, URLs
* camelCase:  JavaScript, JSON

All filenames should be lowercased, Dasherized file and folder names are required

- Nested directories

`controllers/posts/new.js` results in a controller named `controllers.posts/new`. Note: You cannot use paths containing slashes in your templates because Handlebars will translate them back to dots.

- Pod structure

As your app gets bigger, a feature-driven structure may be better. Splitting your application by functionality/resource would give you more power and control to scale and maintain it. As a default, if the file is not found on the POD structure, the Resolver will look it up within the normal structure.

Rather than hold your resource folders on the root of your app you can define a POD path using the attribute `podModulePrefix` within your environment configs. The POD path should use the following format: `{appname}/{poddir}`.

```js
// config/environment.js
module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'my-new-app',
        // namespaced directory where resolver will look for your resource files
        podModulePrefix: 'my-new-app/pods',
        environment: environment,
        baseURL: '/',
        locationType: 'auto'
        //...
    };
    return ENV;
};
```

Then your folder structure would be:

app/pods/users/controller.js
app/pods/users/route.js
app/pods/users/template.hbs

## Ember Data

filenames should be all lowercase and dasherized - this is used by the Resolver automatically.

```js
// models/todo.js
import DS from "ember-data";
export default DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean'),
    quickNotes: DS.hasMany('quick-note')
});
```

#### Adapters & Serializers

Ember Data makes heavy use of per-type adapters and serializers. These objects can be resolved like any other.
Application-level (default) adapters and serializers should be named `adapters/application.js` and `serializers/application.js`

```js
// adapters/post.js
import DS from "ember-data";
export default DS.RESTAdapter.extend({})

// serializers/post.js
import DS from "ember-data";
export default DS.RESTSerializer.extend({});
```

#### Mocks and fixtures

Ember CLI comes with an `http-mock` generator which is preferred to fixtures for development and testing. Mocks can interact with your application’s adapters. Ember CLI cannot use Fixtures.

Note: Mocks are just for development and testing. The entire `/server` directory will be ignored during ember build.

```bash
# To create a mock for a posts API endpoint, use
ember g http-mock posts
```

A basic ExpressJS server will be scaffolded for your endpoint under `/your-app/server/mocks/posts.js`. Once you add the appropriate JSON response, you’re ready to go. The next time you run ember server, your new mock server will be listening for any API requests from your Ember app.

## ASSET COMPILATION

#### Raw Assets: `public/assets`, `app/styles`.

To add images, fonts, or other assets, place them in the `public/assets` folder.

For example, if you place `logo.png` in `public/assets/images`, you can reference it in templates with `assets/images/logo.png` or in stylesheets with `url('/assets/images/logo.png')`.

#### CSS

add your css styles to `app/styles/app.css` and it will be served at `assets/application-name.css`.

For example, to add bootstrap in your project you need to do the following:

```bash
ember install:bower bootstrap
```

```js
// In Brocfile.js. Tell Broccoli, add this file to be concatenated with our `vendor.css` file.
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
```

#### SASS

To use a CSS preprocessor, you’ll need to install the appropriate Broccoli plugin. All your preprocessed stylesheets will be compiled into one file and served at `assets/application-name.css`. Note: you can compile to [multiple output stylesheets](http://www.ember-cli.com/#configuring-output-paths)

```bash
ember install ember-cli-sass
```

#### Fingerprinting and CDN URLs

Fingerprinting is done using the addon [broccoli-asset-rev](https://github.com/rickharrison/broccoli-asset-rev)

When the environment is production (e.g. ember build --environment=production), the addon will automatically fingerprint your js, css, png, jpg, and gif assets by appending an md5 checksum to the end of their filename (e.g. assets/yourapp-9c2cbd818d09a4a742406c6cb8219b3b.js). In addition, your html, js, and css files will be re-written to include the new name. There are a few options you can pass in to EmberApp in your `Brocfile.js` to customize this behavior.

* enabled - Default: app.env === 'production' - Boolean. Enables fingerprinting if true. True by default if current environment is production.
* exclude - Default: [] - An array of strings. If a filename contains any item in the exclude array, it will not be fingerprinted.
* extensions - Default: ['js', 'css', 'png', 'jpg', 'gif'] - The file types to add md5 checksums.
* prepend - Default: '' - A string to prepend to all of the assets. Useful for CDN urls like https://subdomain.cloudfront.net/
* replaceExtensions - Default: ['html', 'css', 'js'] - The file types to replace source code with new checksum file names.

```js
// in Brocfile.js. exclude any file in the fonts/169929 directory as well as add a cloudfront domain to each fingerprinted asset.
var app = new EmberApp({
  fingerprint: {
    exclude: ['fonts/169929'],
    prepend: 'https://subdomain.cloudfront.net/'
  }
});
```

```js
<script src="assets/appname.js">
background: url('/images/foo.png');
// change to
<script src="https://subdomain.cloudfront.net/assets/appname-342b0f87ea609e6d349c7925d86bd597.js">
background: url('https://subdomain.cloudfront.net/images/foo-735d6c098496507e26bb40ecc8c1394d.png');
```

#### Application Configuration

Application configurations from your `Brocfile.js` file will be stored inside a special `meta` tag in `dist/index.html`.

sample meta tag: `<meta name="<proj-name>/config/environment" content="%7B%22modulePre.your.config">`

This meta tag is required for your ember application to function properly. If you prefer to have this tag be part of your compiled javascript files instead, you may use the `storeConfigInMeta` flag in `Brocfile.js`.

```js
// in Brocfile.js.
var app = new EmberApp({
  storeConfigInMeta: false
});
```

#### Configuring output paths

1. app/index.html   => /index.html
2. app/*.js               => /assets/<app-name>.js
3. app/styles/app.css   =>  /assets/<app-name>.css
4. other CSS files in app/styles  =>  same filename in /assets
5. JavaScript files you import with `app.import()`   =>  /assets/vendor.js
6. CSS files you import with app.import()  =>  /assets/vendor.css

To change these paths you can edit the `outputPaths` config option. The default setting is shown here:

```js
var app = new EmberApp({
  outputPaths: {
    app: {
      html: 'index.html',
      css: {
        // 'input-file-name-without-extension': 'output-to-location'
        'app': '/assets/application-name.css'
      },
      js: '/assets/application-name.js'
    },
    vendor: {
      css: '/assets/vendor.css',
      js: '/assets/vendor.js'
    }
  }
});

// When using CSS preprocessing, only the app/styles/app.scss (or .less etc) is compiled. If you need to process multiple files, you must add another key:
var app = new EmberApp({
  outputPaths: {
    app: {
      css: {
        'app': '/assets/application-name.css',
        'themes/alpha': '/assets/themes/alpha.css'
      }
    }
  }
});
```

#### Integration

When using Ember inside another project, you may want to launch Ember only when a specific route is accessed. If you’re preloading the Ember javascript before you access the route, you have to disable `autoRun`:

```js
var app = new EmberApp({
  autoRun: false
});
```

To manually run Ember: `require("app-name/app")["default"].create({/* app settings */});`

## [Testing](http://www.ember-cli.com/#testing)

Running existing tests. By default, your integration tests will run on PhantomJS. Test filenames should be suffixed with -test.js in order to run.

```bash
ember test                 # Way 1: will run your test-suite in your current shell once
ember test --server   # Way 2: will run your tests on every file-change
ember server     # Way 3:  http://localhost:4200/tests
```

If you have manually set the locationType in your environment.js to `hash` or `none` you need to update your `tests/index.html` to have absolute paths (/assets/vendor.css and /testem.js vs the default relative paths).

If you are capturing output from the Testem xunit reporter, use `ember test --silent` to silence unwanted output such as the ember-cli version. If you want to capture output to a file you can use report_file: "path/to/file.xml" in your testem.json config file.

#### Unit test methods

1. moduleFor(fullName, description, callbacks, delegate)
2. moduleForModel(name, description, callbacks)
3. moduleForComponent(name, description, callbacks)

#### Writing your own test helpers

In order to use these with `ember-cli` they must be registered before `startApp` is defined. Normally, define one helper per file or a group of helpers in one file.

```js
// helpers/routes-to.js    # Single helper per file
import Ember from "ember";
export default Ember.Test.registerAsyncHelper('routesTo', function (app, assert, url, route_name) {
  visit(url);
  andThen(function () {
    assert.equal(currentRouteName(), route_name, 'Expected ' + route_name + ', got: ' + currentRouteName());
  });
});

// Usage
// helpers/start-app.js
import routesTo from './routes-to';
export default function startApp(attrs) { }
```

```js
 // helpers/custom-helpers.js   # Group of helpers in one file, wrapped in a self calling function
 var customHelpers = function() {
   Ember.Test.registerHelper('myGreatHelper', function (app) {
     //do awesome test stuff
   });
   Ember.Test.registerAsyncHelper('myGreatAsyncHelper', function (app) {
     //do awesome test stuff
   });
 }();
 export default customHelpers;

 // Usage
 // helpers/start-app.js
 import customHelpers from './custom-helpers';
 export default function startApp(attrs) { }
```

Once your helpers are defined, you’ll want to ensure that they are listing in the .jshintrc file within the test directory.

```js
// /tests/.jshintrc
{
  "predef": [
    "myGreatHelper",
    "myGreatAsyncHelper"
```

## [MANAGING DEPENDENCIES](http://www.ember-cli.com/#managing-dependencies)

#### JS: Standard Non-AMD Asset

Note: Don’t forget to make JSHint happy by adding a /* global MY_GLOBAL */ to your module, or by defining it within the predefs section of your .jshintrc file.

Provide the asset path as the first and only argument:

```js
// Brocfile.js
app.import('bower_components/moment/moment.js');

// usage in the file
import Ember from 'ember';
/* global moment */ // No import for moment, it's a global called `moment`
var day = moment('Dec 25, 1995');
```

#### JS: Standard AMD Asset

Provide the asset path as the first argument, and the list of modules and exports as the second:

```js
app.import('bower_components/ic-ajax/dist/named-amd/main.js', {
    exports: {
        'ic-ajax': [
            'default',
            'defineFixture',
            'lookupFixture',
            'raw',
            'request'
        ]
    }
});

// Usage
import { raw as icAjaxRaw } from 'ic-ajax';  // to use ic.ajax.raw
icAjaxRaw( /* ... */ );
```

#### Environment Specific Assets

specify an object as the first parameter. That object’s key should be the environment name, and the value should be the asset to use in that environment.

```js
app.import({
  development: 'bower_components/ember/ember.js',
  production:  'bower_components/ember/ember.prod.js'
});
```

If you need to import an asset in one environment but not import it or any alternatives in other environments then you can wrap app.import in an if statement.

```js
if (app.env === 'development') {
  app.import('vendor/ember-renderspeed/ember-renderspeed.js');
}
```

#### Customizing a built-in Asset

```js
// asset from being automatically included in `vendor.js`
var app = new EmberApp({
  vendorFiles: {
    'handlebars.js': {
      production: 'bower_components/handlebars/handlebars.js'
    }
  }
});

// asset from being automatically excluded in `vendor.js`
var app = new EmberApp({
  vendorFiles: {
    'handlebars.js': false
  }
});
```

#### Test Assets

You may have additional libraries that should only be included when running tests (such as qunit-bdd or sinon). These can be imported into your app in your Brocfile.js:

Notes: - Be sure to pass { type: 'test' } as the second argument to app.import. This will ensure that your libraries are compiled into the test-support.js file.

```js
 var EmberApp = require('ember-cli/lib/broccoli/ember-app');
 var isProduction = EmberApp.env() === 'production';
 var app = new EmberApp();

 if ( !isProduction ) {
     app.import( app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' } );
     app.import( app.bowerDirectory + '/sinon-qunit/lib/sinon-qunit.js', { type: 'test' } );
 }
 module.exports = app.toTree();
```

####  app.import()

All other assets like images or fonts can also be added via import(). By default, they will be copied to `dist/` as they are. And use `app.import(css_path)` to include styles inside `vendor.css`

```js
// copy the file to dist/assets/fontawesome-webfont.ttf  in a different folder
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', {
  destDir: 'assets'
});
```

#### [Using broccoli-funnel](http://www.ember-cli.com/#using-broccoli-funnel)

(parts of) a bower-installed package can be used as assets as-is. First ensure that the Broccoli package needed to build are installed

```js
// Copy only the relevant files. For example the WOFF-files and stylesheets for a webfont:
var extraAssets = new Funnel('bower_components/a-lovely-webfont', {
  srcDir: '/',
  include: ['**/*.woff', '**/stylesheet.css'],
  destDir: '/assets/fonts'
});

// Providing additional trees to the `toTree` method will result in those
// trees being merged in the final output.
module.exports = app.toTree(extraAssets);
```

## AddOns and Blueprints

Add-ons are registered in NPM with a keyword of `ember-addon`. An addon can NOT be created inside an existing application. The addon/blueprints infrastructure is based on “convention over configuration” in accordance with the Ember philosophy.

#### install an addon

`ember install <package name> <options...>`

#### Addon scenarios

The Ember CLI addons API currently supports the following scenarios:

* Performing operations on the `EmberApp` created in the consuming application’s `Brocfile.js`
* Adding preprocessors to the default registry
* Providing a custom application tree to be merged with the consuming application
* Providing custom express (server) middlewares
* Adding custom/extra blueprints, typically for scaffolding application/project files
* Adding content to consuming applications

#### addon project structure

* app/ - merged with the application’s namespace.
* addon/ - part of the addon’s namespace.
* blueprints/ - contains any blueprints that come with the addon, each in a separate folder
* public/ - static files which will be available in the application as /your-addon/*
* tests/ - test infrastructure including a “dummy” app and acceptance test helpers.
* vendor/ - vendor specific files, such as stylesheets, fonts, external libs etc.
* Brocfile.js - Compilation configuration
* package.json - Node meta-data, dependencies etc.
* index.js - main Node entry point (as per npm conventions)

#### Create addon

```bash
ember addon ember-cli-x-button   # generate a new addon structure
```

- index.js: During the build process, the included hook on your addon will be called, allowing you to perform setup logic or modify the app or including addon:

```js
// index.js  <= this is the entrypoint of addon used by default in NPM
module.exports = {
  name: 'ember-cli-x-button',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    // Now you can modify the app / parentAddon. For example, if you wanted
    // to include a custom preprocessor, you could add it to the target's registry:
    //
    // target.registry.add('js', myPreprocessor);
  }
};
```

- index.js: Importing Dependency Files

`included` hook(index.js) is run during the build process. This is where you want to add import statements to actually bring in the dependency files for inclusion. Note that this is a separate step from adding the actual dependency itself—done in the default blueprint—which merely makes the dependency available for inclusion.

```js
// index.js
module.exports = {
  name: 'ember-cli-x-button',
  // This hook is called by the EmberApp constructor and gives access to the consuming application as app.
  // When the consuming application’s Brocfile.js is processed by Ember CLI to build/serve, the addon’s included function is called passing the EmberApp instance.
  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/x-button/dist/js/x-button.js');
    app.import(app.bowerDirectory + '/x-button/dist/css/x-button.css');
  }
};
```

- /public: drop in and Importing Static Files

To import static files such as images or fonts in the application include them in `/public`. The consuming application will have access to them via a directory with your addon’s name.

For example, to add an image, save it in `/public/images/foo.png`. In application stylesheet access as: `.foo {background: url("/your-addon/images/foo.png");}`

- index.js: Add content to `app/index.html`

If you want to add content to a page directly, you can use the `content-for` tag. An example of this is {{content-for 'head'}} in `app/index.html`, which Ember CLI uses to insert it’s own content at build time. Addons can access the contentFor hook to insert their own content.

This will insert the current environment the app is running under wherever {{content-for 'environment'}} is placed. The contentFor function will be called for each {{content-for}} tag in index.html.

```js
module.exports = {
  name: 'ember-cli-display-environment',
  contentFor: function(type, config) {
    if (type === 'environment') {
      return '<h1>' + config.environment + '</h1>';
    }
  }
};
```

- index.js:  Advanced customization: Hooks

In built customizations or want/need more advanced control, the following are some of the hooks (keys) available for your addon Object in the `index.js` file. All hooks expect a function as the value.

ex: https://github.com/poetic/ember-cli-cordova/blob/master/index.js
https://github.com/rwjblue/ember-cli-inject-live-reload/blob/master/index.js

```js
includedCommands: function() {},
blueprintsPath: // return path as String
preBuild:
postBuild:
treeFor:
contentFor:
included:
postprocessTree:
serverMiddleware:
```

- package.json: Configuring your ember-addon properties

```json
// package.json  <= NPM used
"ember-addon": {
  // addon configuration properties
  "configPath": "tests/dummy/config",
  // This blueprint will be run automatically when your addon is installed with the ember install command.
  "defaultBlueprint": "blueprint-that-isnt-package-name",
  // Optionally, run "before" or "after" any other Ember CLI addons: string or Array
  // Value is the name of the another Ember CLI addon, as defined in the package.json of the other addon.
  "before": "single-addon",
  "after": [
    "after-addon-1",
    "after-addon-2"
  ]
}
```

- Brocfile.js: configure the dummy application found in tests/dummy/. It is never referenced by applications which include the addon. If you need to use Brocfile.js, you may have to specify paths relative to the addon root directory.

```js
// Brocfile.js
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var app = new EmberAddon({
  lessOptions: {
    paths: ['tests/dummy/app/styles/'],
    outputFile: 'dummy.css'
  }
});
module.exports = app.toTree();
```

- addon/components/x-button.js:  The actual code for the addon goes in

```js
// components/x-button
import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'button',

  setupXbutton: function() {
    // ...
  }.on('didInsertElement'),

  teardownXbutton: function() {
    this.get('x-button').destroy();
  }.on('willDestroyElement'),
});
```

In order to allow the consuming application to use the addon component in a template directly you need to bridge the component via your addon’s `app/components` directory. Just import your component, and re-export it:

```js
// app/components/x-button.js
import Ember from 'ember';
import XButton from 'ember-cli-x-button/components/x-button';
export default XButton;
```

This setup allows others to modify the component by extending it while making the component available in the consuming applications namespace. This means anyone who installs your `x-button` addon can start using the component in their templates with {{x-button}} without any extra configuration.

- blueprints/ember-cli-x-button/index.js:  Default Blueprint

A blueprint with the same name as the addon (unless explicitly changed, see above) will be automatically run after install (in development, it must be manually run after linking). This is where you can tie your addon’s bower dependencies into the client app so that they actually get installed. (follows usual Ember blueprints naming conventions.)

```js
//blueprints/ember-cli-x-button/index.js
module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    return this.addBowerPackageToProject('x-button'); // is a promise
  }
};
```

#### Testing the addon with QUnit

The addon project contains a `/tests` folder which contains the necessary infrastructure to run and configure tests for the addon. The /tests folder has the following structure:

dummy/               # basic layout of a dummy app to be used for to host your addon for testing.
  helpers/             # various QUnit helpers that are provided and those you define yourself in order to keep your tests concise
  unit/                  # unit tests that test your addon in various usage scenarios
  index.html         # the test page that you can load in a browser to display the results of running your integration tests.
  test-helper.js     # the main helper file, reference from any of your unit test files
                           # It imports the resolver helper found in /helpers used to resolve pages in the dummy app

- Writing acceptance tests

add integration (acceptance) tests add an `integration/’ folder.

#### Create blueprint

A blueprint is a bundle of template files with optional installation logic. It is used to scaffold (generate) specific application files based on some arguments and options. You can define multiple blueprints for a single addon. The last loaded blueprint wins with respect to overriding existing (same name) blueprints that come with Ember or other addons (according to package load order.)

```bash
# To create a blueprint for your addon
# the main blueprint of the addon should have the same name as the addon itself
ember addon <blueprint-name> --blueprint
# Example: generate a folder `blueprints/x-button` for the addon where you can define your logic and templates for the blueprint.
ember addon x-button --blueprint
```

- Blueprint conventions

Blueprints are expected to be located under the `blueprints` folder in the addon root, just like blueprints overrides in your project root. Or custom path by `blueprintsPath` property. Check [Ember CLI BluePrint](https://github.com/ember-cli/ember-cli/tree/master/blueprints)

Note that the special file or folder called `__name__` will create a file/folder at that location in your app with the `__name__` replaced by the first argument (name) you pass to the blueprint being generated.

```bash
ember g x-button my-button  # generate a folder `app/components/my-button` in the application
```

#### Link to addon while developing

Check out [NPM Tricks](http://www.devthought.com/2012/02/17/npm-tricks/)

```bash
npm link  # from the root of your addon project, make your addon locally available by name.
npm link <addon-name>  # Make a link to your addon in your node_modules folder
```

Note: Remember that `npm link` will not run the default blueprint in the same way that `install` will, so you will have to do that manually via `ember g`. While testing an addon using npm link, you need an entry in package.json with your addon name, with any valid npm version: `"<addon-name>":"version"`. You can now run ember g <addon-name> in your project.

#### Publish addon

```bash
npm version 0.0.1
git push origin master
git push origin --tags
npm publish
```

#### Install and use addon

`ember install <your-addon-name-here>.` This will first install the addon from npm. Then, if we have a blueprint with the same name as our addon, it will run the blueprint automatically with the passed in arguments.

#### Updating addons

You can update an addon the same way you update an Ember app by running `ember init` in your project root.

## Genearators and Blueprints

#### Blueprints

snippet generators for many of the entities - models, controllers, components, and so on. Blueprints allow us to share common Ember patterns in the community and you can even define your own.

```bash
ember generate --help
ember g --help
ember g route foo   # generate a Route Blueprint.
ember help generate  #  a list of all available blueprints,
```

#### Defining a Custom Blueprint

```bash
ember generate blueprint <name>
ember generate blueprint foo  # ex
```

Blueprints in your project’s directory take precedence over those packaged with ember-cli. This makes it easy to override the built-in blueprints just by generating one with the same name.

#### Pods

You can generate certain built-in blueprints with a pods structure by passing the --pod option.

```bash
# podModulePrefix: app/pods     defined in your environment,
ember generate route foo --pod   # `app/pods/foo/route.js`
#  your generated pod path will be automatically prefixed with it.
```

The built-in blueprints that support pods structure are:  adapter, component, controller, model, route, resource, serializer, template, transform, view.  Blueprints that don’t support pods structure will simply ignore the --pod option and use the default structure.

```js
// .ember-cli.   use the Pod structure as the default for your project
{
    "usePods": true
}
```

#### Blurprint structure

- Blueprint does not support Pods

```bash
blueprints/helper
  ├── files
  │   ├── app
  │   │   └── helpers
  │   │       └── __name__.js
  └── index.js

blueprints/helper-test
  ├── files
  │   └── tests
  │       └── unit
  │           └── helpers
  │               └── __name__-test.js
  └── index.js
```

- Blueprint support Pods

```bash
blueprints/controller
  ├── files
  │   ├── app
  │   │   └── __path__
  │   │       └── __name__.js
  └── index.js

  blueprints/controller-test
  ├── files
  │   └── tests
  │       └── unit
  │           └── __path__
  │               └── __test__.js
  └── index.js
```

#### Files

files contains templates for the all the files to be installed into the target directory.

1. `__name__`

It is subtituted with the dasherized entity name at install time.
Ex: `ember generate controller foo`, then `__name__` becomes foo.
Ex: `ember generate controller foo --pod` then` __name__` becomes `controller`.

2. `__path__`

It is substituted with the blueprint name at install time.
Ex: `ember generate controller foo`, then `__path__` becomes `controller`.
Ex: `ember generate controller foo --pod`, then `__path__` becomes `foo` (or <podModulePrefix>/foo if the podModulePrefix is defined).
This token is primarily for pod support, and is only necessary if the blueprint can be used in pod structure. If the blueprint does not require pod support, simply use the blueprint name instead of the __path__ token.

3. `__test__`

It is substituted with the dasherized entity name and appended with `-test` at install time. This token is primarily for pod support and only necessary if the blueprint requires support for a pod structure. If the blueprint does not require pod support, simply use the `__name__` token instead.

#### Template Variables (AKA Locals)

Variables can be inserted into templates with `<%= someVariableName %>`

For example, the built-in util blueprint files/app/utils/__name__.js looks like this:

```js
export default function <%= camelizedModuleName %>() {
  return true;
}
```

The following template variables are provided by default:

* dasherizedPackageName
* classifiedPackageName
* dasherizedModuleName
* classifiedModuleName
* camelizedModuleName

* packageName is the project name as found in the project’s `package.json`.
* moduleName is the name of the entity being generated.

#### Blurprint index.js

Custom installation and uninstallation behaviour can be added by overriding the hooks documented below. index.js should export a plain object, which will extend the prototype of the `Blueprint` class. If needed, the original `Blueprint` prototype can be accessed through the `_super` property.

Blueprint Hooks:

1. locals

add custom template variables. Take one param: options. It must return an object. It will be merged with the aforementioned default locals.

```bash
ember generate controller foo --type=array --dry-run
# object passed to `locals`
{
  entity: {
    name: 'foo',
    options: {
      type: 'array'
    }
  },
  dryRun: true
}
```

2. normalizeEntityName

add custom normalization and validation of the provided entity name. The default hook does not make any changes to the entity name, but makes sure an entity name is present and that it doesn’t have a trailing slash.

This hook receives the entity name as its first argument. The string returned by this hook will be used as the new entity name.

3. fileMapTokens

add custom fileMap tokens for use in the mapFile method. The hook must return an object in the following pattern.

```js
{
  __token__: function(options){
    // logic to determine value goes here
    return 'value';
  }
}
```

It will be merged with the default fileMapTokens, and can be used to override any of the default tokens. Tokens are used in the files folder (see files), and get replaced with values when the mapFile method is called.

4. 5. beforeInstall, beforeUninstall

Called before any of the template files are processed and receives the same arguments as locals. Typically used for validating any additional command line options.

6. 7. afterInstall, afterUninstall

The afterInstall and afterUninstall hooks receives the same arguments as locals. Use it to perform any custom work after the files are processed. For example, the built-in route blueprint uses these hooks to add and remove relevant route declarations in app/router.js.

```js
 module.exports = {
  locals: function(options) {
    // Return custom template variables here.
    return {};
  },

  normalizeEntityName: function(entityName) {
    // Normalize and validate entity name here.
    return entityName;
  },

  fileMapTokens: function(options) {
    // Return custom tokens to be replaced in your files
    return {
      __token__: function(options){
        // logic to determine value goes here
        return 'value';
      }
    }
  },

  beforeInstall: function(options) {},
  afterInstall: function(options) {},
  beforeUninstall: function(options) {},
  afterUninstall: function(options) {}
};
```

#### Overriding Install

If you don’t want your blueprint to install the contents of files you can override the install method. It receives the same options object described above and must return a promise. See the built-in resource blueprint for an example of this.

## [ENVIRONMENTS](http://www.ember-cli.com/#Environments)

Managing your application’s environment. `config/environment.js`. define an ENV object for each environment (development and production by default).

The ENV object contains two important keys:

1. EmberENV     # define Ember feature flags (see the Feature Flags guide)
2. APP               # pass flags/options to your application instance.

You can access these environment variables in your application code by importing from `../config/environment` or `<your-application-name>/config/environment`.

```js
import ENV from 'your-application-name/config/environment';
if (ENV.environment === 'development') {
}
```

## Upgrading

```bash
npm uninstall -g ember-cli
npm cache clean
bower cache clean
npm install -g ember-cli@X.X.X
```

Project Update: Update your project’s package.json file to use the latest version of ember-cli, replacing X.X.X with the version of ember-cli you want to install

```bash
npm install ember-cli@X.X.X --save-dev
rm -rf node_modules bower_components dist tmp
npm install
bower install
# Run the new project blueprint on your projects directory. Please follow the prompts, and review all changes (tip: you can see a diff by pressing d).
ember init
```

When the upgrade process has completed, you should be able to issue the `ember -v` command and see that the version: noted in the resulting output matches the version you just upgraded to.

## Editor

#### WebStorm

1. Mark project ES6: File > Settings -> Languages & Frameworks -> JavaScript -> ECMAScript6
2. Mark `excluded`:  /tmp,  /dist
3. Mark `resource route`:  /, /bower_components, /bower_components/ember-qunit/lib, /public
4. mark `test sources root`:  /test

- excluded: To have WebStorm ignore the selected directory during indexing, parsing, code completion, etc.
- Resource Root: To enable WebStorm to complete relative paths to resources under the selected folder

## Use Canary Version of Ember

[Using canary build instead of release](http://www.ember-cli.com/#using-canary-build-instead-of-release)

## [DEPLOYMENTS](http://www.ember-cli.com/#deployments)

## Locking package versions

Adding dependency versions into your package.json fixes the dependency issue

```json
"dependencies": {
  "glob": "4.0.5",
  "rimraf": "2.2.8"
},
"bundledDependencies": [
  "glob",
  "rimraf"
]
```
