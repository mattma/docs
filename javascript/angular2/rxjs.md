# RxJS

**Rx allows you to specify the dynamic behavior of a value completely at the time of declaration.** If you want to see how your data looks like, you only need to look at the declaration, it shows the data behaves over time. The truth is, there is no other code can modify the data except declaration code. This is nice garentee.

Great for separation of concern, declartion does not need to know how it got its value, subscriber does not need to know where its value come from neither.

Programming with event streams. It is a sequence of ongoing events ordered in time, like async array,

```js
var source = Rx.Observable.interval(400).take(9)
  .map(i => ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'][i]);

var result = source
  .map(x => parseInt(x))
  .filter(x => !isNaN(x));
  // .reduce((x, y) => x + y) // will calculate the total over time
result.subscribe(x => console.log(x));
```

## Rx VS Promise

If Observable is errored, we could simply subscribe to it again, use `retry` operator without running the code again. Promise is errored, if you want to access what function returned, Promise is already executed with its own logic, a readonly view to a future, it cannot be repeated or retried.

Observable can be setup, canceled. Promise cannot be canceled.

## Creation

#### create

```js
let source$ = Rx.Observable.create(function(observer) {
  fetch('http://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(j => {
      observer.onNext(j);
      observer.onCompleted();
    }).catch(observer.onError);
});
let subscription = source$.subscribe(
  (x) => console.log('onNext: %s', x),
  (e) => console.log('onError: %s', e),
  () => console.log('onCompleted')
);
```

#### Event Stream

`Rx.Observable.fromEvent(SELECTOR, 'click')`

```js
var clickStream = Rx.Observable.fromEvent(document.querySelector('a'), 'click')
var doubleClickStream = clickStream
  .buffer(() => clickStream.throttle(250))
  .map(arr => arr.length)
  .filter(len => len === 2);
doubleClickStream.subscribe(e => console.log(e))
```

#### of

```js
var streamA = Rx.Observable.of(3, 4); // declare at the time of creation
var streamB = streamA.map(a => 10 * a);
streamB.subscribe(b => console.log(b));  // Log: 30, 40
```

## Operator

#### Merge

// -----a-----b----c----->
// s--------------------->
//        merge
// s----a-----b----c----->


#### startWith

// --------u------------->
//     startWith(n)
// n-------u------------->
