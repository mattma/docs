// regenerator runtime and the es6-shim and es6-symbol polyfills.
// https://6to5.github.io/polyfill.html
// In my test case, Array.from, without polyfill, it won't work
require("6to5/polyfill");

/*
  Scope & Assignment
  - Block Scope: let
 */

function letMe(bool) {
  var result = "result in global scope";
  if ( bool ) {
    let result = "result in block scope";
    console.log('result: ', result);
  }
  return result;
}
letMe(); // "result in global scope"
letMe(true); // "result in block scope"

// Block Scope - let
//for (let i = 0; i <= 10; i++ ) {
//  console.log(i);
//}

// Const
const GOOD_COP = "good cop";
// GOOD_COP = 'bad cop';  // <= compiled error
console.log(GOOD_COP);  // "good cop"

// Destructuring
// matching first two elements, ignore the third
let [a, b] = ["matt", "sam", "aaron"];
console.log(`${a} & ${b}`); // "matt & sam"

let [x, ...rest] = ["matt", "sam", "aaron"];
console.log('rest: ', rest); // "sam, aaron"

let person = {
  name: "matt",
  voice: "hello world"
};
let { name: n, voice: v } = person;
console.log(`${n} said ${v}`); // "matt said hello world"

/*
  Functions
 */

// Arrow Functions  =>
let greeting = {
  name: "matt",
  greet: function() {
    return () => console.log(`hi, I'm ${this.name}`);
  }
};
greeting.greet()(); // hi, I'm matt

let logify = x => console.log(JSON.stringify(x, null, 2));
logify({
  firstName: "matt",
  lastName: "ma"
}); /* { "firstName": "matt", "lastName": "ma" } */


let arrowFn = words => words.map( (w) => w.length );
console.log( arrowFn(['sea', 'beach', 'do']) ); // [3, 5, 2]


// Default Params
function defaultParam(name = "matt") {
  console.log(`hello ${name}`);
}
defaultParam(); // "hello matt"
defaultParam("sam"); // "hello sam"


// Spread Operator & Rest Parameter
function restParams(x, ...y) {
  console.log( x * y.length );
}
restParams(3, "hello", true); // 6

function spread(x, y, z) {
  console.log(x + y + z);
}
// Pass each elem of array as argument
spread(...[1,2,3]); // 6


// Named parameters (with default value)
function namedParam(c, {name, voice}){
  console.log(name, 'said', voice, " : ", c);
}
namedParam(GOOD_COP, person); // "matt said hello world  :  good cop"
// namedParam(GOOD_COP, { voice: "hello world"} ); // "sam said hello world  :  good cop""

/*
  String & Object API Additions
 */

// Multi-line Strings
let multi = `  ${person.name} voiced
${person.voice}
`
console.log(multi);

// startsWith, contains, endsWith
let quotes = "Rest in pieces!";
console.log(quotes.startsWith("Res"));  // true
console.log(quotes.contains("t in p")); // true
console.log(quotes.endsWith("s!")); // true

// Object.is
console.log( Object.is("matt", "ma") );  // false
console.log( Object.is(NaN, NaN) );  // true
console.log( Object.is(0, -0) );  // false
console.log( Object.is(-0, -0) );  // true

// Object Shorthand
let objShort = {
  test() {
    return "shorthand test"
  }
};
console.log( objShort.test() );

// Object Literal Shorthand
let literal1 = "matt";
let literal2 = "ma";
function literalShortHand(options){
  console.log( JSON.stringify(options) );
}
literalShortHand({ literal1, literal2, literal3: 23 });
// { literal1 = "matt", literal2 = "ma", literal3 = 23 }

// Object literal function shorthand
let obj = {
  name: "matt",
  sayHi() {  // sayHi: function() {
    return `Hi there, I'm ${this.name}`
  }
};

// Template Literal
let uppercase = function(strings) {
  let result = "";
  for( var i=0; i < strings.length; i++) {
    result += strings[i];
  }
  return result.toUpperCase();
};
let x = 1;
let y = 3;
let xyresult = uppercase(`${x} + ${y} is ${x+y}`);
console.log('result: ', xyresult);  // 1 + 3 IS 4

// Template Literal with multiple lines with no escape
let multiline = `this is a
  multiple lines
  string test with NO excaping!`
console.log('multiline: ', multiline);

// Object.assign
let obj1 = "matt",
  obj2 = { obj2: "sam"},
  obj3 = { obj3: "aaron"},
  objs = Object.assign({obj1}, obj2, obj3); // like _.extend
console.log( JSON.stringify(objs) ); // {"obj1":"matt","obj2":"sam","obj3":"aaron"}

/*
  Number API Additions
 */

