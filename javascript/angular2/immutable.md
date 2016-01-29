# Immutability

The text-book definition of mutability is liable or subject to change or alteration. In programming, we use the word to mean objects whose state is allowed to change over time. An immutable value is after it has been created, it can never change. In JS, String, Number are immutable.

## Immutable.js

```js
// Pure JS, manipulate the object
game.tiles[tile].isRevealed = true;

// immutable.js update object map
var updatedTile = game.get('tiles').get(tile).set('isRevealed', true);
var updatedTiles = game.get('tiles').set(tile, updatedTile);
game.set('tiles', updatedTiles);

// immutable.js update map shorthand
game.setIn(['tiles', tile, 'isRevealed'], true);

// setIn is null-safe and will pad with empty objects if any part of the key does not exist.
game.getIn(['tiles', tile]) ? game.setIn(['tiles', tile, 'isRevealed'], true) : game
```

#### Methods

Calling `map()` on an immutable list produces a new immutable list, and `toJS()` returns an array representation that React can work with.

#### Performance

Whenever you add something to an immutable object, we need to create a new instance by copying the existing values and add the new value to it. This will certainly be both more memory intensive and more computationally challenging than mutating a single object.

Because immutable objects never change, they can be implemented using a strategy called “structural sharing”, which yields much less memory overhead than you might expect. There will still be an overhead compared to built-in arrays and objects, but it’ll be constant, and can typically be dwarfed by other benefits enabled by immutability. In practice, the use of immutable data will in many cases increase the overall performance of your app, even if certain operations in isolation become more expensive.

#### Usage

You cannot pass an immutable map or list directly to a React component, it won’t get the immutable instance. It also won’t get the data contained in the map because it isn’t exposed as properties of the object – you have access the data with the `get()` method.

## Immutable

#### [Map](https://facebook.github.io/immutable-js/docs/#/Map/Map)

Immutable map is like an js object, a dictionary, unorder hash with key of any type.

```js
it('shoud craete Map() with matching keys', () => {
  let data = {
    "todo1": {
      title: 'hello 1',
    }
  };

  let map = Immutable.Map(data);
  expect(map.get('todo1').title).to.equal("hello 1");
});

it('should create Map() with keys from array tuples', () => {
  let map = Immutable.Map([
    // array tuple defined here, pass array of key and value pair
    ["todo1", {title: "hello 1"}]
  ]);
  expect(map.get('todo1').title).to.equal("hello 1");
  expect(map.size).to.equal(1);
});
```

Persistent changes methods to alter the existing immutable map: `set()`, `delete()`, `clear()`, `update()`, `merge()`

Read immutable map with reading values: `get()`, `has()`, `includes()`, `first()`, `last()`, `find()`

- Iterating over an immutable map

`ImmutableMap.map(fn)` return a new type of immutable map.
`ImmutableMap.filter(fn)` return a new type of immutable map.

`ImmutableMap.forEach(fn)` Mutate each child of the `Map` with `.forEach()`, but this has side effect, it won't return an Immutable map, simply mutate child element.

`ImmutableMap.groupBy(fn)` group items within the immutable, return a new immutable strcuture. like split Immutable items into different groups.

- slice(), skip()

Immutable.js methods break structures or subsets more like array, it has powerful `slice`, in addition, add function methods like `skip`, `take`

```js
// take the last two items in this immutable iterable
let lastTwo = immutableMapObject.slice(immutableMapObject.size-2, immutableMapObject.size);

immutableMapObject.takeLast(2) === lastTwo;
```

`takeLast(number)` return the last "number" of immutable map. revert `skip`

`butLast()` remove the last child from immutable map

`rest()` remove the first child from immutable map, return the rest

`skip(number)` return an immutable map and skip the first "number" child. revert `takeLast`

`skipUntil(fn)` just like `.map(fn)`, until it return to true, it will skip all previous child, and return an immutable map with the rest

`skipWhile(fn)` opposite to `skipUntil(fn)`, until it return to true, it will skip the rest of children, and return an immutable map with up until the truth

- deep equality checking

`Immutable.is(immutableMap1, immutableMap2)` method is on the `Immutable` class. check every key and value to see if they are equal. but if you compare those two immutable maps, they aren't equal because they saved in different places in memory.

