# Typescript

Compiled using Node.js to transform plain javascript.

## What are types?

"locking" a variable definition to a particular kind of variable, allow code hinting, automated documentation.

## Build in types

**number**,
**string**,
**boolean** (true, false, undefined, null),
**array** (both an Var is an array and the kind elements it contains.
ex: `var n:number[] = [1,2,3]`  ex: `var list:Array<number> = [1,2,3]`),
**enum** (Collection of unique strings. giving more friendly names to sets of numeric values. ex: `enum Status {complete, pending, declined};  var s: Status = Status.complete`),
**any** (like *, avoided if u can),
**void** (absence of any type, mostly use for function return signatures. ex: `function nothing(): void {}`)

## Interfaces

A.K.A, "duck typing" or "structural subtyping". It defines a "shape" for JS objects, functions, both the kind of key an array uses and the typeof entry it contains (index can be of type string or type number), interfaces can define a class similar to Java(blueprint of objects), and more. It creates a contract for code.

```js
interface Name {
  name: string;
  age?: number;  // age? property is an optional type
  (source: string, subString: string): boolean;  // describe Functions
  [index: number]: string; // describe Array
}
```

#### Function Types

Describe Function interface a call signature. This is like a function  declaration with only the parameter list and return type given. Once defined, we can use this function type interface like we would other interfaces.

For function types to correctly type-check, the name of the parameters do not need to match. Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other.

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}

var mySearch: SearchFunc;
mySearch = function(source: string, subString: string): boolean {
  var result = source.search(subString);
  return result === -1 ? false : true;
}
```

#### Array Types

Array types have an 'index' type that describes the types allowed to index the object, along with the corresponding return type for accessing the index.

```js
interface StringArray {
  [index: number]: string;
}

var myArray: StringArray;
myArray = ["Bob", "Fred"];
```

There are two types of supported index types: string and number. It is possible to support both types of index, with the restriction that the type returned from the numeric index must be a subtype of the type returned from the string index.

While index signatures are a powerful way to describe the array and 'dictionary' pattern, they also enforce that all properties match their return type.

```js
interface Dictionary {
  [index: string]: string;
  length: number; // error, type of 'length' is not a subtype of the indexer, is not assignable to string index type "string"
}
```

#### Class Types

Implementing an interface, explicitly enforcing that a class meets a particular contract.

```js
// Class Types: can combine multiple interfaces in a class
interface Person {
  age: number;
}
interface Athlete {
  sport: string;
  setTime(d: Date); // describe methods in an interface
}
class Dancer implements Person,Athlete {
  age: number;
  dance: string;
  sport: string;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}
```

Interfaces describe the public side of the class, rather than both the public and private side. This prohibits you from using them to check that a class also has particular types for the private side of the class instance.

Difference between static/instance side of class

When working with classes and interfaces, it helps to keep in mind that a class has two types: the type of the static side and the type of the instance side. You may notice that if you create an interface with a construct signature and try to create a class that implements this interface you get an error:

```js
interface ClockInterface {
  new (hour: number, minute: number);
}
class Clock implements ClockInterface  { // error, incorrect implement the ClockInterface interface
  currentTime: Date;
  constructor(h: number, m: number) { }
}
```

This is because when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check. Instead, you would need to work with the 'static' side of the class directly. In this example, we work with the class directly:

```js
interface ClockStatic {
  new (hour: number, minute: number);
}

class Clock  {
  currentTime: Date;
  constructor(h: number, m: number) { }
}

var cs: ClockStatic = Clock;
var newClock = new cs(7, 30);
```


#### Extending interface

copying the members of one interface into another, allowing you more freedom in how you separate your interfaces into reusable components.

```js
// Extending other interfaces: two properties are required
interface Person {
  age: number;
}
interface Musician extends Person {
  instrument: string;
}
// generic caller syntax
var ginger = <Musician> {
  age: 30,
  instrument: "violin"
};
```

An interface can extend multiple interfaces, creating a combination of all of the interfaces.

```js
interface Shape {
  color: string;
}
interface PenStroke {
  penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}

