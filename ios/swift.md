Swift is an Object oriented language.

- [Application Lifecycle](#application-lifecycle)
- [import](#import)
- [Syntax](#syntax)
- [logging](#logging)
- [Number](#number)
- [String](#string)
- [Variable](#variable)
- [Array](#arrray)
- [Dictionary](#dictionary)
- [Tuple](#tuple)
- [Operators](#operators)
- [Optionals](#optionals)
- [Enumeration](#enumeration)
- [Loop](#loop)
- [if and switch](#if-and-switch)
- [function](#function)
- [Class and Struct](#class-and-struct)
- [Protocol](#protocol)
- [Closure](#closure)
- [AnyObject and Any](#anyobject-and-any)
- [Extension](#extension)
- [Generic](#generic)

### Application Lifecycle

This is for Cocoa Mac app

NSApplicationMain() makes NSApplication instance. ( create a UIApplication ) (applicationDidFinishLaunching)
NSApplicationMain() gets info from Info.plist about XIB
NSApplication instance handles main loop
App-level events are handled by delegation

### import

Swift language is pretty small, with some basic data types: Int, Dictionary, etc. but no Date, Video, File, WebServer, UIInterface, Button, Network, etc.

Framework, library made by Apple. Ex: UIKit framework, provide the classes needed to construct and manage an application's user interface for iOS. It provides an application object, event handling, drawing model, window, views, and controls specifically designed for a touch screen interface.

Cocoa refer all Mac development tool, sdk, kit, library, API to create mac and ios application. Cocoa framework is a container of 3 different framework: AppKit (mac os desktop app), UIKit, Foundation

`import foundation` would give me the access to the Foundation framework, so that I have lots of methods, classes available for my development.

`import UIKit`, `import cocoa`, would import `foundation` internally.

### Syntax

Semicolon to end statement is optional, but separate multiple statements on same line with `;`. Standard practice, no `;`
Case sentitive
Unlink Objective-C, swift is not a superset of C, not C-compatible
Indentation is for readibility, not for compiler.
No main method / main function
Strict type and type safe language

### logging

```swift
    // using string interpolation for concatation
    println("hello \(5 + 10) world")

    // Compile error: does not implicitly convert values
    // Double * Int. won't convert type
    println("hello \(5.8 + 10) world")
    // fix is simple, just convert Int into Double
    println("hello \(5.8 + Double(10)) world")
```

### Number

```swift
    //will generate a random number between 0 to 10, depend on the value inside `UInt32`
    let randomNumber = Int( arc4random_uniform( UInt32(10) ) )
```

### String

it is a native Unicode string.

```swift
    // escape characters
    \n     // new line
    \r      // return
    \t      // tab
    \\     // backslash
    \"      // double quote"
    \'      // single quote

    +      // String concatenation
    "\()"  // String interpolation:
    // Works with Int, Float, Bool, String. Convert inside () value to a string
    "hello \(5 + 1) times"
```

### Variable

create with `var` - it's variable / mutable
create with `let`  - it's constant / immutable

Variable type: String, Character, Int, Float, Double, Bool, etc.

- var

variable is declared and initialized as a type, type are auto inferred when value is assigned to variable. Once the type is defined, cannot be modified with a new type or assign different type of value.

var name convention uses camelCase. When define a variable, 1) given a value so swift could infer its type, 2) give a type annotation to inform its type.

- let

constant variable, types are auto inferred, values cannot be changed after initialization. Constant works just like `var`. but less memory usage. Constants are highly encouraged, use it as much as possible.

let name conversion uses `kMarginValue`, put k before the name, indicated this is a constant value.

```swift
    let temperature: Int // <= compile error, constant must have an initial value

    var temperature: Int // valid, but If you try to use the `temperature` value, it will get a compiler error cause it is not initialized.

    var temperature: Int? // valid, Using optional. see `### Optionals`. If retrieve the value now, it is `nil`
```

### Array

Arrays could store multiple values of the same type. Can contain the String, Number, or mix. Can retrieve the array values by its index.

zero index based
typed: need to create with specific type. cannot mix and match types. (type safe)
mutable when created with `var`, can be changed. immutable with `let` will be constant.

```swift
    // 1) init with a value, type inferred, creates an array of integers
    var scores = [2,3,5]
    // 2) type annotation without initialization
    var flavor: [String]

    // ADD: elements
    var scores += [9]          // same thing, this is recommended
    var scores += [7,8,9]    // add multiple values to an array
    var scores.append(9)    // 9 is added to array scores at the end

    // ADD: at the specific position
    // `atIndex` must be written as named paramter
    flavors.insert("Coconut", atIndex: 0)

    // GET: retrieve values
    scores[2]   // return 5, 3rd element of array
    scores[0...2]  // first three elements of array scores. c is integer array
    (X) scores[0..2]  // won't work due to invalid operator

    // SET values
    scores[0] = 20         // set first element of array
    scores[0...2] = [7,6,3]  // change values of first three elements in array
    scores[0...2] = [7]   // will omit the index 1 and 2, the old index 3 would become index 1
    (X) scores[0..2] = [7,6]  // won't work due to invalid operator

    // Delete: removing items
    flavors.removeLast()
    flavors.removeAtIndex(3)
    // keepCapacity: want to keep array length in memory or not
    flavors.removeAll(keepCapacity: false)

    // Counting array items
    println("there are \(scores.count) items")  // count property
    if scores.isEmpty { }   // check array.count is 0

    scores.count    // return the number of array length

    // iterate over array items
    for each-item in daysInMonth { }    // do not care of index
```

### Dictionary ( AKA Associative Array, Map, Hashtable )

Like an array, they both described using brackets [], made by a collection of key, value pair. Swift is a type safe language, Dictionary need to have two types, all key have same type, all value have same type. But dictionary does not have an `append` method.

Key is the way to retrieve data. Key is unique, case sentitive, in any order, but can have duplicated values. If key defined is not existed in the dictionary, it will return `nil`.

```swift
    // way 1: define a dictionary with predefined value
    var friends = [ "john": 30, "ann": 38, "steve": 26 ]

    // Define a dictionary without its contents. Defined type of key and value
    // way 2
    var friends: [String: Int]
    // way 3
    var friends:Dictionary<String,Int>

    // Add | Update:  elements
    friends["hugo"] = 32   // add
    friends["john"] = 44    // update
    // If no match, add a new key/value pair, return `nil`
    // if match, update key/value pair, return key old "value"
    friends.updateValue(50, forKey: "hugo" )

    // Get: key's value
    friends["john"]    // return an optional value, need to unwrap the value using !

    // Delete: entire key/value pair, not remove the value
    friends["hugo"] = nil    // return nil
    friends.removeValueForKey("hugo")  // return this key's value

    // Get the length of the dictionary
    friends.count

    // Iterate over dictionary items
    for (key, value) in friends {

    }
```

### Tuple ( like Javascript Object )

It is a collection of objects or variables in the different types (aggregating different types), gather in the single compound together identified by the tuple's name. A quick and easy way to group values together, then pass them as one parameter or a single compound value. even mix and match types.

```swift
    var human = ( name: "john", sex: "male", age: 25, height: 172)
    var tupleEx = ( "string", 20, true )

    // Get: its value by its index or its name. dotSyntax to retrieve value
    human.3   // return height
    human.name  // return name
```

### Operators

Swift would need balanced whitespace on both side of the operators. Ex: `num   +=   50`, >2 whitespaces on each side, or none whitespace, they are all fine. but unbalanced whitespace would generate a compiler error. ex: `num+= 50`. `++`, `--` only affect a single value, they do not follow this rule.

Overflow checking: Swift does not allow values to overflow. Numeric value cannot overflow by default. If needed, overflow operators are available:   &+   &-   &*   &/   &%

```swift
    =                      // assignment operator
    +, -, *, /           // Arithemetic operators

    %                      // Remainder operator
    // in Swift, it will work on Float number, and negative number
    var a = 10 % 7   // a = 3, remainder of 10/7
    var b = 15.3 % 2.5  // a = 0.3

    ++, --              // Increment/decrement operators, one unit at the time
    // PostFix
    score++  // addition won't evaluate. return the prior value, then increment
    score--
    // PreFix
    ++score // addition done increment before it return, return the new value.
    --score

    +=, -=              // Compound assignment operators
    var a = 5
    a += 10    // a = a + 10
    a -= 3       // a = a - 3

    <, >, <=, >=     // Comparision operators

    !, &&, ||              // Logical operators: not, and, or

    ==,  !=               // Equality and Identity
    // With objects, can also check identity (the same object). won't work on structure
    ===   // identical to
    !==    // not identical to

    .., ...                  // Range operators:
    ..     // half-open range operator
    ...    // closed range operator
    0..8   //half closed range, 0 to 7 without 8
    1...5  // closed range, 1 to 5 included 5

    (? :)                   // Ternary conditional operators
    var a = (isFull ? 50 : 10)  //choose based on condition

    ??                      // Nil coalescing operator
    // may have a value or nil, provide default value if optionalValue is nil
    optionalValue ?? defaultValue
    // usage example
    var personalSite: String?
    let defaultSite = "http://google.com"

    // without using Nil coalescing operator,
    var website: String
    if personalSite != nil {
        // because personalSite is an optional, it has to be unwrapped to use its value
        website = personalSite!
    } else {
        website = defaultSite
    }

    // by using Nil coalescing operator, we could simplify below
    // if personalSite has value, it will force to unwrap and return
    var website = personalSite ?? defaultSite
```

### Optionals

Describe sometimes have a value, sometimes are not. In short, my variable (or parameter) can either contain an object of type X, or nothing (in Swift, nothing is `nil`), let user and compiler know not to make assumptions. By existing, they allow the non-optional variant to exist. In other words, they allow you to formally express “no, really, this will always be type X”.

Preventing trouble with `nil`. `nil` is indicated variable/constant has no defined value, different from 0 or empty string. Be default, variable/constant is not allowed to have `nil` value, but optionals allow for `nil` value.

In Swift, variable/constant must be initialized before use. It does not default Int value to 0 or String to empty string. It has to choose supporting `nil` value on each variable basis.

?  make an optional, variable could be `nil`
!  mean that we always need to give it a value. after set a value, never gonna set it to `nil`. always want it to show on screen

```swift
    // standard integer variable
    // If you try to use the `temperature` value, it will get a compiler error. it is not initialized.
    var temperature : Int

    // Example 1. variable could be `nil`. Unwrap the value before usage.
    // Do not want to give a default value, want to know the exact state of this variable
    // Will be `Int` or may have no value at all, not 0, "", anything but a `nil`.
    // Use optional, this var could either `nil` or an valid Integer
    var temperature: Int?   // return `nil`

    // Temperature type is not `Int`, is an optional `Int`. The text would be wrapped with "Optional()". Here is "The temperature is Optional(73) degrees". To fix, we need to unwrap the optional value, after check `nil`, I am positive it has a value, do **forced unwrapping** via `temperature!`. Only do this, when we are sure that we have a valid value for this variable. If the variable is `nil`, you will get a RunTime error
    if temperature != nil {
        println("The temperature is \(temperature!) degrees")
    }

    // Example 2. variable is never going to be `nil`
    // temerature is an optional Int, forced unwrapped value, no `temperature!` needed
    var temperature: Int!   // return `nil`
    if temperature != nil {
      println("The temperature is \(temperature) degrees")
    }

    // Example 3: Combine those two steps (check `nil` value and unwrap in one), called Optional Binding
    var states = [ "AZ": "Arizona", "CA": "California" ]

    // `if let constantName`, if key matched, constant will have a value, if not found, go to else part
    // doing this way, you do not need to do the **force unwrapping** the result
    if let fullname = states["NV"] {
        // the constant "fullname" exists, with a value
        println("The state is \(fullname)")
    } else {
        // the constant "fullname" does not exist here
        println("No details found")
    }

    // Usage case 1
    // `a` can only have integer values
    // `a = nil` will get a compiler error. Cannot do Type Convert
    var a:Int = 3
    // `a` can have an integer value but can also be nil
    // `a = nil` is valid
    var a:Int? = 3

    // case 2, when assign constant var, it could be `nil` in the future, otherwise, will break the program
    var myName: String?   // variable myName is properly defined as `nil` value
    var ageInput: String = "john"
    let myAge: Int? = ageInput.toInt()  // `nil` returned, without the optional, it will output an error
```

### Enumeration

Enum hold some meaningful or a specific range of possible data. It could extend store internal value, properties, and methods to extend its functionalities.

Enum heavily used in Apple frameworks, whenever you see ".Something" values, ex: `gender = .Female`. That means this *var* must be typed to some kind of enumerations. Hover over and option click to see what they are.

```swift
    // trying to define AirLine Seat Preference: window, middle, aisle.

    // senario 1: Int as 0, 1, 2.  1) need to remember it, 2) could change to other Int value, there are >730 millions options
    // senario 2: String. Use "windows", etc. could change to "banana" or anything String

    // senario solution: emum hold specific range of data
    // in this case, **SeatPreference** is the new data type, not a new variable
    // I should be able to create *var* and constant of **SeatPreference** enum
    // inside block, use any words that meaningful to you. define with `case`
    // each case is member values, no max number of case
    // each case is writing with Capital case of word
    enum SeatPreference {
        // Way 1, list them as individual case
        case Middle
        case Aisle
        case Window
        case NoPreference

        // way 2, comma separated list
        // case Middle, Aisle, Window, NoPreference
    }

    // usage 1
    var jenPrefers: SeatPreference
    jenPrefers = SeatPreference.Aisle

    // usage 2. short hand, already typed as SeatPreference
    var jenPrefers: SeatPreference
    jenPrefers = .Aisle

    // usage 3 type inferred, all in one line
    let royPrefers = SeatPreference.Aisle

    // have to assign it to a constant/variable, cannot evaluate as `SeatPreference.Aisle`
    switch royPrefers {
        case .Window:
            ...
        case .Aisle:
            ...
        default:
            ...
    }
```

### Loop

Repeating actions. syntax:

1. `for initializer; condition; increment`
2. `for eachItem in collection`    ex: for ind in 1...100 { }
3. `while condition { }`
4. `do { } while condition`

```swift
    for var idx=0; idx < 30; idx++ {
        // will repeat 30 times of this code
    }
    // same above
    for var idx in 0..30 {  }

    // Iterate through arrays, cannot access its index
    for value in someArray {  }

    // Make it enumerate now, access to index and value of the array
    for (index, value) in enumerate(someArray) { }

    // index would be the dictionary key, value would be the dictionary value
    for (index, value) in someDictionary {  }

    // index is the dictionary index, value would contain the key/value pair. ex: "name": "ma"
    // can access the key `value.0`, access the value `value.1`
    for (index, value) in enumerate(someDictionary) {  }

    // executed until the condition is true
    // if condition is false, then statement are never executed
    while brand == "honda" {
        // statements to execute
    }

    // executed at least once if the contion is false
    do {
        // statement to execute
    } while brand == "honda"
```
Tuple items are not all required to have the same type, do not know what type each should have, cannot determine the number of elements in a tuple at runtime. Here is an alternative way to iterate a Tuple via Generics.

```swift
    // iterate tuple or other types of collection
    func iterate<C,R>(t:C, block:(String,Any)->R) {
        let mirror = reflect(t)
        for i in 0..<mirror.count {
            block(mirror[i].0, mirror[i].1.value)
        }
    }

    // usage
    let tuple = ((false, true), 42, 42.195, "42.195km")

    iterate(tuple) { println("\($0) => \($1)") }  // log: .0 => (false, true), .1 => 42, ....
    iterate(tuple.0){ println("\($0) => \($1)")} // log: .0 => false, .1 => true
    // Not a tuple, so nothing happnes, reflect(it).count is 0
    iterate(tuple.0.0) { println("\($0) => \($1)") }  // log nothing

    // iterate an array
    iterate([0,1]) { println("\($0) => \($1)") }   // log: [0] => 0, [1] => 1
    // iterate a dictionary
    iterate(["zero":0,"one":1]) { println("\($0) => \($1)") }  // log: [0] => (zero, 0), [1] => (one, 1)
```

### if and switch

`if` parenthese is optional, but curly braces is required around each code block

`switch` must be exhaustive. need to make sure all possible values need to be handled. or `default`. it could use ranges of values for case. ex: `case 0...3:`, `case 4..6:`. No implicit fallthrough, code required in all cases.

fallthrough won't work at Swift, because it needs `break` statement at last. it won't work. but in javascript, it works like, `case 1: case 2: ... case 3: ... //statement   break;`

```swift
    if distance <= 10 {
    } else if distanc > 10 && distance <= 20 {
    } else {
    }
```

```swift
    // simple switch case
    switch brand {
        case "honda" :
            // statement. no break needed
        default :
            // statement
            break  // optional, explicitly end this otherwise empty base
    }

    // switch with tuples
    var d = ( name: "sam", age: 10, isFemale: true )
    // 2nd case would be true here
    switch d {
        case ("sam", 9, true ) :
          println("first case is true")
        case (_, 10, _):
          println("ingore the first and third case")  // called
        default:
          println("default case occur")
    }
```

### function

defined by `func` keyword, followed with function name with params(0, 1, or more). executes statements in the body.  1) no parameters are passed, 2) no values are returned, 3) multiple values could be returned as tuples.

By default, parameters are constants, not a variable. When you try to change the param value, will get compile error. If need to change param value, create a new variable to map the constant param, then change the new variable value.

Function could have the same name as long as they take different parameters. If they have same param, program will throw an error.

- When to add `argument label` in a call?

1) when using default parameter value
2) when using named parameter

```swift
    // a function that takes no parameters and return nothing
    func myFunction () { }

    // function return nothing explicitly
    func myFunction () -> () {  }
```

```swift
    // func syntax
    func fnName( name:type, name:type ) -> returnType {
      return matchReturnType
    }

    // using default param values
    func myFunction ( name: String = "John Doe" ) {
      println("hello, \(name)")
    }
    myFunction()   // Valid - use default value
    myFunction("Jane")  // Error - Missing argument label in a call
    myFunction(name: "Jane")  // Valid - provide named argument

    // using named params
    func add(a: Int = 10, b: Int = 50) {
      println("Result is \(a + b)")
    }
    add(a: 5)             // valid, a is 5, b is 50
    add(b: 10)           // valid, a is 10, b is 10
    add(a: 20, b: 20) // valid, a is 20, b is 20
    add(10)               // Error: Missing argument label 'a' in a call
    add(20, b: 20)     // Error: Missing argument label 'a' in a call
    add(a: 20, 20)     // Error: Missing argument label 'b' in a call
    add(20, 20)         // Error: Missing argument labesl 'a:b' in a call

    func add(a: Int, b: Int) {
      println("Result is \(a + b)")
    }
    add(a: 10)            // Error: missing argument for parameter #2 in a call
    add(b: 10)            // Error: missing argument for parameter #2 in a call
    add(a: 20, b: 20)  // Error: extra argument labels in a call
    add(10)                // Error: Type (Int, Int) does not conform to protocol 'IntegerLiteralConvertible'
    add(a: 20, 20)      // Error: extra argument labels in a call
    add(10, 20)          // valid

    func add(a: Int = 30, b: Int) {
      println("Result is \(a + b)")
    }
    add(a: 10)            // Error: missing argument for parameter #2 in a call
    add(b: 10)            // Error: missing argument for parameter #2 in a call
    add(a: 20, b: 20)  // Error: extra argument label 'b' in a call
    add(10)                // valid, a is 30, b is 10
    add(a: 20, 20)      // valid, a is 20, b is 20
    add(10, 20)          // Error: Missing argument label 'a' in a call

    func add(a: Int, b: Int = 30) {
      println("Result is \(a + b)")
    }
    add(a: 10)            // Error - Extra argument label 'a' in a call
    add(b: 10)            // Error: missing argument for parameter #1 in a call
    add(a: 20, b: 20)  // Error: extra argument label 'a' in a call
    add(10)                // valid, a is 10, b is 30
    add(a: 20, 20)      // Error: incorrect argument labels in call
    add(20, b: 20)      // valid, a is 20, b is 20
    add(20, 20)          // Error: missing argument label 'b' in a call

    // one param Int passed, one value of type String is returned. `a` is the internal param
    // when use return statement, need to define the type for the return value
    func doSth (a: Int) -> String {
        var msg = "function was passed \(a)"
        println("function done")
        return msg
    }

    // Function could return a tuple
    // usage:  let (areaValue, tint) = areaAndColor(x, y)  // dexomposing while calling
    func areaAndColor (x:Int, y:Int) -> (area:Int, tint:String) {
        let area = x*y
        // switch area  { ....let tint = "red"..... }
        return ( area, tint )
    }

    // this fn definition uses external params, add its name to the params. `height` used to pass into the params, `x` used inside fn
    func area ( height x:Float, width y:Float ) {
        println("Area is \(x*y)")
    }
    // need to pass the params in order when they defined
    area(height: 3.2, width: 8.2)
```

`@IBAction func` indicate this is a pointer, this function is referenced or connected to the storyboard element.


### Class and Struct

class is used for subclass, or super class/child class pattern, struct is not. Both can create an instance out of them.

- Same

define properties to store values ( properties and methods work exactly the same )
define methods to provide functionality
define subscripts to provide access to their values using subscript syntax
define initalizers to setup their initial state
be extended to expand their functionality beyond a default implementation
conform to protocols to provide standard
syntax between `class` and `struct` are almost identical
caller are almost identical

- difference: classes have additional capabilities that structures(struct) do not:

inheritance enables one class to inherit the characteristics of another
type casting enables you to check and interpret the type of a class intance at runtime
deinitializers enable an instance of a class to free up any resources it has assigned
reference counting allows more than one reference to a class instance

in the struct, could not access its defined properties.
In the class, could access the class properties via `self` or without `self` it just works.

- Other different

When caller struct instance, Swift will generate a member wise initailizer for you, just a hint map to every property in this struct. When create a new Struct instance, even without an `init` method, it still prompt with all property that you could define when init. Dev could provide a basic data container, convinent helper. Struct cannot do inheritance, cannot add `deinit` method.

* Structure are value types ( pass by value )

Intended for simpler situations, data structure types. Do not do well with Object, Simple Int, Bool, String works fine. Need to difference between pass by value or reference.

When assigned to another variable, or passed to a function, a structure's value is copied. ( duplicated ). Original value won't be changed or modified. Simply get a new value each time. exactly same code with `struct`, we won't change property original value

* Classes are reference types ( pass by reference )

When assigned to another variable, or passed to a function, a reference to the original object is passed. Original property value would be changed, modified. exactly same code with `class`, we will change property original value

#### Structs ( Structure )

String, Float, Int, Array, Dictionary, etc all implement as `struct` struction in Swift. it is very powerful. It has almost everything that class can do like computed property, lazy variable etc.

```swift
    import Foundation
    import UIKit

    struct Tiger {
      // age, name etc are the properties of Tiger
      var age = 0
      var name = ""
      var breed = ""
      var image = UIImage(CGImage:nil)

      // custom initializer with keyword init, or default values
      // usage:  var tiger = Tiger(aAge: 5, aName: "matt")
      init(aAge: Int, aName: String) {
        age: aAge
        name: aName
      }

      func chuff () {
        println("chuff")
      }
    }
```

```swift
    // comsumer of the Tiger structs
    class ViewController: UIViewController {

      var myTigers:[Tiger] = []

      override func viewDidLoad() {
        super.viewDidLoad()

        var myTiger = Tiger()
        myTiger.name = "matt"
        myTiger.age = 20
        myTiger.breed = "bengal"
        myTiger.image = UIImage(named: "BengalTiger.jpg")

        var yourTiger = Tiger()
        yourTiger.name = "aaron"
        yourTiger.breed = "indo chinese"
        yourTiger.age = 5
        yourTiger.image = UIImage(named: "MalayanTiger.jpg")

        yourTiger.chuff()

        myTigers += [myTiger]
      }
    }
```

#### class

Class is not inherited from an universal default class. Not like any other language. If you define a class like `class Player {}`, it is not secretly inherited from anything, itself is a base class.

if a function in *super class*, *sub class* could override *super class* function via `override`

`super` keyword. it will include the functionality of the *super class* logic, then add *sub class* addtional function logic. It works in `override func` or any `func` with super call its parent class methods.

`self` is what Swift use for itself. like javascript use `this`
`final func` or `final class` final keyword will make the method/class not overridable. No sub class could override it.
`class var interestRate: Float { return 2.0 }` would create a class level property, shared by all the instance. use ClassName to access it.


Access level in Swift: 3 kind:  private, internal ( default ), public. To use it, just add one of the keyword in front of variable or class.

```swift

    // Only accessible from within the same source code file
    private   // <= keyword `private`

    // Default, accessible across code files, but must be within the same compiled module
    // can be multiple source code along compiled into the same module. typical: the same project
    // if you not use any keyword like `private`, `public`, `internal`, will be prepend with `internal`
    // internal property, internal class, internal methods
    internal   // <= keyword `internal`

    // accessible from any module that has imported yours
    // can be called from outside of your own compiled module, any other modules import yours
    // like framework which could be reused in other projects
    public   // <= keyword `public`

    example:

    public class Player {
        // properties - no modifier, will default to `internal`
        // Stored property, storing data, each instance of this class
        // instance level property. they would have each individual copy of this property
        var name: String
        var score: Int

        // public methods
        public func description() {
            // ....
        }

        //private methods
        private func calculateBonus() {
            // ...
        }
    }
    // cannot mark a single property or method `public`, the class need to be `public` too.
```

```swift
    // syntax
    // Property is simply a variable or constant belong to the class, no property keyword needed
    // methods is simply a function belongs to the class
    class Player {
        // properties
        var name: String  // <= this is a variable property
        let  score: Int       // <= this is a constant property

        func description() {
            println("player \(name) has a score of \(score)")
        }
    }

    If I keep the code above, will get a warning ( this class cannot be instantiated). The reason is Swift focus on all the value always have a valid state. Two ways to fix it,
    Way 1, provide a default value for the property.
    Way 2, provide `init` initialize method for this class, when this class instaniated, it immediately is a valid state

    // Way 1
    class Player {
        // properties
        var name: String = "John Doe"
        var  score: Int = 0

        func description() {
            println("player \(name) has a score of \(score)")
        }
    }

    // To instantiates a new Player object. `ClassName()` create an instance, no `new`, or any keyword needed
    // can use **dotSyntax** to access its property and methods
    var jake = Player()
    jake.name = "Jake"
    jake.score = 1000
    println( jake.description() )  // "player Jake has a score of 1000"

    // Way 2, initialize method or Constructor
    class Player {
        // properties
        var name: String = "John Doe"
        var  score: Int = 0

        func description() {
            println("player \(name) has a score of \(score)")
        }

        final func noOverride() {
            // this method could not be overrided by its sub class
        }

        // `init` is a reserved keyword, does not need `func` before it
        // default initializer, take no parameters
        init() {
            name = "John Doe"
            score = 0
        }

        // optional, have multiple initializer method
        // initializer with parameter. By default, use `name` as parameter will conflict with property `name`
        // Way 1: rename the parameter to something else
        init( aName: String ) {
            name = aName
            score = 0
        }
        // Way 2: better way. explict use `self.name` to make it clearly to use property, temporary variable
        init( name: String ) {
            self.name = name
            self.score = 0
        }

        // automatically called when the object reach the end of its life cycle
        // only one `deinit`, no parameter, no `()`, no values at all.
        // like database connection, then close the connection. most of time, do not need it.
        // typically, write your own methods to do the cleanup, then call it when you need it.
        deinit {
            // any necessary cleanup code
        }
    }

    // caller 1:  use default init
    var jake = Player()  // <= `init` method called
    println( jake.description() )  // "player John Doe has a score of 0"

    // caller 2: use parameter init
    // need to provide the parameter name. `name: "Fred"`. Otherwise, won't work
    var fred = Player( name: "Fred" )
```

```swift
    // in Swift, called `super class` and `sub class`
    // `:` means   is type of. GoldPlayer is type of Player

    //Using inheritance in Swift
    // className: superClassName, where it inherited from
    // `override` used to override an function behavior
    // `super` used for calling the super class's method
    class GoldPlayer: Player {
        // inherit all properties and methods from Player

        // add this property will create problem, because our Super Class's init method is not good any more due to more
        // unstable property value state. Fix 1, give an default value, Fix 2, give an `init` method. use `override func` to
        // fix it, plus calling `super.init()` inside override function
        var memberLevel: String

        // except `init` method, other custom method in super class, Dev could choose to override
        // super class behavior, or extend its super class behaviors
        overrid init() {
            super.init()
            memberLevel = "Gold"
        }

        // provide additional methods
        func newMethod() {
            // ...
        }

        // to override a method defined in a superclass
        override func description() {
            println("*** Glod Status ***")
            super.description()  // call method in superclass
            println("*** Glod Status ****")
        }
    }
```

calling functions VS calling methods

```Swift
    // calling functions
    func multipleParams ( first: Int, second: Int ) {
        println("First times second is \(first * second)")
    }
    // function call
    multipleParams(2, 4)


    // calling class methods
    class Example {
        func multipleParams ( first: Int, second: Int ) {
            println("First times second is \(first * second)")
        }
    }

    var myObject = Example()
    myObject.multipleParams(2, 4)  // won't compile
    myObject.multipleParams(2, second: 4)

    // reason: whenever a method take two or more parameters, any parameters after 2nd, 3rd, 4th, 5th, they all have to be called with named parameter. syntax: `nameOfParameter: parameter_value`.
```

```swift
    class LionSubClass: LionSuperClass {
        override func roar() {
            super.roar()  // this is optional, to include its original functionality
            // will override `roar` function in the *LionSuperClass*
        }
    }
```

Note: create class function is like regular function, but when call it, we will call on class itself, use class dot syntax to retrieve its methods.

```swift
    //class function syntax
    // usage:  Factory.createSlot()
    class Factory {
        class fun createSlot() -> String {
            return "something"
        }
    }
```

Computed property

```swift
    class Person {
        var firstName: String
        var lastName: String

        init( first: String, last: String ) {
            self.firstName = first
            self.lastName = last
        }

        // computed property
        // Way 1: long hand with optional `setter`
        var fullName: String {
            get {
                // return the computed property
                return "\(firstName) \(lastName)"
            }
            // setter is optional, only getter, would be a readonly property
            set {
                // set the computed property
                // by default, get one simple value with variable called `newValue`
                var nameArray = newValue.componentsSeparatedByString(" ")
                firstName = nameArray[0]
                lastName = nameArray[1]
            }
        }

        // Way 2: only getter with shorthand
        var fullName: String {
            // only getter method, we could omit the `get` block. readonly property
            return "\(firstName) \(lastName)"
        }
    }

    var matt = Person(first: "matt", last: "ma")

    // without the setter method, calling setter code will fail
    matt.fullName = "kelly gao"
```

Property observer. By adding a new block, it won't change the way that we are using this property.
`willSet`, `didSet`, they are property observers. They are called automatically every time when this property changes
`willSet` will call right before this property about to change
`didSet` will call right after this property changed
They could add together, or just one, or none. All optional.
`newValue`, `oldValue` type would be based on the variable type

Note: cannot add property observer to `lazy` property

```swift
class Person {
    var name: String = "matt ma" {
        willSet {
            // Will get an inplicit parameter `newValue`
            println("about to change name to \(newValue)")
        }
        didSet {
            // Will get an inplicit parameter `oldValue`
            println("about to change name to \(oldValue)")
        }

        // Way 2: change `newValue` parameter to `otherParam`
        willSet (otherParam) {
            println("about to change name to \(otherParam)")
        }
    }
}

var matt = Person()
matt.name = "sam ma"
```


Class level property/method, or Type level property/method, it belongs to the class itself, instance level won't be able to change its value

```swift
    class BankAccount {
        let accountNumber: Int

        // here we want all accounts has the same interestRate, not instance level they could change it.
        // only one of them, existed only on the class. weather we have 1 millions instances or none at all

        // this is the standard syntax, but it won't work in my current version
        class var interestRate: Float = 2.0

        // alternative, use computed property to bypass the warning
        class var interestRate: Float {
            return 2.0
        }

        // Note: type level methods CANNOT access instance data at all
        // because it could be called without instaniated an instance
        // only access class level properties
        class func example() {
            // ....
        }
    }

    // @usage. Use the class itself to access type level property
    // it works even no instance created at all.
    BankAccount.interestRate    // 2.0
    BankAccount.example()
```


Lazy loading property or methods. Swift won't initialize this property until someone access for it.
with keyword `lazy` in front of `var`, it won't init the `bonus` value by calling the method, bonus will have a `nil` value
without keyword `lazy`, compiler will fetch `someComplicatedMethod` return its value to bonus. bonus will have a value

unlink optional, i do not need to worry about this value to be `nil`, like checking its value, etc. because whenever I want to access its value, Swift would init the method, return the value. So lazy variable would always have a value.

Alway variable, `lazy var` is required, could not be `lazy let`

```swift
    class Player {
        var name: String = "matt"
        lazy var bonus = someComplicatedMethod()
    }
```

### Protocol

Way to standardize the behavior of across class without worrying about Inherience, any formal relationship.

Defining Protocols

Ex: Clean my apt:   must: 1 clean Floors, 2. vacuum, 3. empty trash cans, 4. report broken lightbulbs
Does not matter who to do it, as long as someone agree to do it, perform those tasks.

In Swift, a list of methods that you want some class to perform, or property you want the class to have. Do not say how this method should be done. When you write a protocol, does not have any implementation code. No limitation on what class can do, no inherience, simply a formal list any volenteer class want to support. So this protocol would provide a nessessary list of methods and properties. `name`, `parameters`, `return type` would be required. No curly braces or any implementation code, would get an error

Protocol property always use `var`, never use `let`

You could have one or more class to implement any protocol

Benefits of using protocol: big deal in apple development. In apple docs, there are dozen of Protocol references, helper or utility for apple application.

```swift
    // those are Swift equal,
    // this is a simple defination of a protocol
    protocol Cleaner {
        // method signatures
        // whether func need a parameter, or return anything
        func cleanFloors()
        func vacuum()
        func emtpyTrash() -> Bool

        // properties
        // require to say this property could be readable or settable
        var brokenBulbs: Bool { get set }
    }
```

```swift
    import UIKit
    protocol ExampleProtocol {
        func simpleMethod() -> Bool
        var simpleProperty: Int { get }
    }

    // Note: Whenever you add a Protocol, you get a compiler error, does not conform to
    // protocol, you need to add property and methods in the list of protocol

    // you could provide anything else you need this class to do, but need to fulfill what protocol promise
    // that you made.

    // Usage 1, without inherit from any super class
    class MyClass : ExampleProtocol { }

    // Usage 2, inherit from one super class
    // Only one super class can be inherited
    // use comma separated list for multiple protocols
    class MyClass: SuperClass, ExampleProtocol {
        // just a simple method needed, no any special keyword needed
        func simpleMethod() -> Bool {
            // do some work...
            return true
        }

        var simpleProperty: Int {
            return 55
        }
    }
```

### Closure

closure is just a block of code that can also capture external variables. { } is a simple closure. Functions declared with the func keyword are just examples of named closures. It is even perfectly legal to declare functions inside of other functions in Swift.
Closures group code into a self-contained, reusable unit
Functions are a type of closure, closure is like anonymous function

```swift
    // A simple closure
    {
        println("This is a simple closure.")
    }

    // with the code above, it will throw an compile error: "Braced block of statements is an unused closure". To fix:

    let myClosure =  {
        println("This is a simple closure.")
    }

    func performFiveTimes ( closure: ()->() ) {
        for i in 1...5 {
            closure()
        }
    }

    // this will run `myClosure` code 5 times.
    // @usage 1
    performFiveTimes(myClosure)

    // @usage 2
    // passing a closure into a function
    performFiveTimes( {
        println("This is a simple closure.")
    } )

    // explictly match the no parameter and no return value
    performFiveTimes( { () -> () in
        println("This is a simple closure.")
    } )
```

```swift
    // defining closure input/output ( param and return value )
    // in closure, takes no parameters and return nothing syntax
    // keyword `in` is here to separate the closure function and parameter return
    { () -> () in
        println("this is a simple closure")
    }

    // using closures in Swift functions
    // sorted is a built-in function in Swift
    // sorted( array_to_sort, closure_to_compare )

    let unsortedArray = [ 10, 3, 5, 1, 9, 4, 6, 2 ]

    // idea of closure look like below
    { ( first: Int, second: Int ) -> Bool in
        if ( first < second ) {
            return true
        } else {
            return false
        }
    }

    let sortedArray = sorted( unsortedArray,
        {( first: Int, second: Int ) -> Bool in
            return first < second
        })

```

If you pass a closure as the last argument of a function, you can use the special trailing closure syntax and move the closure outside of the function call. You can see this in the UIView.animateWithDuration() call.

```swift
    // format 1, valid
    UIView.animateWithDuration(1.4, animations: {
        view.layer.opacity = 1
    })
    // format 2, both valid
    UIView.animateWithDuration(1.4) {
      view.layer.opacity = 1
    }
```

### AnyObject and Any

There are two keywords used to deal with inexact or non-specific data. These are types so that we could create a new variable with this type.

AnyObject:  need to be an Object, does not matter what object, as long as it is an object
Any:   could be anything, even tuple and closures

An variable with those two types, its value could change to any other types.

Avoid the usage of AnyObject, Any as much as possible.

They are existed because mapping to Objective-C id. You should use `is`, `as`, `as?` to check and downcast types. Do not leave any variable in `Any` or `AnyObject` type, it may cause any run time error. Alway check the AnyObject type, call methods based on types.

```swift
    var someObject: AnyObject
    var something: Any

    var arrayOfObjects: [AnyObject]
    var arrayOfAnything: [Any]

    // String could be used, as long as you import UIKit, Foundation, Cocoa, String is defined in NSString, it is an object
    // Dictionary, Bool, all works fine here. Except tuple and closure won't work
    var someObject: AnyObject = "this is a message"
```

### Extension

Allow to add new methods or properties to the existing type without sub class the current type.
These Extensions can add property, method, initializer to the existing type
In extensions, we do not do `override`, `super`, cannot add `deinit`
It is a light way or easy way to add methods to the existing type. do not have the source code to that type.

Add methods and properties to existing types
does not require source code for the type
can be added to classes, structures and enumerations

```swift
    import UIKit
    var message = "Some testing message"

    // create an extension to `String` type.
    // add a new method to the current `String`
    extension String {
        func reverseWords() -> String {
            // use `self` to refer the current string instance
            let wordsArray = self.componentsSeparatedByString(" ")
            let reversedArray = wordsArray.reverse()
            ket newString = ""
            for eachWord in reversedArray {
                newString += eachWord + " "
            }
            return newString
        }
    }

    // Usage. All String variable would have this method
    message.reverseWords()
```

### Generic

Type: in Swift, every variable is strongly typed, compile-time checking, overflow checking, etc. AnyObject and Any type give us dynamic, can be exchanged to other type.

Generic gives us both, benefit of type safe and flexibility. Make the Strong type through out the language

For example, Swift write a generic data structure, not strict to any data type. You could save String in one array var, number in one array var, when you retrieve one index of String value, it could access all String methods.

```swift
    import UIKit

    let myInts = [1,2,3,4,5]
    let myStrings = ["red", "green", "blue"]

    func displayArray( theArray : [Int] ) {
        for eachitem in theArray {
            print( eachitem )
        }
    }

    displayArray( myInts )   // <= it works fine
    displayArray( myStrings )   // <= won't work, since theArray is typed  `Int`

    // To fix this issue
    // in this case, `T` is the Generic type, it could be anything
    // as long as it matches everywhere inside the function
    // better alternative than using AnyObject,
    // Benefit: Not only accept a type array, to keep the type info which passed in, used in our function
    func displayArray<T>( theArray : [T] ) -> T {
        for eachitem in theArray {
            print( eachitem )
        }
        // return the last element in the array, AnyObject won't work here.
        // Generic is the only solution. Because do not know what the T type is
        // if the Array of String, it will return a String, it is still type safe
        let finalElement: T = theArray[theArray.count - 1]
        return finalElement
    }

    displayArray( myInts )   // <= it works fine. return an Int
    displayArray( myStrings )   // <= it works now. return a String
```

### Type checking and casting

`is`  used to check what type the var is

`as` used to downcast the type from its super class. It has to check with `is` first, make sure to check the type, it must be the sub class of the super class to downcast

`as?` create an optional downcast, it may or may not have the value. see option 2/3 example. check its value after

```swift
    import UIKit

    let myBtn = UIButton()
    let mySlider = UISlider()
    let myTextField = UITextField()
    let myDatePicker = UIDatePicker()

    // The type of `controls` is  `UIControl`  because it is the super class of all of these
    // Swift would look at the hieachry to find the closest super class to make it type
    let controls = [ myBtn, mySlider, myTextField, myDatePicker]

    // when use loop, the `item` type is `UIControl`, if you need to make any update on UIDatePicker,
    // you need to convert its type
    for item in controls {

        //option 1: check type with `is`
        // `item` is still typed as `UIControl`. cannot access any DataPicker methods or property because
        // item is typed as `UIControl`, not a `UIDatePicker`
        if item is UIDatePicker {
            println("we have a UIDatePicker")
            // downcast with `as`
            let picker = item as UIDatePicker
            picker.datePickerMode = UIDatePickerMode.CountDownTimer
        }

        //option 2: downcast first, then check if it work
        // `picker` here is an optional, its type is an optional UIDatePicker
        // it may or may not have the value
        let picker = item as? UIDatePicker
        // then check if it worked, and unwrap the optional
        if picker != nil {
            // have to unwrap the value to use the optional UIDatePicker
            picker!.datePickerMode = UIDatePickerMode.CountDownTimer
        }

        // Option 3 - combine the optional downcast inside the if statement
        // only execute the true block only when downcast works and picker has a value
        // No unwrapping step is needed or check nil step is needed
        if let picker = item as? UIDatePicker {
            picker.datePickerMode = UIDatePickerMode.CountDownTimer
        }
    }

```

### others

1 Type innotation

```swift
    var num:Int = 0
    var decimal:Float = -108
```

Type alias

redefined the class on the fly.

```swift
    typealias WholeNumber = Int

    var x:WholeNumber = 49
```

```swift
    // comma will break the app, but numeric literal won't break
    // properly display the value:  1,000,000,000,000
    var largeNumber = 1_000_000_000_000
```

String intropolation

```swift
    // String into Int
    "9".toInt()     // 9
    "9.0".toInt()  // nil
    // it could return a Number or nil, for safety, always wrap into an optional
    varible!

    // String into Double
    Double(("3.9585" as NSString).doubleValue)  //3.9585
```
