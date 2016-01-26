## Angular2 immutability

if you use immutable data, you have to let your angular Angular component know about it, so it knows how to optimize the rendering process.

#### ChangeDetectionStrategy

If you have a component that only expects immutable data to be passed in via a property, you can further optimize rendering speed by adding changeDetection: `ChangeDetectionStrategy.OnPush` to the component.

Modeling application state using immutable objects solves these problems (1. tracking changes hard, both for the developer and the framework. 2.  force Angular to be conservative by default, which negatively affects performance). The component can change if and only if any of its inputs changes. And we can communicate it to Angular by setting the change detection strategy to `OnPush`.

`ChangeDetectionStrategy.OnPush` tells Angular that it should not re-render the component unless the input property has changed. This allows Angular to optimize the rendering process for the component. Use carefully, it may break your app. ex: `@Input() game: any;` has input coming in from parent component.

```js
@Component({
  selector: 'person',
  template: `{{person.name}} lives at {{address.street}}, {{address.city}} (zipCode)`,
  changeDetection: ChangeDetectionStrategy.OnPush // ⇐===
})
class DisplayPerson {
  @Input() person: {name:string};
  @Input() address: {city:string, street:string};
  zipCode: string;

  constructor(private zipCodes:ZipCodes) {}

  onChanges(inputChanges) {
    if (inputChanges.address) { // this means that the address was replaced
      this.zipCode = this.zipCodes(this.address);
    }
  }
}
```

Using this change-detection strategy restricts when Angular has to check for updates from “any time something might change” to “only when this component’s inputs have changed”. As a result, the framework can be a lot more efficient about detecting changes in DisplayPerson. If no inputs change, no need to check the component’s template. Perfect! Immutable objects are awesome!

#### What is mutable, Immutable

Primitives types like `string` and `number` are immutable. You can freeze JavaScript objects and array to make them immutable, but a better option would be to use libraries like `Immutable.js` or `Mori`. They provide efficient implementation of immutable collections and records and are easy to use.

Mutable data may change. Immutable data cannot be changed once created, leading to much simpler application development, no defensive copying, and enabling advanced memoization and change detection techniques with simple logic. Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data.

**Mutable data contains (State + Time), Immutable data always have the same thing via Structual Sharing**

```js
// mutable array
var arr = []
var v2 = arr.push(2)
v2 // <= 1 the length of the arr
arr // [2] has been modified, lost the original array

// immutable array
// have both version available, we decide when to discard old values
var arr = new ImmutableArray([1,2,3,4])
var v2 = arr.push(5)
v2.toArray()  // [1,2,3,4,5]
arr.toArray()  // [1,2,3,4]
```

```js
// immutable object
var person = new ImmutableMap({
  name: 'Chris', age: 32
})
var older = person.set('age', 33)
person.toObject() // {name: 'Chris', age: 32}
older.toObject() // {name: 'Chris', age: 33}
```

#### IMMUTABILITY VS ENCAPSULATION

Modeling application state using exclusively immutable objects requires pushing the state management out of the component tree. Since address is immutable, we cannot update its street property in place. Instead, we have to create a new address object. Say this address is stored in some PersonRecord object. Since that object is immutable too, we will have to create a new PersonRecord object. Therefore, the whole application state will have to be updated if we change the street property of the address.

Move all local mutable state from our components to parent component, pass in as Input. Completely disallowing local mutable state will mean that all values will have to be stored in the application state object. We need to pass it in and out.

In summary, removing mutable state simplifies tracking changes in the application and makes the application more performant. But at the same time it breaks the encapsulation of components, and their implementation details start to leak out.

**Best practices**

Application state that is passed around is modeled using immutable objects.

Components can have local state that can only be updated when their inputs change or an event is emitted in their templates. Since inputs are immutable, an input has to be replaced to affect a component. Nothing outside the component can change them in any way.

we allow mutable state, but in a very scoped form


## Smart and dumb components

**Smart component** does the heavy lifting (Fetching data, etc.) It contains little layout information and relies instead on dumb components.

**Dumb components** receives its data from the smart component and displays it with little to no added logic. It makes them reusable and easier to test.

