## 1. [supertest](https://github.com/visionmedia/supertest)

HTTP assertions, provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by super-agent. Anything you can do with superagent, you can do with supertest.

### Usage

  ```js
    request(http.Server || function)
  ```

Note: if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.

### API

Can use any `super-agent` methods, including .write(), .pipe() etc and perform assertions in the .end() callback for lower-level needs.

- end(fn)

Perform the request and invoke fn(err, res).

- expect(status[, fn])

Assert response status code.

- expect(status, body[, fn])

Assert response status code and body.

- expect(body[, fn])

Assert response body text with a string, regular expression, or parsed body object.

- expect(field, value[, fn])

Assert header field value with a string or regular expression.

- expect(function(res) {})

Pass a custom assertion function. It'll be given the response object to check.
If the response is ok, it should return falsy, most commonly by not returning anything.
If the check fails, throw an error or return a truthy value like a string that'll be turned into an error.

example: Here the string or error throwing options are both demonstrated:

  ```js
    request(app)
      .get('/')
      .expect(hasPreviousAndNextKeys)
      .end(done);

    function hasPreviousAndNextKeys(res) {
      if (!('next' in res.body)) return "missing next key";
      if (!('prev' in res.body)) throw new Error("missing prev key");
    }
  ```

### Example

1- simple starter

  ```js
    it('should be supported', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.send('hello');
      });

      // s.address().port should return an random port
      var s = app.listen(function(){
        var url = 'http://localhost:' + s.address().port;
        request(url)
          .get('/')
          .expect("hello", done);
      });
    });

    it('should work with an active server', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.send('hey');
      });

      // cannot use server.address().port here. preset with 4000
      var server = app.listen(4000, function(){
        // options 1: work with an active server
        request(server)
        // options 2: work with remote server
        request('http://localhost:4000')
          .get('/')
          .end(function(err, res){
            res.should.have.status(200);
            res.text.should.equal('hey');
            done();
          });
      });
  ```

2- Mocha

  ```js
  describe('GET /users', function(){
    it('respond with json', function(done){
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // option 1:  pass `done` straight to any of the .expect() calls
        .expect(200, done);
        // option 2:  if using `.end()`, .expect() assertions that fail will not throw
        // return the assertion as an error to the .end() callback.
        // In order to fail the test case, you will need to rethrow or pass err to done(), as follows:
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done()
        });
    })
  })
  ```

3- Testing the same host you may simply re-assign the request variable with the initialization app or url, a new Test is created per request.VERB() call.

  ```js
  request = request('http://localhost:3001');

  request.get('/').expect(200, function(err){
    console.log(err);
  });
  ```

4- POST method

  ```js
    it('should work with .send() etc', function(done){
      var app = express();
      app.use(express.bodyParser());

      app.post('/', function(req, res){
        res.send(req.body.name);
      });

      request(app)
        .post('/')
        .send({ name: 'tobi' })
        .expect('tobi', done);
    })
  ```

5- Redirect example

  ```js
  it('should default redirects to 0', function(done){
    var app = express();

    app.get('/', function(req, res){
      res.redirect('/login');
    });

    request(app)
    .get('/')
    .expect(302, done);
  })
  ```

6- shows how to persist a request and its cookies

  ```js
  var request = require('supertest')
     , should = require('should')
     , express = require('express');

   var app = express();
    app.use(express.cookieParser());

  describe('request.agent(app)', function(){

    app.get('/', function(req, res){
      res.cookie('cookie', 'hey');
      res.send();
    });

    app.get('/return', function(req, res){
      if (req.cookies.cookie) res.send(req.cookies.cookie);
      else res.send(':(')
    });

    var agent = request.agent(app);

    it('should save cookies', function(done){
      agent
      .get('/')
      .expect('set-cookie', 'cookie=hey; Path=/', done);
    })

    it('should send cookies', function(done){
      agent
      .get('/return')
      .expect('hey', done);
    })
  })
  ```

