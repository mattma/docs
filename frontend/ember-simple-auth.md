# [Ember Simple Auth](https://github.com/simplabs/ember-simple-auth)

[API Docs](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html)

it is a lightweight library for implementing authentication/authorization with Ember.js applications.

### What does it do?

* it manages a client side session and synchronizes that across tabs/ windows
* it authenticates users against the application's own server, external providers like Facebook etc.
* it authorizes requests to the backend server
* it is easily customizable and extensible

### Concept

Ember Simple Auth is built around the fundamental idea that users are always using the application in the context of a (client side) session. This session can either be authenticated or not. Ember Simple Auth creates that session, provides functionality to authenticate and invalidate it and also has a set of mixins that provide default implementations for common scenarios like redirecting users to the login if they access a restricted page etc.

The general route to go with authentication in ember.js is to use **token based authentication** where the client submits the regular username/password credentials to the server once and if those are valid receives an authentication token in response. That token is then sent along with every request the client makes to the server.

we have a /session route in our Rails app that the client POSTs its credentials to and if those are valid gets back an authentication token together with an id that identifies the user’s account on the server side.

This data is stored in a "session" object on the client side (while technically there is no session in this stateless authentication mechanism, I still call it session in absence of an idea for a better name). The authentication token is then sent in a header with every request the client makes.

The "session" object on the client side is a plain Ember.Object that simply keeps the data that is received from the server on session creation. It also stores the authentication token and the user’s account ID in cookies so the user doesn’t have to login again after a page reload. it’s a security issue to store the authentication token in a cookie without the user’s permission - I think using a session cookie like I do should be ok as it’s deleted when the browser window is closed. Of course you could also use sth. like localStorage like Marc points out below). I’m creating this object in an initializer so I can be sure it exists (of course it might be empty) when the application starts.

`Ember.Application.initializer({ })` will register `App.Session`. I can always access the current "session" information as App.Session. When we need to check whether a user is authenticated we can simply check for presence of the authToken property. Of course we could add a isAuthenticated() method that could perform additional checks but we didn’t have the need for that yet.

Logging in
the login API is a simple /session route on the server side that accepts the user’s login and password and responds with either HTTP status 401 when the credentials are invalid or a session JSON when the authentication was successful.

Logging out
The client just sends a DELETE to the same /session route that makes the server reset the authentication token in the database so that the token on the client side is invalidated. The client also deletes the saved session information in App.Session so there’s no stale data.

### Usage

After you include *Ember Simple Auth*, it registers an initializer named 'simple-auth'. Once that initializer has run, the session will be available in all routes and controllers of the application.

Implement the respective mixin in the application route:

      // app/routes/application.js
      import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

      export default Ember.Route.extend(ApplicationRouteMixin);

Note: This adds some actions to the application route like `authenticateSession` and `invalidateSession` as well as callback actions that are triggered when the session's authentication state changes like `sessionAuthenticationSucceeded` or `sessionInvalidationSucceeded`. Displaying e.g. login/logout buttons in the UI depending on the session's authentication state then is as easy as: (below)

Render login/logout buttons in the template:

      {{#if session.isAuthenticated}}
        <a {{ action 'invalidateSession' }}>Logout</a>
      {{else}}
        <a {{ action 'authenticateSession' }}>Login</a>
      {{/if}}

Login controller after defined `this.route('login')` in the `router.js`

      // app/controllers/login.js
      import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

      export default Ember.Controller.extend(LoginControllerMixin, {
        authenticator: 'authenticator:custom'
      });

Render the login form:

      <form {{action 'authenticate' on='submit'}}>
        <label for="identification">Login</label>
        {{input id='identification' placeholder='Enter Login' value=identification}}
        <label for="password">Password</label>
        {{input id='password' placeholder='Enter Password' type='password' value=password}}
        <button type="submit">Login</button>
      </form>

To make a route in the application require the session to be authenticated, make routes protected by simply implementing the mixin:

      // app/routes/protected.js
      import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

      export default Ember.Route.extend(AuthenticatedRouteMixin);

Note: This will make the route transition to `/login` (or a different URL if configured) when the session is not authenticated in the beforeModel method.

Authenticators

Authenticators implement the concrete steps necessary to authenticate the session. An application can have several authenticators for different kinds of authentication mechanism. while the session is only authenticated with one authenticator at a time, (see the API docs for Session#authenticate). The authenticator to use is chosen when authentication is triggered:

      this.get('session').authenticate('authenticator:custom', {});

See [here](https://github.com/simplabs/ember-simple-auth#authenticators) for more details. Ember Simple Auth does not include any authenticators in the base library but has extension libraries that can be loaded as needed: simple-auth-oauth2 etc.

Custom authenticators have to be registered with Ember's dependency injection container so that the session can retrieve an instance

      import Base from 'simple-auth/authenticators/base';

      var CustomAuthenticator = Base.extend({
        …
      });

      Ember.Application.initializer({
        name: 'authentication',
        before: 'simple-auth',
        initialize: function(container, application) {
          container.register('authenticator:custom', CustomAuthenticator);
        }
      });

To authenticate the session with a custom authenticator, simply pass the registered factory's name to the session's authenticate method

      this.get('session').authenticate('authenticator:custom', {});

or when using one of the controller mixins:

      // app/controllers/login.js
      import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

      export default Ember.Controller.extend(LoginControllerMixin, {
        authenticator: 'authenticator:custom'
      });

### Stores

Ember Simple Auth persists the session state so it survives page reloads. There is only one store per application that can be configured in the global configuration object:

      window.ENV = window.ENV || {};
      window.ENV['simple-auth'] = {
        store: 'simple-auth-session-store:local-storage'
      }

Store Types: bundled stores: 1. `localStorage` Store by default, it stores its data in the browser's localStorage  2. Ephemeral Store, stores its data in memory and thus is not actually persistent. useful for testing.

### Cross Origin Authorization

Ember Simple Auth will never authorize cross origin requests so that no secret information gets exposed to third parties. To enable authorization for additional origins (for example if the REST API of the application runs on a different domain than the one the Ember.js application is served from), additional origins can be whitelisted in the configuration.

- Old post, Old implementation

The response JSON from the server would look somehow like this in the successful login case:

      {
        session: {
          auth_token: '<SOME RANDOM AUTH TOKEN>',
          account_id: '<ID OF AUTHENTICATED USER>'
        }
      }

At this point the client has the authentication data necessary to authenticate itself against the server. As authentication data would be lost every time the application on the client reloads and we don’t want to force a new login every time the user reloads the page we can simply store that data in a cookie (of course you could use local storage etc.):

    $.cookie('auth_token', App.Auth.get('authToken'));
    $.cookie('auth_account', App.Auth.get('accountId'));

Making authenticated requests: send the authentication token to the server. when the store adapter reads or writes data, the token has to be integrated in that adapter somehow. As there’s not (yet) any out-off-the-box support for authentication in the DS.RESTAdapter, I simply added it myself:

    App.AuthenticatedRESTAdapter = DS.RESTAdapter.extend({
      ajax: function(url, type, hash) {
        hash         = hash || {};
        hash.headers = hash.headers || {};
        hash.headers['X-AUTHENTICATION-TOKEN'] = this.authToken;
        return this._super(url, type, hash);
      }
    });
