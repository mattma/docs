# [Should.js](https://github.com/shouldjs/should.js)

BDD style assertions for node.js, should is an expressive, readable, framework-agnostic assertion library. should extends the Object.prototype with a single non-enumerable getter that allows you to express how that object should behave. It also returns itself when required with `require`.

### Sugar

```js
// negates the current assertion.
    .not

// assertions with multiple parameters to assert any of the parameters (but not all)
    .any

// better readability, nothing else
    .an, .of, .a, .and, .be, .have, .with, .is, .which.

```

### Assertion API

Assertions can be chained. Every assertion will return a should.js-wrapped Object, so assertions can be chained.

Almost all assertions return the same object - so you can easy chain them. But some (eg: .length and .property) move the assertion object to a property value

```js
//Warning

//No assertions can be performed on null and undefined values
// Error:  give you Uncaught TypeError: Cannot read property 'should' of undefined).
    undefined.should.not.be.ok;
// In order to test for null use
    (err === null).should.be.true;
```

```js
// Assert truthy in js (ie: not '', null, undefined, 0 , NaN).
    .ok

// Assert if a chained object === true:
    .true

// Assert if a chained object === false:
    .false

// Asserts if a chained object is equal to otherValue.
// Compared by its actual content, not just reference equality, not its type
    .eql(otherValue)

// Asserts if a chained object is strictly equal to otherValue (using ===).
// Primitive values compared as is (there is no any type conversion)
// and reference values compared by references.
    .equal(otherValue)
    .exactly(otherValue)

// Assert that a string starts with str.
    .startWith(str)

// Assert that a string ends with str.
    .endWith(str)

// Assert a given object is of a particular type (using typeof operator)
    .type(str)

// Assert a given object is instance of the given constructor (shortcut for .instanceof assertion).
    .Object
    .Number
    .Array
    .Boolean
    .Function
    .String
    .Error

// Assert a given object is an instance of constructor (using instanceof operator):
    .instanceof(constructor)
    .instanceOf(constructor)

// Assert a given object is an Arguments
/*
    var args = (function(){ return arguments; })(1,2,3);
    args.should.be.arguments;
    [].should.not.be.arguments;
 */
    .arguments

// Assert given value is empty. Strings, arrays, arguments with a length of 0,
// and objects without their own properties, are considered empty.
    .empty

// Assert given value to contain something .eql to otherValue.
// Note: When .containEql check arrays it check elements to be in the same order in otherValue
// and object just to be presented.
/*
    'hello boy'.should.containEql('boy');
    [1,2,3].should.containEql(3);
    [[1],[2],[3]].should.containEql([3]);
    [[1],[2],[3, 4]].should.not.containEql([3]);

    ({ b: 10 }).should.containEql({ b: 10 });
    ([1, 2, { a: 10 }]).should.containEql({ a: 10 });
    [1, 2, 3].should.not.containEql({ a: 1 });

    [{a: 'a'}, {b: 'b', c: 'c'}].should.containEql({a: 'a'});
    [{a: 'a'}, {b: 'b', c: 'c'}].should.not.containEql({b: 'b'});
 */
    .containEql(otherValue)
```

```js
//### Object

// Assert length property exists and has a value of the given number (shortcut for .property('length', number))
// Note: change the chain's object to the given length value, so be careful when chaining
    .length(number)
    .lengthOf(number)

// Assert a property exists, is enumerable, and has an optional value (compare using .eql)
// 'asd'.should.not.have.enumerable('0');
// user.should.have.enumerable('name');
// user.should.have.enumerable('age', 15);
// user.should.not.have.enumerable('rawr');
// user.should.not.have.enumerable('age', 0);
// [1, 2].should.have.enumerable('0', 1);
    .enumerable(name[, value])

// Assert property exists and has an optional value (compare using .eql)
// Note: it changes the chain's object to the given property's value, so be careful when chaining after .property!
    .property(name[, value])

// Assert given object has own property (using .hasOwnProperty)
// it changes the chain's object to the given property value, so be careful when chaining!
    .ownProperty(str)
    .hasOwnProperty(str)

// Assert all given properties exist and have given values (compare using .eql)
// Note: `obj` should be an object that maps properties to their actual values.
    .properties(propName1, propName2, ...)
    .properties([propName1, propName2, ...])
    .properties(obj)

// Assert own object keys, which must match exactly, and will fail if you omit a key or two
/*
    var obj = { foo: 'bar', baz: 'raz' };
    obj.should.have.keys('foo', 'baz');
    obj.should.have.keys(['foo', 'baz']);
    ({}).should.have.keys();
    ({}).should.have.keys('key'); //fail AssertionError: expected {} to have key 'key'missing keys: 'key'
 */
    .keys([key1, key2, ...])]
    .keys(key1, key2, ...)
    .key(key)

// Assert property exists and has optional value (compare using .eql)
// note: changes the chain's object to the given property's value if found
/*
    var obj = { foo: 'bar', baz: 'raz', zad: { a: 10 } };
    obj.should.have.propertyByPath('zad', 'a');
    obj.should.not.have.propertyByPath(0, 1, 2);
 */
    .propertyByPath([name1, ...])
    .propertyByPath(name1, name2, ...)
```

```js
//### numeric

// Assert inclusive numeric range (<= to and >= from)
    .within(from, to)

// Assert a numeric value is above the given value (> num)
    .above(num)
    .greaterThan(num)

// Assert a numeric value is below the given value (< num)
    .below(num)
    .lessThan(num)

// Assert a floating point number is near num within the delta margin
// ex: (99.99).should.be.approximately(100, 0.1);
    .approximately(num, delta)

// Assert a numeric value is NaN
    .NaN

// Assert a numeric value is Infinity
    .Infinity
```