var square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

Hybrid Interfaces: describe a function and an object at the same time. encounter an object that works as a combination of some of the types, One such example is an object that acts as both a function and an object, with additional properties: (fully-describe the shape of the type.)

```js
// example 1
interface Jump {
  (distance: number): string;
  height: number;
}
var j: Jump;
j(50)
j.height = 12;

// example 2
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

var c: Counter;
c(10);
c.reset();
c.interval = 5.0;
```

## Classes

Classes are object blueprints, each instance of a class hass its own unique properties.

Classes are defined with `class` keyword, and instantiated with `new` keyword.

```js
class Person {
  name: string; // Property of the Person
  // special method, auto run when object is created
  constructor(name: string) {
    this.name = name;  // this refer to instance of the object
  }
  introduce() {  // classes has a method of introduce
    return `hello, ${this.name}`;
  }
}
let matt = new Person("matt");
```

Classes can inherit properties from other classes using `extends` keyword, child classes inherit all method and properties.

```js
class Police extends Person {
  introduce() {
    super.introduce(); // override default
    // ...  add more logic
  }
  hasJob() {}
}
```

#### Public/Private modifiers

Classes properties are public by default. Public properties can be accessed through `object[propName]`. Private properties cannot be accessed externally.

```js
class Lock {
  private passcode: number;
  constructor(passcode: number) {
    this.passcode = passcode;
  }
  unlock(code: number) {
    if(code===this.passcode) {
      console.log("unlocked");
    }
  }
}
let lock = new Lock(7777);
console.log(lock.passcode); // compile-time error
lock.unlock(7777); // ok
```

#### Accessors

Let you define special functions for accessing or setting a variable, looks like a normal public variable from outside the class.

```js
class Hamster {
  private _name: string;
  get name () : string {
    return this._name;
  }
  set name (name: string) {
    this._name = name;
  }
}
let h = new Hamster();
console.log(h.name);  // undefined
h.name = "mattma";
console.log(h.name);  // mattma
```

#### Static properties

It belongs to the class itself, and not an instance.

```js
class Ruler {
  static centimeterToInch: number = 0.393;
  convertCentimeters(cm: number) {
    // `this` is not used, Ruler is used which is the class itself
    return cm * Ruler.centimeterToInch;
  }
}
let ruler = new Ruler();
ruler.convertCentimeters(3); // 1.179
console.log(Ruler.centimeterToInch); // 0.393. <= only existed on Class
```

## Modules

Group similar objects of functions, sharing code between files, JS has many (AMD, Require, etc) but Typescript has its own solution.

Modules are defined with the `module` keyword, and their `export` can be access much like properties of an object.

```js
// calc.ts
module Calc {
  export function half(n: number) {
    return n / 2;
  }
}
let half = Calc.half(32);
```

#### Modules file sharing. Combine with the reference construct

```js
/// <reference path="calc.ts" />
Calc.half(32)  // 16
```

#### Import and Export statements

Simplify sharing different objects between code with clean syntax.

```js
// calc.ts
export function half(n: number) : number {}
```

```js
import calc = require('calc');
calc.half(10)
```

## d.ts files

When using an external JavaScript library, or new host API, you'll need to use a declaration file (.d.ts) to describe the shape of that library.

- workflow

The best way to write a `.d.ts` file is to start from the documentation of the library, not the code. Working from the documentation ensures the surface you present isn't muddied with implementation details, and is typically much easier to read than JS code.

- Namespacing

When defining interfaces (ex: "options" objects), you have a choice about whether to put these types inside a module or not.

If the consumer is likely to often declare variables or parameters of that type, and the type can be named without risk of colliding with other types, prefer placing it in the global namespace.

If the type is not likely to be referenced directly, or can't be named with a reasonably unique name, do use a module to prevent it from colliding with other types.

- Callbacks

