# [Sinon](http://sinonjs.org/docs)

Sinon.js is a really helpful library when you want to unit test your code. It supports spies, stubs, and mocks.

1. Spy

A test spy is a function that records arguments, return value, the value of this and exception thrown (if any) for all its calls. A test spy can be an anonymous function or it can wrap an existing function. It records how it is used. It will record how many times it was called, what parameters were used, when it was called, and a bunch of other things.

It behave like a function, all calls are recorded, verify using assertion. useful to test both callbacks and how certain functions/methods are used throughout the system under test.

### Create Spy:

```js
// Case 1
// Creates an anonymous function that records arguments, this value, exceptions and return values for all calls.
    sinon.spy()

// Case 2
// Spies on the provided function
    sinon.spy(myFunc);

// Case 3
// take an existing function and turn it into a spy
// replaces the original method with the spy.
// The spy acts exactly like the original method in all cases
// The original method can be restored by calling object.method.restore()
    sinon.spy(obj, 'method')  // === obj.method

// example
    sinon.spy($, "ajax");

    $.ajax({ / ... / }); // Call spy version of jQuery.ajax
    var call = $.ajax.getCall(0);

    call.args;
    call.exception;
    call.returnValue;
    //it is important to restore the function back to it’s original state
    $.ajax.restore();
```

```js
// example
    var missionImpossible = {
        start: function (agent) {
            agent.apply(this);
        }
    };
    // By using a sinon.spy(), it allows us to track how the function is used
    var ethanHunt = sinon.spy();
    missionImpossible.start(ethanHunt);

    // Test here
    ethanHunt.called   // true
    ethanHunt.calledOnce  // true
    ethanHunt.callCount  // 1
```

```js
// Access first argument of the first call
// Way 1:  the two-dimensional args array directly on the spy
    spy.args[0][0]
// Way 2: fetches the first call object and then accesses it’s args array
    spy.getCall(0).args[0]
// recommended approach
    spy.calledWith(arg1, arg2, ...)
```

```js
// Creates a spy that only records calls when the received arguments match those passed to withArgs.
    var object = { method: function () {} };
    var spy = sinon.spy(object, "method");
    spy.withArgs(42);
    spy.withArgs(1);

    object.method(42);
    object.method(1);

    assert(spy.withArgs(42).calledOnce);
    assert(spy.withArgs(1).calledOnce);
```

### Spy API

Spy objects are objects returned from `sinon.spy()`. When spying on existing methods with `sinon.spy(object, method)`, the following properties and methods are also available on `object.method`.

```js
// Creates a spy that only records calls when the received arguments match those passed to withArgs.
    spy.withArgs(arg1[, arg2, ...]);

// The number of recorded calls.
    spy.callCount

// true if the spy was called at least once
    spy.called

// true if spy was called exactly once
    spy.calledOnce

    spy.calledTwice

    spy.calledThrice

    spy.firstCall

    spy.secondCall

    spy.thirdCall

    spy.lastCall

// Returns true if the spy was called before anotherSpy
    spy.calledBefore(anotherSpy);

// Returns true if the spy was called after anotherSpy
    spy.calledAfter(anotherSpy);

// Returns true if the spy was called at least once with obj as this.
    spy.calledOn(obj);

// Returns true if the spy was always called with obj as this.
    spy.alwaysCalledOn(obj);

// Returns true if spy was called at least once with the provided arguments. Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return true.
    spy.calledWith(arg1, arg2, ...);

spy.alwaysCalledWith(arg1, arg2, ...);
Returns true if spy was always called with the provided arguments (and possibly others).

spy.calledWithExactly(arg1, arg2, ...);
Returns true if spy was called at least once with the provided arguments and no others.

spy.alwaysCalledWithExactly(arg1, arg2, ...);
Returns true if spy was always called with the exact provided arguments.

spy.calledWithMatch(arg1, arg2, ...);
Returns true if spy was called with matching arguments (and possibly others). This behaves the same as spy.calledWith(sinon.match(arg1), sinon.match(arg2), ...).

spy.alwaysCalledWithMatch(arg1, arg2, ...);
Returns true if spy was always called with matching arguments (and possibly others). This behaves the same as spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...).

spy.calledWithNew();
Returns true if spy/stub was called the new operator. Beware that this is inferred based on the value of the this object and the spy function’s prototype, so it may give false positives if you actively return the right kind of object.

spy.neverCalledWith(arg1, arg2, ...);
Returns true if the spy/stub was never called with the provided arguments.

spy.neverCalledWithMatch(arg1, arg2, ...);
Returns true if the spy/stub was never called with matching arguments. This behaves the same as spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...).

spy.threw();
Returns true if spy threw an exception at least once.

spy.threw("TypeError");
Returns true if spy threw an exception of the provided type at least once.

spy.threw(obj);
Returns true if spy threw the provided exception object at least once.

spy.alwaysThrew();
Returns true if spy always threw an exception.

spy.alwaysThrew("TypeError");
Returns true if spy always threw an exception of the provided type.

spy.alwaysThrew(obj);
Returns true if spy always threw the provided exception object.

spy.returned(obj);
Returns true if spy returned the provided value at least once. Uses deep comparison for objects and arrays. Use spy.returned(sinon.match.same(obj)) for strict comparison (see matchers).

spy.alwaysReturned(obj);
Returns true if spy always returned the provided value.
```


2. Stubs