`immutableMap1.isSubset(immutableMap2)` check if inside child has any shared key and value.

```js
const map1 = Immutable.Map({a: 1, b: 1});
const map2 = Immutable.Map({a: 1, b: 1, c: Immutable.List.of(1)});

expect(map1.isSubset(map2)).to.be.true;
expect(map2.isSubset(map1)).to.be.false;
```

`immutableMap1.isSuperset(immutableMap2)` opposite to `isSubset`, it will check if immutableMap2 is contains keys/values of immutableMap1


#### [List](https://facebook.github.io/immutable-js/docs/#/List)

Immutable List is like JS array, it contains lots of native array like methods.
`immutableList.push(list)` will return a new Immutable list.

```js
let obj = {a: 1, b: 1};
let list = Immutable.List();
list = list.push(obj);

expect(list.get(0)).to.equal(obj);
```

```js
it('shoud create List() from series of values', () => {
  let arr = ['todo 1', 'todo 2', 'todo 3', 'todo 4'];
  // it works like array, but does not use `[]`
  // you can use with `...arr`, spread operator
  let list = Immutable.List.of('todo 1', 'todo 2', 'todo 3', 'todo 4');

  count = 0;
  _.each(arr, (item) => {
    expect(list.get(count)).to.equal(item);
    count++;
  })
});
```


## Sequences

sequence is like List but it is lazy, it will only calculate when you ask for it.

```js
it('shoud see that Seq() act list an Iterable', () => {
  let range = _.range(1000);
  // it works like List
  let sequence = Immutable.Seq.of(...range);

  expect(sequence.get(0)).to.equal(0);
  expect(sequence.last()).to.equal(999);
});


it('shoud see that Seq() is lazy', () => {
  let range = _.range(1000);
  let numberOfOperations = 0;

  let powerOfTwo = Immutable.Seq.of(...range)
    .map((number)=> {
      numberOfOperations++;
      return number * 2;
    })

  expect(numberOfOperations).to.equal(0);

  powerOfTwo.take(10).toArray()
  expect(numberOfOperations).to.equal(10);
});

it('should not produce an overflow with infinite Range()', () => {
  // like _.range(), but powerOfTwoRange is immutable sequence, not an array.
  let powerOfTwoRange = Immutable.Range(1, Infinity);
  expect(powerOfTwoRange.size).to.equal(Infinity);

  first1000Powers = powerOfTwoRange
    .take(1000)
    .map(n => n * 2);

  expect(first1000Powers.size).to.equal(1000);
});

it('should demostrate chaining with Seq()', () => {
  let addPowersOfTwo = Immutable.Range(0, Infinity)
    .filter(n => n % 2)
    .map(n => n * 2);

  let first1000OddPowers = addPowersOfTwo.take(1000);
  expect(first1000OddPowers.get(999)).to.equal(3998);
});
```


## Build immutable object

#### fromJS

Build immutable object using `.fromJS()` for Array, Object. Object converted to `Map`, Array converted to `List`.

To verify using `Immutable.Map.isMap(immutableMap)`, `Immutable.List.isList(immutableList)`

```js
it('shoud craete deeply nested Map() from a plain JS object', () => {
  let data = {
    title: 'go to grocery',
    text: 'i need milk',
    completed: false,
    category: {title: 'house duties', priority: 10}
  };


  let todo = Immutable.fromJS(data);
  expect(Immutable.Map.isMap(todo)).to.be.true;
  expect(todo.getIn(['category', 'title'])).to.equal('house duties');
});

it('should create deeply nested List() from a plain JS array', () => {
  let arr = ['todo 1', 'todo 2', ['todo 3', 'todo 4']];
  let myList = Immutable.fromJS(arr);

  expect(Immutable.List.isList(myList)).to.be.true;
  expect(myList.getIn([2, 0])).to.equal('todo 3');
});

it('should use reviver to generate Map() instead of List() from a plain JS array', () => {
  let arr = ['todo 1', 'todo 2', ['todo 3', 'todo 4']];
  let myMap = Immutable.fromJS(arr, (key, value) => {
    return value.toMap();
  });

  expect(Immutable.Map.isMap(myMap)).to.be.true;
  // convert List to Map, it use index based key
  expect(myMap.getIn([2, 0])).to.equal('todo 3');
});
```
