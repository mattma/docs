# [Through2](https://github.com/rvagg/through2)

A tiny wrapper around Node streams.Transform (Streams2) to avoid explicit subclassing noise

## API

1. through2(function(chunk, enc, cb) {  })

chuck:  content of `ex.txt` whatever the file in stream
enc:   encoding, default: Buffer
cb:   callback function

```js
fs.createReadStream('ex.txt')
  .pipe(through2(function (chunk, enc, cb) {

    for (var i = 0; i < chunk.length; i++)
      if (chunk[i] == 97)
        chunk[i] = 122 // swap 'a' for 'z'

    this.push(chunk)

    cb()
   }))
  .pipe(fs.createWriteStream('out.txt'))
```

`through2([ options, ] [ transformFunction ] [, flushFunction ])`

```js
fs.createReadStream('/tmp/important.dat')
  .pipe(through2({ objectMode: true, allowHalfOpen: false },
    function (chunk, enc, cb) {
      // error: null, 2nd arg is data or response as an alternative to this.push('wut?')
      cb(null, 'wut?')
    }
  )
  .pipe(fs.createWriteStream('/tmp/wut.txt'))
```

- transformFunction

Must have this signature: `function (chunk, encoding, v) {}`

Always call the `cb()` function to indicate that the transformation is done, even if that transformation means discarding the chunk.

To queue a new `chunk`, call `this.push(chunk)`—this can be called as many times as required before the `cb()` if you have multiple pieces to send on.

Alternatively, you may use `cb(err, chunk)` as shorthand for emitting a single `chunk` or an error.

If you **do not provide** a "transformFunction" then you will get a simple pass-through stream.

- flushFunction (optional)

called just prior to the stream ending. Can be used to finish up any processing that may be in progress.

```js
fs.createReadStream('/tmp/important.dat')
  .pipe(through2(
    function (chunk, enc, cb) { cb(null, chunk) }, // transform is a noop, pass-through stream
    function (cb) { // flush function
      this.push('tacking on an extra buffer to the end');
      cb();
    }
  ))
  .pipe(fs.createWriteStream('/tmp/wut.txt'));
```


2. through2.obj(function(chunk, enc, cb) {  })

object streams: a convenience wrapper around `through2({ objectMode: true }, fn)`, use `{objectMode: true}` if you are processing non-binary streams

```js
var all = []

fs.createReadStream('data.csv')
  .pipe(csv2())
  .pipe(through2.obj(function (chunk, enc, cb) {
    var data = {
        name    : chunk[0]
      , address : chunk[3]
      , phone   : chunk[10]
    }
    this.push(data)

    cb()
  }))
  .on('data', function (data) {
    all.push(data)
  })
  .on('end', function () {
    doSomethingSpecial(all)
  })
```

3. through2.ctor([ options, ] transformFunction[, flushFunction ])

Instead of returning a `stream.Transform` instance, `through2.ctor()` returns a constructor for a custom Transform. This is useful when you want to use the same transform logic in multiple instances.

```js
var FToC = through2.ctor({objectMode: true}, function (record, encoding, callback) {
  if (record.temp != null && record.unit = "F") {
    record.temp = ( ( record.temp - 32 ) * 5 ) / 9
    record.unit = "C"
  }
  this.push(record)
  callback()
})

// Create instances of FToC like so:
var converter = new FToC()
// Or:
var converter = FToC()
// Or specify/override options when you instantiate, if you prefer:
var converter = FToC({objectMode: true})
```
