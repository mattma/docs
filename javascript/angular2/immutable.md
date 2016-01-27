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
