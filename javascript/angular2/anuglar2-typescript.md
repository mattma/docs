## Type

TS compiler can guess the type (it’s called "type inference") from the values.

type can also be coming from your app (like "class"), as with the following `class Pony`:

```js
let pony: Pony = new Pony();
// support "generics"
let ponies: Array<Pony> = [new Pony()];
```

If your variable can only be of type number or boolean, you can use a union type:

```js
let changing: number|boolean = 2;
changing = true; // no problem
```

## Enums

TypeScript also offers enum. For example, a race in our app can be either ready, started or done. The enum is in fact a numeric value, starting at 0. You can set the value you want

```js
enum RaceStatus {Ready, Started, Done}
let race: Race = new Race();
race.status = RaceStatus.Ready;
```

## Interface

A function can receives an object

```js
function addPointsToScore(player: { score: number; }, points: number): void {
  player.score += points;
}

// or
interface HasScore {
  score: number;
}
function addPointsToScore(player: HasScore, points: number): void {
  player.score += points;
}
```

- Functions as property

```js
interface CanRun {
  run(meters: number): void;
}
function startRunning(pony: CanRun): void {
  pony.run(10);
}
let pony = {
  run: (meters) => logger.log(`pony runs ${meters}m`)
};
startRunning(pony);
```

## Class

A class can implement an interface. The compiler will force us to implement a run method in the class. If we implement it badly, by expecting a string instead of a number for example, the compiler will yell. ex: Pony class should be able to run

```js
class Pony implements CanRun {
  run(meters) {
    logger.log(`pony runs ${meters}m`);
  }
}
```

```js
// interface can extend one or several others
interface Animal extends CanRun, CanEat {}
// implement several interfaces
class Pony implements Animal, CanYell {
  // ...
}
```

When you’re defining a class in TypeScript, you can have properties and methods in your class. You may realize that properties in classes are not a standard ES6 feature, it is only possible in TypeScript.

```js
class SpeedyPony {
  speed: number = 10; // property
  run() {   // method
    logger.log(`pony runs at ${this.speed}m/s`);
  }
}
```

Everything is `public` by default, but you can use the `private` keyword to hide a property or a method. If you add `private` or `public` to a constructor parameter, it is a shortcut to create and initialize a `private` or `public`member:

```js
class NamedPony {
  constructor(
    public name: string,
    private _speed: number
  ) { }

  run() {
    logger.log(`pony runs at ${this._speed}m/s`);
  }
}
```

## Working with other libraries

The files containing these interfaces have a special `.d.ts` extension. They contain a list of the library’s public functions.

`/// <reference path="angular.d.ts" />` is a special comment recognized by TS, telling the compiler to look for the interface `angular.d.ts`. Now, if you misuse an AngularJS method, the compiler will complain, and you can fix it on the spot, without having to manually run your app!

## Decorator

A decorator is a way to do some meta-programming, similar to annotations which are mainly used in Java, C#, etc.

you add an annotation to a method, an attribute, or a class. Generally,annotations are not really used by the language itself, but mainly by frameworks and libraries.

Decorators are really powerful: they can modify their target (method, classes, etc…), and for example alter the parameters of the call, tamper with the result, call other methods when the target is called or add metadata for a framework

```js
// ex: build a simple `@Log` decorator
class RaceService {
  @Log()
  getRaces() {
    // call API
  }
  @Log()
  getRace(raceId) {
    // call API
  }
}

// To define it, we have to write a method returning a function
// Depending on what you want to apply your decorator to, the function will not have exactly the same arguments.
/**
 * target: the method targeted by our decorator
 * name: the name of the targeted method
 * descriptor: a descriptor of the targeted method (is the method enumerable, writable, etc…)
 */
let Log = function () {
  return (target: any, name: string, descriptor: any) => {
    logger.log(`call to ${name}`);
    return descriptor;
  };
};
```

So, in our simple example, every time the getRace() or getRaces() methods are called, we’ll see a trace in the browser logs:

```js
raceService.getRaces(); // logs: call to getRaces
raceService.getRace(1); // logs: call to getRace
```

The `@Component` decorator is added to the class `Home`. When Angular 2 loads our app, it will find the class `Home` and will understand that it is a component, based on the metadata the decorator will add.

```js
@Component({selector: 'home'})
class Home {
  constructor(@Optional() hello: HelloService) {
    logger.log(hello);
  }
}
```
