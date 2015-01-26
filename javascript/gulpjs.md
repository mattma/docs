# Gulp

gulp is simply vinyl, vinyl-fs, orchestrator, a CLI, and a set of guidelines to help people make good plugins.

## Concept

#### Stream

Streams are a way of piecing small transform operations together into a pipeline. You drop things in the top, they fall through all of the transforms, and you end up with things coming out the bottom. Streams are a flexible system that solve the problem of file transformations very well.

#### [Vinyl](https://github.com/wearefractal/vinyl)

Vinyl is a very simple metadata object that describes a file. When you think of a file, two attributes come to mind: path and contents. These are the main attributes on a Vinyl object. Vinyl describe files from all of these sources, computer’s file system, files on S3, FTP, Dropbox, Box, CloudThingly.io and other services.

#### Vinyl Adapters

While Vinyl provides a clean way to describe a file, we now need a way to access these files. Each file source needs what I call a “Vinyl adapter”. A Vinyl adapter simply exposes a .src(globs), a .dest(folder), and a .watch(globs, fn). The src stream produces file objects, and the dest stream consumes file objects.

A “gulp plugin” is a transform stream.  The idea of being able to use gulp as a deployment tool via vinyl adapters is intriguing.

If you use gulp, you have used the `vinyl-fs` module. It is the adapter for your local file system. `gulp-s3` doesn’t provide all of the functionality required but it should provide a decent stopgap.

#### Orchestrator

the current task system is [Orchestrator](https://github.com/orchestrator/orchestrator). It provides an easy way to define tasks, task dependencies, and run tasks with maximum concurrency while respecting the dependency tree.

New Orchestrator: small implementation, low complexity, and composable functional-leaning APIs.

#### gulp 4

- You specify your task ordering, so parallel/series and any combination of those is possible. Your imagination is the limit, the technical barriers will be lifted.
- The API will be fluent and looks crazy good
- The code base will be simpler

Here is the [list](https://github.com/gulpjs/gulp/issues?milestone=1&q=is%3Aopen) of remain gulp 4 bugs.

## Errors

Within gulp, we have two types of errors you can encounter:

1. A task fails

When a task fails the internals of watch get messed up and you may encounter a process exit depending on how the task was started. This is bad and should never have happened, but it did and it will be fixed with the new task system.

2. A piece of a pipeline fails

The standard Stream behavior is to simply stop working when an error happens. For tasks like linters, you can see how this is an issue. I want to see all of the linting issues, not only the ones from the first file that passed through. To get technical, this is due to the **unpipe** event. Essentially what happens is when a stream encounters an error, it emits this event which tells streams to stop writing data to it. There are some hacky workarounds like gulp-plumber that can be used as a stopgap, but I’m pleased to say that I have decided to bring this functionality into gulp core.

## Write a plugin

- do one thing, and do it well, must be tested
- Add `gulpplugin` as a keyword in your package.json so show up on search
- Do not throw errors inside a stream
  - Instead, you should emit it as an error event.
  - If you encounter an error outside the stream, such as invalid configuration while creating the stream, you may throw it.
- Prefix any errors with the name of your plugin
  - Ex error message: `gulp-replace: Cannot do regexp replace on a stream`
  - Ex code: `new gutil.PluginError('gulp-replace', 'Cannot do regexp replace on a stream', {showStack: true});`
- The type of `file.contents` should always be the same going out as it was when it came in
  - If `file.contents` is null (non-read) just ignore the file and pass it along
  - If `file.contents` is a Stream and you don't support that just emit an error
- Do not pass the `file` object downstream until you are done with it
- Use `file.clone()` when cloning a file or creating a new one based on a file.
- Do NOT require `gulp` as a dependency or peerDependency in your plugin
  - Using `gulp` to test or automate your plugin workflow and put it as a devDependency
  - There is no reason you should be using gulp within your actual plugin code.

#### Plugin Boilerplate

Available properties and methods

- `file.sourceMap`
- `file.relative`
- `file.contents`

- file.isNull()
- file.isStream()
- file.isBuffer()

```js
'use strict';

var through = require('through2');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-plugin-name';

function compile(contents, opts){
  // contents: `file.contents` infomration
  // opts: user passed in options or default options
  return something_useful;
}

function getOptions(opts){
  // opts will always win, override default values
  return defaults(clone(opts) || {}, {
    deps: null
  });
}

module.exports = function(options){
  function pluginName(file, enc, cb){
    var opts = getOptions(options);

    // Optional: handle the `file` is not existed
    if (file.isNull()) {
      return cb(null, file);  // return an empty file
    }

    // Do not do streams by gulp design
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if(file.isBuffer()){
      // Transformation magic happens here.
      // `file.contents` type should always be the same going out as it was when it came in
      var operation = compile(String(file.contents), opts);
      file.contents = new Buffer(operation);
    }

    this.push(file);
    cb();
  }

  return through.obj(pluginName);
};
```

```js
// use the plugin above
gulp.src(filename)
  .pipe(pluginName({
    deps: 'some_deps'
  }));
```