// Number.isInteger, Number.isSafeInteger, Number.isNaN
console.log( Number.isInteger(0.7) ); // false
console.log( Number.isSafeInteger( Math.pow(2, 53) + 1 ) ); // false
console.log( Number.isNaN( NaN ) ); // true
console.log( NaN == NaN ); // false

/*
  Array API Additions
 */

// Array.findIndex(), Array.find()
let arrInd = [ { name: 'matt'}, { name: 'sam'}, {name: 'aaron', age: 3} ];
console.log( arrInd.findIndex( x => x.name === 'sam') ); // 1
console.log( arrInd.find( x => x.name === 'aaron' ).age ); // 3

// Array.fill()
let arrFill = [ "matt", "sam", "aaron"];
arrFill.fill("unknown", 1, arrFill.length);
console.log( arrFill ); // [ 'matt', 'unknown', 'unknown' ]
let arrFill2 = [ "matt", "sam", "aaron"];
arrFill2.fill("unknown", -1, arrFill.length);
console.log( arrFill2 ); // [ 'matt', 'sam', 'unknown' ]

// Array.from()  // like Array.map, always return an Array
// syntax: Array.from(arrayLike[, mapFn[, thisArg]])
function arrFrom() {
  return Array.from(arguments);
}
console.log( arrFrom( 'change', 'to', 'array' ) ); // [ 'change', 'to', 'array' ]

// Any iterable object... ex: Set
console.log( Array.from( new Set(["foo", "bar"]) ) ); // ["foo", "bar"]

// Map
console.log( Array.from( new Map([[1, 2], [2, 4], [4, 8]]) ) ); // [[1, 2], [2, 4], [4, 8]]

// String
console.log( Array.from('array') ); // [ 'a', 'r', 'r', 'a', 'y' ]

// Using an arrow function as the map function to manipulate the elements
console.log( Array.from(arrInd, n => n.name ) ); // [ 'matt', 'sam', 'aaron' ]

// Generate a sequence of numbers
console.log( Array.from({length: 5}, (v, k) => k) ); // [ 0, 1, 2, 3, 4 ]


// Array.map, Array.filter
let arrMap = [{name: "matt"}, {name: "sam"}, {name: "aaron"}];
arrMap.map((val, ind) => {
  console.log('map val: ', val);  // map val:  { name: 'matt' }
  console.log('map ind: ', ind);  // map ind: 0
});

let arrComp = [1, 2, 11, 20];

console.log('arrMap.entries(): ',arrMap.entries());
console.log('arrMap.keys(): ', arrMap.keys());
console.log('arrMap.values(): ', arrMap.values());

/*
  Loops, Generators, Collections & more
 */

// Iteration via for-of
for(let name of ["matt", "sam"]) {
  console.log( name );
}  // matt    sam

for(let p of Object.keys(person)) {
  console.log(p, ' : ', person[p]);
}
// name  :  matt
// voice  :  hello world

// Warning: when define a generator function, now,
// it has to define as a let/var variable, otherwise,
// Error: regeneratorRuntime is not defined, Polyfill is not loaded

// Generators: Allow you to "Pause & Resume" a function
// "Interruptible Computations", "Shallow Coroutines"
// Great for simplifying async code
let entries = function* (obj) {
  for(let k of Object.keys(obj)) {
    yield [k, obj[k]];
  }
};
// destructuring - to get key/value
for(let [key, value] of entries(person) ){
  console.log(key, ' : ', value);
}
// name  :  matt
// voice  :  hello world

/*
  Generators return a generator object that is an `iterator`
  Pausing with yield, concurrency minus the callbacks
  An iterator has a `next` method
  calling next returns an Object. { value: , done: Boolean }
 */
let names = function* () {
  yield "matt";
  yield "sam";
  yield "aaron";
};
for( let n of names() ) {
  console.log(n);
}
// matt   sam    aaron
let generatorExam = names();
console.log( JSON.stringify(generatorExam.next() ) ); //{"value":"matt","done":false}
console.log( JSON.stringify(generatorExam.next() ) ); //{"value":"sam","done":false}
console.log( JSON.stringify(generatorExam.next() ) ); //{"value":"aaron","done":false}
console.log( JSON.stringify(generatorExam.next() ) ); //{"value": undefined, "done":true}


// Map
/*
  Data structure mapping Keys and Values
  Can be iterated over via for-of
  not limited to string keys
 */
var map = new Map();
// string as key
map.set("name", "matt");
// symbols as key
map.set( Symbol(), 37 );
// Objects as key
map.set({name: "sam"}, "sammy");

for(let [k, val] of map) {
  console.log(JSON.stringify(k), " : ", val);
}
// "name"  :  matt
// {}  :  37
// {"name":"sam"}  :  sammy

