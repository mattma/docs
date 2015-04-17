# Reactive Programming

Resources

1. https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
2.  [Observable API](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)
3. required to understand the concept of [Cold vs Hot Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md#cold-vs-hot-observables)
4. understand those functions in diagrams of streams, [RxJava's very useful documentation with marble diagrams](https://github.com/ReactiveX/RxJava/wiki/Creating-Observables)

1. thinking in Reactive, a different paradigm

Reactive programming is programming with asynchronous data streams.

Event buses or your typical click events are really an asynchronous event stream, on which you can observe and do some side effects. You are able to create data streams of anything, not just from click and hover events. Streams are cheap and ubiquitous, anything can be a stream: variables, user inputs, properties, caches, data structures, etc. For example, imagine your Twitter feed would be a data stream in the same fashion that click events are. You can listen to that stream and react accordingly.

On top of that, you are given an amazing toolbox of functions to combine, create and filter any of those streams. That's where the "functional" magic kicks in. A stream can be used as an input to another one. Even multiple streams can be used as inputs to another stream. You can merge two streams. You can filter a stream to get another one that has only those events you are interested in. You can map data values from one stream to another new one.

A stream is a sequence of ongoing events ordered in time. It can emit three different things: a value (of some type), an error, or a "completed" signal. We capture these emitted events only asynchronously, by defining a function that will execute when a value is emitted, another function when an error is emitted, and another function when 'completed' is emitted. Sometimes these last two can be omitted and you can just focus on defining the function for values.

The "listening" to the stream is called subscribing. The functions we are defining are observers. The stream is the subject (or "observable") being observed. This is precisely the Observer Design Pattern.

```bash
# a, b, c, d are emitted values
# X is an error
# | is the 'completed' signal
# ---> is the timeline
--a---b-c---d---X---|->
```

In common Reactive libraries, each stream has many functions attached to it, such as map, filter, scan, etc. `clickStream.map(f)`, it returns a new stream based on the click stream (not modified), a property called immutability. It allows us to chain functions like `clickStream.map(f).scan(g)`


Observable is Promise++. In Rx you can easily convert a Promise to an Observable by doing `var stream = Rx.Observable.fromPromise(promise)`. The only difference is that Observables are not Promises/A+ compliant, but conceptually there is no clash. A Promise is simply an Observable with one single emitted value. Rx streams go beyond promises by allowing many returned values.


"metastream": a stream of streams. A metastream is a stream where each emitted value is yet another stream. You can think of it as pointers: each emitted value is a pointer to another stream. In below example, each request URL is mapped to a pointer to the promise stream containing the corresponding response.


- Build a Stream for github users with RX (Request and response)

everything can be a stream. To create such stream with a single value is very simple in Rx*.

```js
var requestStream = Rx.Observable.just('https://api.github.com/users');
```

```js
// flatMap: a version of map() than "flattens" a metastream, by emitting on the "trunk" stream everything that will be emitted on "branch" streams.
var responseStream = requestStream
  .flatMap(function(requestUrl) {
	return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });
```

And because the response stream is defined according to request stream, if we have later on more events happening on request stream, we will have the corresponding response events happening on response stream.

Now that we finally have a response stream, we can render the data we receive:

```js
responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});
```

RxJS comes with tools to make Observables from event listeners. Try to do Everytime the refresh button is clicked, the request stream should emit a new URL, so that we can get a new response.

```js
var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
```

Since the refresh click event doesn't itself carry any API URL, we need to map each click to an actual URL. Now we change the request stream to be the refresh click stream mapped to the API endpoint with a random offset parameter each time.

```js
var requestOnRefreshStream = refreshClickStream
  .map(function() {
	var randomOffset = Math.floor(Math.random()*500);
	return 'https://api.github.com/users?since=' + randomOffset;
  });

var startupRequestStream = Rx.Observable.just('https://api.github.com/users');
```

But how can we "merge" these two into one? Well, there's merge(). Explained in the diagram dialect, this is what it does

```bash
stream A: ---a--------e-----o----->
stream B: -----B---C-----D-------->
		  vvvvvvvvv merge vvvvvvvvv
		  ---a-B---C--e--D--o----->
```

```js
var requestStream = Rx.Observable.merge(
  requestOnRefreshStream, startupRequestStream
);

// or

var requestStream = refreshClickStream
  .map(function() {
	var randomOffset = Math.floor(Math.random()*500);
	return 'https://api.github.com/users?since=' + randomOffset;
  })
  // way 1: just simply chaining it
  .merge(Rx.Observable.just('https://api.github.com/users'));
  // way 2: shorter, more readable
  // No matter how your input stream looks like, the output stream resulting of startWith(x) will have x at the beginning.
  // .startWith('https://api.github.com/users')
```

So let's model a suggestion as a stream, where each emitted value is the JSON object containing the suggestion data.

```js
var suggestion1Stream = responseStream
  .map(function(listUsers) {
	// get one random user from the list
	return listUsers[Math.floor(Math.random()*listUsers.length)];
  })
  // Back to the "on refresh, clear the suggestions", we can simply map refresh clicks to null suggestion data
  .merge( refreshClickStream.map(function(){ return null; })  )
  // Optionally, render "empty" suggestions on startup. That is done by adding startWith(null) to the suggestion streams
  // .startWith(null);

// And when rendering, we interpret null as "no data", hence hiding its UI element.
suggestion1Stream.subscribe(function(suggestion) {
	if (suggestion === null) {
	  // hide the first suggestion DOM element
	}
	else {
	  // show the first suggestion DOM element and render the data
	}
});
```

```bash
# Where N stands for null.
refreshClickStream: ----------o--------o---->
	 requestStream: -r--------r--------r---->
	responseStream: ----R---------R------R-->
 suggestion1Stream: ----s-----N---s----N-s-->
 suggestion2Stream: ----q-----N---q----N-q-->
 suggestion3Stream: ----t-----N---t----N-t-->
```

Final example here: http://jsfiddle.net/staltz/8jFJH/48/

The functional style made the code look more declarative than imperative: we are not giving a sequence of instructions to execute, we are just telling what something is by defining relationships between streams.

Reactive Programming is different than Functional Reactive Programming

Functional Reactive Programming is a variant of Reactive Programming that follows Functional Programming principles such as referential transparency, and seeks to be purely functional.

## Rx.JS. New data type: Observable

Observable is really an Event. it tells when it is done. It comes from Reactive Extensions, Observable Type + Array functions and more. Observable can compose Events, Data requests, animations. Do not think of Events, think of collection. Data in, Data out. Simply transform the data.

It unify the observable and iterable together as one type. It composes together in one fashion. It is just Event to reactive. It transforms the data that we could pull and push. It is stateless architecture. They subscribes lots of different Observable, then aggregates into one big Observable, then transfroms into a new data stream, using `forEach` or whatever method to manipulate those data for the UI to consume. At the end, all streams come in, just one stream is out. No states on those Observable.

```js
var films = (user) =>
	user.generateLists.map( (generateList) =>
		generateList.videos.filter( video => video.rating === 5.0 )
	).concatAll();

films(user).forEach( film => console.log(film) );
```

Observable subscribe via `forEach`. Do not subscribe from Events, complete them when another event fires.

```js
// subscribe:  error(), completed() are optional
var subscription = MouseMoves.forEach(getValue(), errror(), completed());
// unsubscribe
subscribe.dispose();
```