Test stubs (also a spy, but do not proxy original methods) are functions (spies) with pre-programmed behavior. They support the full test spy API in addition to methods which can be used to alter the stub's behavior. it is also a function that has some predefined behavior. A stub is used when we want to fake some functionality so that our system thinks everything is performing normallyo

```js
// Modifiers
    stub.yields([ args... ]);

    stub.returns(value);

    stub.throws('ErrorType');
```

```js
    var stub = sinon.stub(),
        opts = { call: function (msg) { console.log(msg); } };

    // We can control how the sinon.stub() will behave based on how it’s called!
    stub.withArgs("Hello").returns("World");
    stub.withArgs("Wuz").returns("Zup?");
    stub.withArgs("Kapow").throws();
    // if an object is passed to the stub, it should yieldTo (or invoke) the call fn that was passing using the "Howdy" argument.
    stub.withArgs(opts).yieldsTo("call", ["Howdy"]);

    stub("Hello"); // "World"
    stub(options); // "Howdy"
```

```js
// example
    var missionImpossible = {
        numberOfAssignments: 0,
        assignment: function (answer, tape) {
            var mission = tape(answer);
            this.numberOfAssignments++;
            return mission;
        }
    };
    function Mission() { }
    var tape = sinon.stub();
    tape.withArgs("accept").returns(new Mission());
    tape.withArgs("reject").throws("Disintegrate");

// testing below
    // pass "accept" that we are getting a Mission object back
    missionImpossible.assignment("accept", tape); // Mission {}
    missionImpossible.numberOfAssignments  // 1
    // "reject" the assignment that a Disintegrate exception is thrown.
    missionImpossible.assignment("reject", tape);  // Disintegrate
```

```js
    describe("getTweets", function () {
        var fakeData = [
            {
                created_at: "Fri Apr 05 19:39:30 +0000 2013",
                text: "tweet 1",
                retweeted: false,
                favorited: false,
                user: { name: "name 1" }
            },
        /* ... */
         ];

        before(function () {
            // yieldTo (or invoke) the success function from the object(fakeData) that is passed
            // stubbed out the jQuery ajax method and provide fake test data that we can use in our unit test.
            sinon.stub($, "ajax").yieldsTo("success", fakeData);
        });

        it("should $.ajax &amp; invoke callback", function (done) {
            twitter.getTweets("elijahmanor", function (tweets) {
                expect(tweets.length).to.be(5);
                done();
            });
        });
        // removes all of the stub behavior from the function
        after(function () { $.ajax.restore(); });
});
```

3. Mocks

Mocks (and mock expectations) are fake methods (like spies) with pre-programmed behavior (like stubs) as well as pre-programmed expectations. A mock will fail your test if it is not used as expected. With a mock you define up front all of the things you want to expect ( or happen ) then when you are all done with your tests you assert that all those things happened as planned.

Main difference: State expectations up-front, no need for assertions. Mocks are spies and stubs with built-in expectation. Mocke an object, set expectations on methods, apply modifiers on expectations.

```js
// defining a mock based off our opts object and we are saying that we expect the call method
// should only be called once and when it is called that it should have the "Hello World" string
// argument passed to it.

    var opts = { call: function (msg) { console.log(msg); } },
        mock = sinon.mock(opts);

    // You state your success criteria upfront
    mock.expects("call").once().withExactArgs("Hello World");
    /* ... twice, atMost, never, exactly, on, etc ... */

    opts.call("Hello World");

    // tell the mock object to mock.verify() that all of the expectations you've made previously are valid.
    // If for some reason an expectation was not met, then an exception will occur.
    // call the restore method off of what was mocked.
    mock.verify();
    mock.restore();
```

```js
    describe("getTweets", function () {
        var mock, fakeData = [];

        before(function () {
            // ajax would invoke the success method of the object I pass in with some fakeData I've provided.
            mock = sinon.mock(jQuery).expects("ajax").once()
                       .yieldsTo("success", fakeData);
        });

        it("should call jQuery.ajax", function (done) {
            twitter.getTweets("elijahmanor", function (tweets) {
                //  on the callback I call the verify method off of the mock
                //  to make sure my expectations have been met.
                mock.verify();
                done();
            });
        });

        after(function () { jQuery.ajax.restore(); });
    });
```

4. Fake Timer

Fake timers is a synchronous implementation of setTimeout and Sinon.JS can overwrite the global functions with to allow you to more easily test code using them.

```js
// Normally if we wanted to test if this element showed up on the screen we'd either need to provide a callback when the animation is finished or tap into the promise created from the deferred and wait for that to resolve.
    var clock = sinon.useFakeTimers();

    var hidden =
        $("<div hidden="">Peekaboo</div>")
            .appendTo(document.body).fadeIn("slow");

    // tell the clock that we are now 650 milliseconds in the future
    clock.tick(650); // slow = 600ms
    // we can immediately assert that the element is visible without waiting.
    hidden.css("opacity") === 1; // true

    clock.restore();
```

5. Fake Server

High-level API to manipulate FakeXMLHttpRequest instances. This is a high level abstraction over the FakeXMLHttpRequest that Sinon.js also provides if you need more granular support.

```js
    var server = sinon.fakeServer.create();

    server.respondWith("GET", "/twitter/api/user.json", [
        200,
        {"Content-Type": "application/json"},
        '[{"id": 0, "tweet": "Hello World"}]'
    ]);

    // A key to remember is that you do need to tell the server to respond
    // as we did immediately after we called the get method.
    $.get("/twitter/api/user.json", function (data) {
        console.log(data); // [{"id":0,"tweet":"Hello World"}]
    });
    server.respond();

    server.restore();
```
