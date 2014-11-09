# [Passport.js](http://passportjs.org/)

> Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.

    npm install passport

 It is designed to serve a singular purpose: authenticate requests. which it does through an extensible set of plugins known as strategies. Passport does not mount routes or assume any particular database schema, which maximizes flexiblity and allows application-level decisions to be made by the developer. The API is simple: you provide Passport a request to authenticate, and Passport provides hooks for controlling what occurs when authentication succeeds or fails.

Authentication mechanisms, known as strategies, are packaged as individual modules. Applications can choose which strategies to employ, without creating unnecessary dependencies.

## Authenticate `passport.authenticate()`

Pass param which strategy to employ. authenticate()'s function signature is standard Connect middleware, which makes it convenient to use as route middleware in Express applications.

    app.post('/login', passport.authenticate('local', function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

Note: Setting the failureFlash option (optional) to true instructs Passport to flash an error message using the message given by the strategy's verify callback, if any. This is often the best approach, because the verify callback can make the most accurate determination of why authentication failed. ( Need to `npm install  connect-flash` middleware)

    passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
    passport.authenticate('local', { successFlash: 'Welcome!' });

By default, if authentication fails, Passport will respond with a `401 Unauthorized status`, and any additional route handlers will not be invoked. If authentication succeeds, the `next` handler will be invoked and the `req.user` property will be set to the authenticated user.

Note: Strategies must be configured prior to using them in a route.

- Disable Seesions

After successful authentication, Passport will establish a persistent login session.

    app.get('/api/users/me', passport.authenticate('basic', { session: false }), function(req, res) {
      res.json({ id: req.user.id, username: req.user.username });
    });

Note:  For example, API servers typically require credentials to be supplied with each request. When this is the case, session support can be safely disabled by setting the session option to false.

- Custom Callback

authenticate() is called from within the route handler, rather than being used as route middleware. This gives the callback access to the req and res objects through closure.

    app.get('/login', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) { //info param is optional
        if (err) { return next(err); }  // if err, set `user` to false
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/users/' + user.username);
        });
      })(req, res, next);
    });

Note: when using a custom callback, it becomes the application's responsibility to establish a session (by calling req.login()) and send a response.

## Configure

3 things need to be configurated to use Passport for authentication

1. Authentication strategies

It uses strategies to authenticate requests. Strategies range from verifying a username and password, delegated authentication using OAuth or federated authentication using OpenID.

Strategies, and their configuration, are supplied via the use() function.

For example, the following uses the LocalStrategy for username/password authentication.

[passport-local](https://github.com/jaredhanson/passport-local) module - Username & Password. `npm install passport-local`

    var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
    ));

By default, LocalStrategy expects to find credentials in parameters named username and password (inside form tag, input name fields). If your site prefers to name these fields differently, options are available to change the defaults.

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
      },
      function(username, password, done) {
        // ...
      }
    ));

Strategies require what is known as a verify callback. The purpose of a verify callback is to find the user that possesses a set of credentials.

When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments, in this case username and password. If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.

Note: that it is important to distinguish the two failure cases that can occur. The latter is a server exception, in which err is set to a non-null value. Authentication failures are natural conditions, in which the server is operating normally. Ensure that err remains null, and use the final argument to pass additional details.

By delegating in this manner, the verify callback keeps Passport database agnostic. Applications are free to choose how user information is stored, without any assumptions imposed by the authentication layer.

2. Application middleware

In a Connect or Express-based application, passport.initialize() middleware is required to initialize Passport. If your application uses persistent login sessions, passport.session() middleware must also be used.

    app.configure(function() {
      app.use(express.static('public'));
      app.use(express.cookieParser());
      app.use(express.bodyParser());
      app.use(express.session({ secret: 'keyboard cat' }));
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(app.router);
    });

Note that enabling session support is entirely optional, though it is recommended for most applications. If enabled, be sure to use express.session() before passport.session() to ensure that the login session is restored in the correct order.

3. Sessions (optional)

In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

In this example, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.

Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made. Passport does not impose any restrictions on how your user records are stored. Instead, you provide functions to Passport which implements the necessary serialization and deserialization logic.

The serialization and deserialization logic is supplied by the application, allowing the application to choose an appropriate database and/or object mapper, without imposition by the authentication layer.

## Operations

1. Log In

Passport exposes a login() function on `req` (also aliased as logIn()) that can be used to establish a login session.

    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + req.user.username);
    });

When the login operation completes, user will be assigned to req.user.

Note: passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.

2. Log Out

Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });

3. Authorize ( mainly for oAuth)

Authorization is performed by calling passport.authorize(). If authorization is granted, the result provided by the strategy's verify callback will be assigned to req.account. The existing login session and req.user will be unaffected.


## Other Libraries

1. [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose)

Fortunately, the passport-local-mongoose package automatically takes care of salting and hashing the password. Finally, instead of a password key we have both a salt and a hash key. Username is as we expected. Json example:

    {
      "_id" : ObjectId("54265aaf074764646f1aaf91"),
      "salt" : "b1c0209dc5886d12fc91159d8ccd750cb64f287f4ad74071147458b705e2e82e",
      "hash" : "cc7d3140c1fff8363cfc8c24620b21bcb544e901cf862fc45c553e8d38d1c1332c2bd01736131de118d303d1bc8fe5607c01e6cb39f40d025f0984f043b9c8438ed824a2a9a0c15a75e8bd5634f86202d96bb928e96fa3116a28ab1559a95872020491525c5e0efc2a7d34c4c234fde35b03e41cd5788a43c81345a96c3032d54f17630d1f48366a15d9e1c7a81c50e2c6dd08d741ac1066c4c817d9599a76631d37db7e03d7f74213a221b907f40caf2fdcc3551d64bcf441f0af45a7c7565092e56fa398d8c10a39080126d17d7836161f32bd06f706ef1664a1e53badbccd76a76b488fecd52b85fabed643793c516bbac673f502f60343e6cb13e9b3837139abda5631952b53d98e84275f9dbe6cd4a22132f538c48e733f11c1c3f17337b1498a5a85e75cedd12498ecbddfc8455b502b8e123f30ca40132571960da1d5861185db76e43bb7780bae0e0d9892ad9f6a7673062d62f93f369f519ab9947e122f1729923b43a8c522e58054fffccdd34ab63202cdc49bab249c6c0696fce53f8cdb0f11466c6dfc073a63130d8cb84ce2818d591ace45a048137801c913d2e34dfa9bd3f3093b5547dfa89bb0248305455f27334c7adf1215892eb6a0eea4653b549bcfd7c07d49f771d216448517d246280e5e7a4224a704ba1c71f79957798bf9c462710d19f8bfcfa27527f61e4f46d1d8368df0e5ae899eff06388da5",
      "username" : "matt",
      "time" : ISODate("2014-09-27T06:35:27.744Z"),
      "__v" : 0
    }