## 2. [super-agent](https://github.com/visionmedia/superagent)
[DOC](http://visionmedia.github.io/superagent/)

Super Agent is light-weight progressive ajax API.

```js
    request
       .post('/api/pet')
       .send({ name: 'Manny', species: 'cat' })
       .set('X-API-Key', 'foobar')
       .set('Accept', 'application/json')
       .end(function(res){
         if (res.ok) {
           alert('yay got ' + JSON.stringify(res.body));
         } else {
           alert('Oh no! error ' + res.text);
         }
       });
```

### Request basics

A request can be initiated by invoking the appropriate method on the request object, then calling .end() to send the request.

**DELETE(.del()), HEAD(.head()), POST(.post()), PUT(.put()) and other HTTP verbs** may also be used, simply change the method name. The HTTP method defaults to `GET`. `DELETE` is a special-case, as it's a reserved word, so the method is named .del()

For example a simple GET request:

```js
     request
       .get('/search')  // option absolute url:    .get('http://example.com/search')
       .end(function(res){

       });

    // or this way
    request('GET', '/search').end(callback);
```

### Setting header fields

invoke .set() with a field name and value:

```js
     request
       .get('/search')
       // option 1: pass individual key-value pair
       .set('API-Key', 'foobar')
       .set('Accept', 'application/json')
       // option 2: pass an object
       .set({ 'API-Key': 'foobar', Accept: 'application/json' })
       .end(callback);
```

### GET requests

The .query() method accepts objects, which when used with the GET method will form a query-string.

```js
     // /search?query=Manny&range=1..5&order=desc.
     request
       .get('/search')
       .query({ query: 'Manny' })
       .query({ range: '1..5' })
       .query({ order: 'desc' })
       // option 2: pass an object
       .query({ query: 'Manny', range: '1..5', order: 'desc' })
       // option 3: pass an query string
       .query('search=Manny&range=1..5&order=desc')
       .end(function(res){

       });
```

- Parsing response bodies, Super Agent will parse known response-body data for you, currently supporting application/x-www-form-urlencoded, application/json, and multipart/form-data.

`res.text, res.body, res.header, res.type, res.charset`

- Response status, The response status flags help determine if the request was a success, among other useful information, making SuperAgent ideal for interacting with RESTful web services. These flags are currently defined as

```js
    var type = status / 100 | 0;

    // status / class
    res.status = status;
    res.statusType = type;

    // basics
    res.info = 1 == type;
    res.ok = 2 == type;
    res.clientError = 4 == type;
    res.serverError = 5 == type;
    res.error = 4 == type || 5 == type;

    // sugar
    res.accepted = 202 == status;
    res.noContent = 204 == status || 1223 == status;
    res.badRequest = 400 == status;
    res.unauthorized = 401 == status;
    res.notAcceptable = 406 == status;
    res.notFound = 404 == status;
    res.forbidden = 403 == status;
```

- Aborting requests, To abort requests simply invoke the `req.abort()` method.

- Request timeouts, req.timeout(ms), after which an error will be triggered. To differentiate between other errors the err.timeout property is set to the ms value. NOTE that this is a timeout applied to the request and all subsequent redirects, not per request.

### POST / PUT requests

A typical JSON POST request might look a little like the following, where we set the `Content-Type` header field appropriately, and "write" some data, in this case just a JSON string. Default: JSON

```js
    request.post('/user')
      .set('Content-Type', 'application/json') // <= optional, default to JSON
      .send({name: "tj",pet: "tobi"})
      .send({ ... }) // <= using multiple send
      .end(callback)
```

By default sending strings will set Content-Type to application/x-www-form-urlencoded, multiple calls will be concatenated with &

```js
    // name=tj&pet=tobi
    request.post('/user')
      .send('name=tj')
      .send('pet=tobi')
      .end(callback);
```

SuperAgent formats are extensible, however by default "json" and "form" are supported. To send the data as application/x-www-form-urlencoded simply invoke .type() with "form", where the default is "json". This request will POST the body "name=tj&pet=tobi".
Note: "form" is aliased as "form-data" and "urlencoded" for backwards compat.

```js
    request.post('/user')
      .type('form')
      .send({ name: 'tj' })
      .send({ pet: 'tobi' })
      .end(callback)
```

### Others

- Setting the Content-Type

```js
     request.post('/user')
        .set('Content-Type', 'application/json')

     // shorthand syntax
     request.post('/user')
        .type('json')  // <= canonicalized MIME type `type/subtype`, or simply the extension name such as "xml", "json", "png"
```

- Setting Accept  via .accept().  Same usage like above `Setting the Content-Type`

```js
    request.get('/user')
      .accept('json')
```

- Following redirects. By default up to 5 redirects will be followed, however you may specify this with the res.redirects(n) method:

```js
    request
      .get('/some.png')
      .redirects(2)
      .end(callback);
```

- Piping data, The Node client allows you to pipe data to and from the request.

```js
    var request = require('superagent')
      , fs = require('fs');

    var stream = fs.createReadStream('path/to/my.json');
    // option 1: piping a file's contents as the request.
    var req = request.post('/somewhere');
    req.type('json');
    stream.pipe(req);
    // option 2: piping the response to a file
    var req = request.get('/some.json');
    req.pipe(stream);
```

- Multipart requests.

The low-level API uses Parts to represent a file or field. The .part() method returns a new Part, which provides an API similar to the request itself.

```js
     var req = request.post('/upload');

     req.part()
       .set('Content-Type', 'image/png')
       .set('Content-Disposition', 'attachment; filename="myimage.png"')
       .write('some image data')
       .write('some more image data');

     req.part()
       .set('Content-Disposition', 'form-data; name="name"')
       .set('Content-Type', 'text/plain')
       .write('tobi');

     req.end(callback);
```

As mentioned a higher-level API is also provided, in the form of .attach(name, [path], [filename]) and .field(name, value). Attaching several files is simple, you can also provide a custom filename for the attachment, otherwise the basename of the attached file is used.

```js
    // Attaching files
    request
      .post('/upload')
      //two lines below are totally optional: Field values
      .field('user[name]', 'Tobi')
      .field('user[email]', 'tobi@learnboost.com')

      .attach('avatar', 'path/to/tobi.png', 'user.png')
      .attach('image', 'path/to/loki.png')
      .attach('file', 'path/to/jane.png')
      .end(callback);
```

Note: Field Value, Much like form fields in HTML, you can set field values with the .field(name, value) method. Suppose you want to upload a few images with your name and email

- CORS

The .withCredentials() method enables the ability to send cookies from the origin, however only when "Access-Control-Allow-Origin" is not a wildcard ("*"), and "Access-Control-Allow-Credentials" is "true".

```js
    request
      .get('http://localhost:4001/')
      .withCredentials()
      .end(function(res){
        assert(200 == res.status);
        assert('tobi' == res.text);
        next();
      })
```

- Error handling

When an error occurs super agent will first check the arity of the callback function given, if two parameters are present the error is passed, as shown below:

```js
    request
     .post('/upload')
     .attach('image', 'path/to/tobi.png')
     .end(function(err, res){

     });
```

When a callback is omitted, or only a res parameter is present, an "error" event is emitted:

```js
      request
        .post('/upload')
        .attach('image', 'path/to/tobi.png')
        .on('error', handler)
        .end(function(res){

        });
```

Note: **4xx or 5xx** response with super agent is not considered an error by default. For example if you get a 500 or 403 response, this status information will be available via res.error, res.status and the others mentioned in "Response properties", however no Error object is passed for these responses. An error includes network failures, parsing errors, etcetera.

When an HTTP error occurs (4xx or 5xx response) the res.error property is an Error object, this allows you to perform checks such as:

```js
    if (res.error) {
      alert('oh no ' + res.error.message);
    } else {
      alert('got ' + res.status + ' response');
    }
```