Many JavaScript libraries take a function as a parameter, then invoke that function later with a known set of arguments. When writing the function signatures for these types, do not mark those parameters as optional. The right way to think of this is "What parameters will be provided?", not "What parameters will be consumed?". TypeScript does not enforce that the optionality, bivariance on argument optionality might be enforced by an external linter.

- Extensibility and Declaration Merging

Remember TypeScript's rules for extending existing objects. You might have a choice of declaring a variable using an anonymous type or an interface type. From a consumption side these declarations are identical, but the type SomePoint can be extended through interface merging

```js
// Anonymously-typed var
declare var MyPoint: { x: number; y: number; };

// Interfaced-typed var
interface SomePoint { x: number; y: number; }
declare var MyPoint: SomePoint;
```

- Class Decomposition

Classes in TypeScript create two separate types: the instance type, which defines what members an instance of a class has, and the constructor function type (A.K.A static type members of the class), which defines what members the class constructor function has.

While you can reference the static side of a class using the `typeof` keyword, it is sometimes useful or necessary when writing definition files to use the decomposed class pattern which explicitly separates the instance and static types of class.

As an example, the following two declarations are nearly equivalent from a consumption perspective:

```js
// Standard
class A {
  static st: string;
  inst: number;
  constructor(m: any) {}
}

// Decomposed
interface A_Static {
  new(m: any): A_Instance;
  st: string;
}
interface A_Instance {
  inst: number;
}
declare var A: A_Static;
```

The trade-offs here are as follows:

Standard classes can be inherited from using `extends`; decomposed classes cannot. This might change in later version of TypeScript if arbitrary extends expressions are allowed.
It is possible to add members later (through declaration merging) to the static side of both standard and decomposed classes.
It is possible to add instance members to decomposed classes, but not standard classes.
You'll need to come up with sensible names for more types when writing a decomposed class.

#### example

- Options Objects

```js
animalFactory.create("dog");
animalFactory.create("giraffe", { name: "ronald" });
animalFactory.create("panda", { name: "bob", height: 400 });
// Invalid: name must be provided if options is given
animalFactory.create("cat", { height: 32 });
```

```js
// type
module animalFactory {
  interface AnimalOptions {
    name: string;
    height?: number;
    weight?: number;
  }
  function create(name: string, animalOptions?: AnimalOptions): Animal;
}
```

- Functions with Properties

```js
zooKeeper.workSchedule = "morning";
zooKeeper(giraffeCage);
```

```js
//type
// Note: Function must precede module
function zooKeeper(cage: AnimalCage);
module zooKeeper {
  var workSchedule: string;
}
```

- New + callable methods

```js
var w = widget(32, 16);
var y = new widget("sprocket");
// w and y are both widgets
w.sprock();
y.sprock();
```

```js
//type
interface Widget {
  sprock(): void;
}

interface WidgetFactory {
  new(name: string): Widget;
  (width: number, height: number): Widget;
}

declare var widget: WidgetFactory;
```

- Global / External-agnostic Libraries

```js
// Either
import x = require('zoo');
x.open();
// or
zoo.open();
```

```js
//type
module zoo {
  function open(): void;
}

declare module "zoo" {
  export = zoo;
}
```

- Single Complex Object in External Modules

```js
// Super-chainable library for eagles
import eagle = require('./eagle');
eagle('bald').fly();         // Call directly
var eddie = new eagle(1000); // Invoke with new
eagle.favorite = 'golden';   // Set properties
```

```js
// type
// Note: can use any name here, but has to be the same throughout this file
declare function eagle(name: string): eagle;
declare module eagle {
  var favorite: string;
  function fly(): void;
}
interface eagle {
  new(awesomeness: number): eagle;
}
export = eagle;
```

- Callbacks

```js
addLater(3, 4, (x) => console.log('x = ' + x));
```

```js
//type
// Note: 'void' return type is preferred here
function addLater(x: number, y: number, (sum: number) => void): void;
```