// testing for keys
console.log( map.has("name") ); // true
// like array to get its length
console.log( map.size );  // 3
// remove keys. for Object or Symbol,
// they need to be assigned to a variable
console.log( map.delete('name') );
console.log( map.size );  // 2
// use spread operator to get values array
console.log( ...map.values() ); // 37 'sammy'
console.log( ...map.keys() ); // {} { name: 'sam' }
map.clear();
console.log( 'map size: ', map.size ); // 0

// WeakMap
/*
  Keys are weakly held* objects
  values are anything
  keys are not enumerable because of garbage collection
 */
//let lucy = { name: "lucy"};
//let weakmap = new WeakMap();
//weakmap.set(lucy, "name is lucy");
//console.log(weakmap.get(lucy)); // "name is lucy"

// Set : A collection with NO duplicates
let set = new Set();
set.add("sam");
set.add("matt");
set.add("matt");
for(let item of set){
  console.log(item);
}
// sam    matt
console.log( set.has("sam") ); // true
console.log( set.delete("sam") );
console.log( 'set size: ', set.size ); // 1
set.clear();
console.log( 'set size: ', set.size ); // 0

let set1 = new Set([1,1,2,2,3]);
for(let v of set1) {
  console.log(v);
}
// 1 2 3

// WeakSet
/*
  holds weakly held* Objects only
  Objects will be unique(like set), but Not enumerable
 */


/*
  Promises
  Respresent the result of an async operation. thenable.
 */
let findTheSpecial = function(){
  return new Promise(
    (resolve, reject) => resolve("matt")
  );
};

findTheSpecial()
  .then(
    x => console.log('Promise: My name is ', x),
    err => console.log(err)
);
// My name is  matt


/*
  Modules/Classes
 */
// import the whole modele `es6-module.js`
import * as mod from "./es6-module";
console.log( 'module: ', mod.everything() );  // everything is awesome

// named import
import { anotherValue as val, everything } from "./es6-module";
console.log('module: ', everything() );  // everything is awesome
console.log('module: anotherValue variable is: ', val);  // 10

// using the default export example
import def from "./es6-module";
console.log( def() ); // this is a default function export


// Class: syntactical sugar over prototypes & object instances
class LegoPerson {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    return `HI, I'm ${this.name}`;
  }
}
let legoman = new LegoPerson("matt");
console.log( legoman.sayName() ); // HI, I'm matt

class CustomLegoMan extends LegoPerson {
  constructor(otherName) {
    super("aaron");
    this.otherName = otherName;
  }
  get myOtherName() {  // like ember
    return `My name is ${this.name}; Call me ${this.otherName}`;
  }
}
let customLegoman = new CustomLegoMan("Some OtherName");
console.log( customLegoman.sayName() );  // HI, I'm aaron
console.log( customLegoman.myOtherName ); // My name is aaron; Call me Some OtherName

// new way
class Animal {
  constructor(name) {
    this.name = name;
  }
  breathe() {
    console.log(`${this.name} is breathing`);
  }
}
// old way
function Animal(name) {
  this.name = name;
}
Animal.prototype.breathe = function() {
  console.log(`${this.name} is breathing`);
}

/*
  Proxies
  define the sematics of an object in Javascript
  give you hooks to intercept/trap certain operations
  Use-cases includes: 1) default values/method missing, 2) validation,
  3) value correction/transformation, 4) logging, profiling, 5) more
 */
// 6to5 does not support it.
//let batman = {
//  sayIt: "to the bat mobile"
//};
//let pBatman = new Proxy(batman, {
//  get: function (target, name) {
//    let result = target[name];
//    if(name === "sayIt") {
//      result += "Dang it!";
//    }
//    return result;
//  }
//});
//console.log('batman: ', pBatman.sayIt );

/*
  Symbols
  New kind of Primitive, Each one is unique(name-collision avoidance!)
  used as an identifier for object properties
  symbol-keyed members: 1) are not visible in for-in iterations,
  2) are not serialized with JSON.stringify
 */

// symbol can take an optional description parameter
let symbol1 = Symbol();
let symbol2 = Symbol("symbol 2");
let renderSymbol = function(s) {
  switch(s) {
    case symbol1 :
      console.log('symbol 1 is hit.');
      break;
    case symbol2 :
      console.log('symbol 2 is hit.');
      break;
  }
};
renderSymbol(symbol2); // symbol 2 is hit.

// symbols as Identifiers
let symbol3 = {
  [symbol1] : function () {
    return "hello world";
  }
};
symbol3[symbol1]();
console.log( JSON.stringify(symbol3)); // {}
