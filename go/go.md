# Go

To setup [Go IDE in Sublime](http://eefret.me/making-sublime-your-golang-ide/)http://www.wolfe.id.au/2015/03/05/using-sublime-text-for-go-development/

## Resource

1. [Effective Go](https://golang.org/doc/effective_go.html)
2. [Resources for new Go programmers](http://dave.cheney.net/resources-for-new-go-programmers)
3. [GoBooks](https://github.com/dariubs/GoBooks)
4. [Go Language Spec](http://golang.org/ref/spec)

## GO

To update a package from your $GOPATH, do this:

```bash
# Add a package
go get foo/bar

# Update a Dependency
go get -u foo/bar
godep update foo/bar
```

## Useful go library

1. [Godep](http://godoc.org/github.com/tools/godep)

## Setup Go Tool

Go does not have Classes. But can use User Defined Types. For example, redefine a type of int to something else, and use the new type. and go Struct can act like Class. In addition, there is no getter and setter in go. No private or public, by convention, uppercase function is public. Semicolons are optional. Curly brace must be in the same line of `func` defined, because if you do not, go compiler will add a semicolon to the end of the line.

In Go, if you defined a variable, you need to use it. If not use it, it will output an error. Cannot be compiled. If you try to ignore something, could use "_" as a variable assignment.

#### Code organization

- Workspaces

Go code must be kept inside a workspace. A workspace is a directory hierarchy with three directories at its root:

    * src     contains Go source files organized into packages (one package per directory),
    * pkg    contains package objects
    * bin     contains executable commands.

The go tool builds source packages and installs the resulting binaries to the pkg and bin directories. The src subdirectory typically contains multiple version control repositories (such as for Git or Mercurial) that track the development of one or more source packages.

A typical workspace would contain many source repositories containing many packages and commands. Most Go programmers keep all their Go source code and dependencies in a single workspace.

`export GOPATH=$HOME/go`  Could define it in the terminal

- Package

It is just like commands, except that package can be imported by other packages, it can have a package name other than main.

## Package

Every Go program is made up of packages. It is partition global namespace to modularize code. Programs start running in package `main`. Executable commands must always use package `main`.

- convention

1. Any name of a function start with uppercase, it is going to be exported, so no extra keyword is needed in the language.

2. After importing a package, you can refer to the names it exports. the package name is the same as the last element of the import path. Ex: "math/rand" package comprises files that begin with the statement package `rand`

3. A function can take zero or more arguments.
When two or more consecutive named function parameters share a type, you can omit the type from all but the last.
A function can return any number (multiple) of results.

```go
package main

import (
    "fmt"
    "math/rand"
)
// type comes after the variable name.
// add(x int, y int)  or  add(x, y int)
func add(x int, y int) int {
    return x + y, y
}

func main() {
    fmt.Println("My favorite number is", rand.Seed)
}
```


FOr storing the code, follow the go conversion, named as 1) Public Repo name  2) Company name 3) Project name

Note: The first statement in a Go source file must be

`package <name>`

name: the package's default name for imports. (All files in a package must use the same name.) No requirement that package names be unique across all packages linked into a single binary, only that the import paths (their full file names) be unique.

Go's convention is that the package name is the last element of the import path: the package imported as "crypto/rot13" should be named rot13.

## imports

Go can import from 1) Source Code  2) Local Packages  3) Remote Packages

## Types

#### Basic Types

bool, string, float32, float64, complex64, complex128 (complex number)
int, int8, int16, int32, int64 (size of int, how much integer can store)
uint, uint8, uint16, uint32, uint64, uintptr (uint pointer, large size for storing)
byte (// alias for uint8)
rune (// alias for int32  // represents a Unicode code point)

#### Other Types

Array, Slice,  Struct, Pointer, Function, Interface, Map, Channel

## Variables

`var` declares a list of variables; as in function argument lists, the type is last.
`var` can be at package or function level.
If an initializer is present, the type can be omitted; the variable will take the type of the initializer. ex: `var i, j = 1, 2`

Inside a function, `:=` short assignment statement can be used in place of a var declaration with implicit type.
Outside a function, every statement begins with a keyword (var, func, and so on) and so the := construct is not available.

Zero values: Variables declared without an explicit initial value are given their zero value. 1) 0 for numeric types,  2) false the boolean type, 3) "" (the empty string) for strings.

```go
var message string
// a, b, c are all type of int, by default, it gets value of 0
var a, b, c int = 1, 2, 3
message = "hello matt"
```

Define variable type is optional, Go will infer based on the value

```go
var message = "hello matt"
var a, b, c = 1, false, 3
```

Variable shorten form, using ":=" to assign a new variable. Can only use inside a function

```go
message := "hello matt"
a, b, c := 1, false, 3
```

## Constants

Constants are declared like variables, but with the `const` keyword. Constants can be character, string, boolean, or numeric values be at package or function level.
Go can define a constant without a type, type can be inferred. Type can depend on how that constant is being used.
Constants cannot be declared using the := syntax.

```go
const {
    PI = 3.14 // it is a numeric, its type will be defined where it is being used.
    Language = "Go"  // infer to type string
}
```

- Numeric Constants

Numeric constants are high-precision values. An untyped constant takes the type needed by its context.

## Pointers

Just a special type of variable which contain a memory address of another variable.
Pointer has a type as well. Pointer Type is the type of the variable type which pointer point to.

```go
// memory address of variable 45, 45 is the variable value.
// pointer cannot change its type. cannot cross type to other type
0x00001234  =>   45
```

- Benefit

If passing a variable (outside) to a function, function changes its variable value(inside), outside variable won't change.
If passing a pointer variable (outside) to a function, function changes its variable value(inside), memory address did not change, but the pointer value has changed as well. Pointer allow function to change variable (inside and outside)

- syntax

```go
message := "hello world"
// indicate this is a pointer to a string
// pointer simply hold a memory value
// &message: special syntax for pointer, give me the memory address of variable "message"
var greeting *string = &message
fmt.Println(message, greeting)  // output of greeting variable value:  hello world, 0x10bf0390
fmt.Println(message, *greeting) // output the value of this memory address: hello world, hello world

*greeting = "hi"
fmt.Println(message, *greeting) // update message and greeting pointer to value: hi, hi
```

## User defined types

Once you have defined a type, can add methods on it like adding methods to javascript object prototype.

```go
package main
import "fmt"
type Rocks string  // Rocks is a new type

func main() {
    var message Rocks = "Hello World"
    fmt.Println(message)  // output:  Hello World
}
```

```go
type Rocks struct {
    name string
    greeting string
}
func main() {
    var s = Rocks{"matt", "hello"}
    var d = Rocks{greeting: "hello", name: "matt"}
    fmt.Println(s.name)  // matt
    fmt.Println(s.greeting)  // hello
    var a = Rocks{}
    a.name = "matt ma"
    fmt.Println(a.name)  // matt ma
}
```

## Type conversions

The expression `T(v)` converts the value `v` to the type `T`.

```go
var i int = 42                    // or..   i := 42
var f float64 = float64(i)   // or..   f := float64(i)
var u uint = uint(f)            // or..   i := uint(f)
```

## Type inference

When declaring a variable without specifying its type (using var without a type or the := syntax), the variable's type is inferred from the value on the right hand side. When the right hand side of the declaration is typed, the new variable is of that same type.

```go
var i int
j := i // j is an int
```

But when the right hand side contains an untyped numeric constant, the new variable may be an int, float64, or complex128 depending on the precision of the constant:

```go
i := 42           // int
f := 3.142        // float64
g := 0.867 + 0.5i // complex128
```

## Functions. (`func`)

- benefits

* it is a type. Use it like any other type. can be passed around.
* multiple return values
* function literals. (closure)

```go
func Greet(message string) {
    fmt.Println(message)
}
```

return single value or multiple values. Return function must define a return type to make it work. If you define a variable, you have to use it.

```go
func SingleCreateMessage(name, greeting string) string {
    return greeting + " " + name
}
func MultiCreateMessage(name, greeting string) (string, string) {
    return greeting + " " + name, "Hey, " + name
}
func Greet(person string) {
    message := SingleCreateMessage("matt", "hello")  // hello matt

    message1, message2 := MultiCreateMessage("matt", "hello")
    //message1: hello matt    //message2: Hey, matt

    // if you defined variables, you have to use it, to bypass it, pass "_" to ignore it if you are not going to use it.
    _, message2 := CreateMessage("matt", "hello")
}
```

- Named return values

Go's return values may be named (here ex: x, y) and act just like variables. These names should be used to document the meaning of the return values.

A return statement without arguments returns the current values of the results. This is known as a "naked" return (Only used with named return values). Naked return statements should be used only in short functions. They can harm readability in longer functions.

```go
package main
import "fmt"
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return
}
func main() {
    fmt.Println(split(10))  // 4 6  are being returned even though there is no retun value there.
}
```

- Rest parameters

We will get a slice internally like an array. Used when you do not know how many parameters are going to be passed in.

```go
Rest("matt", "hello", "sth", "else")
func Rest(name string, greeting ...string) (message, alternate string) {
    length := len(greeting) // build-in function for the slice. To get the number of parameters. Return 4 in this case.
}
```

- function is a type, can be passed around

```go
// `func`(do func(string)) is part of the type definition for a function
func Greet (name string, do func(string)) {
    do(name)
}
func PrintLine(s string) {
    fmt.Println(s)
}
Greet("hello", PrintLine)
```

```go
// leave empty (), to indicated the function does not return any value. Create a type of Printer
type Printer func(string) ()

// Here, a new type has been created. used in the function parameter
// add the value for the declaration
func Greet (name string, do Printer) {
    do(name)
}
```

```go
// create a Printer function Factory, a closure
func CreatePrintFunction(custom string) Printer {
    return func(s string) {
        fmt.Println(s + custom)
    }
}
Greet("hello", CreatePrintFunction("!!!"))
```

## Branching, Conditional

#### if

```go
// syntax, no () around condition, add optional statement with semicolon
if <optional statement;> condition {
} else if {
} else {
}
```

optional statement could be some assignment/evaluation before you do the `if` condition

```go
// make an optional statement, prefix variable assignment is only executed
// when `isFormal` is true. Otherwise, prefix is never existed
if prefix := "Mr "; isFormal {
    do(prefix + message)
}
```

#### switch

similar to `if`, but allow to have more condition to check

- difference with other scripting language

* No default fall through. No `break` statement is needed
* No need an expression. No expression to be evaluated. When no expression, will evaluated to true, act like if, else.
* Cases can be expressions. Do more than match, like calculation.
* Switch on types. Special syntax

```go
func GrePrefix(name string) (prefix string) {
    switch name {
        case "Bob": prefix = "Mr "
        case "Joe": prefix = "Dr "
        default: prefix = "Dude "
    }
    return
}
```

```go
switch name {
    // if "Bob" case is matched, the value "Dr " will be used
    // because of fallthrough statement is defined
    case "Bob":
        prefix = "Mr "
        fallthrough
    case "Joe":
        prefix = "Dr "
    case "Matt", "Amy":  // multiple expression
        prefix = "Mrs "
    default:
        prefix = "Dude "
}
```

No switch expression, not switch on anything, it is going to be evaluated to true, switched on a Boolean condition, acted like if, else

```go
switch {
    // if "Bob" case is matched, the value "Dr " will be used
    // because of fallthrough statement is defined
    case name == "Bob":
        prefix = "Mr "
    case name == "Joe", name == "Matt", len(name) == 10:  //when name character length is 10
        prefix = "Dr "
    default:
        prefix = "Dude "
}
```

```go
// take a variable x, type of interface bracket, it is an empty interface. it means can be any type
func TypeSwitchTest(x interface{}) {
    // check the type of variable x, and store in a variable t, and switch an expression on t.
    switch t := x.(type) {
        case int:
            fmt.Println("int")
        case string:
            fmt.Println("string")
        default:
            fmt.Println("unknown")
    }
    return
}
```

## Loop

Only one kind of loop in Go: `for`

```go
// syntax 1
for <condition (evaluated to true or false, like while loop)> { /* block */ }
// syntax 2
for <For Clause(init; cond; post)> { /* block */ }
// syntax 3
for <Range> { /* block */ }
// syntax 4: leave condition empty, always evaluated to true. Create an infinite loop
for  { /* block */ }
```

```go
for i := 0; i < 4; i++ {
    ...
}

i := 0   // like using a while loop
for i < 4 {
    ...
    i++
}

i := 0   // It will break out the infinite loop
for {
    ...
    if i % 2 == 0 {
        i++
        continue  // works like javascript loop continue
    }
    if i > 4 {
        break  // works like javascript loop break
    }
    i++
}
```

```go
// Ranges: types of Ranges
// Array or slice, String, Map, Channel
for index, value := range someSlice {  // go through this slice/collection
    // index: item index in the collection,  value: value of each item
    // if not using index here, need to give "_". ex:  `for _, value := range someSlice {}
}
```

## Maps

#### What is a map?

Maps keys to values. A key maps to a specific value. Like some scripting language dictionary (word => definition).
Each key in the map is unique.

* Keys have to have equality operator defined
* Maps are reference types. It works like pointer. Actual reference passed in, not a copy. original is being override.
* Not thread safe! If your app is concurrency, better avoid using maps.

#### Map operation: Insert, Update, Delete, Check for existence

- Insert/Create

Create a map. Use special keyword `make`. make initialize the map, it will zero out memory/value in this case. If not using `make`, it will create a map that assign to `nil`, cannot have any values in the map. Think of `make` to allocate some space or initializing the map.

```go
// variable name is myMap is a type map, have a [key] type is string, a value type is an string
var myMap map[string]string   // map type[key]value
// create a map based on the type specified above, going to assign to variable myMap
myMap = make(map[string]string)
// add lots of key/value pair into your map.
myMap["matt"] = "Mr "
myMap["kelly"] = "Mrs "
```

* Map shorthand initialization

```go
myMap := map[string]string {
    "matt": "Mr ",
    "kelly": "Mrs ",
}
```

- Update

```go
// if key "matt" existed, update its value, if not exist, it will create it
myMap["matt"] = "Jr "
```

- Delete

```go
delete(myMap, "matt")  // delete the key "matt" from "myMap "
```

- check on existance

```go
// lookup the key from myMap, will return two values from the map.
// first one is the value, second one is bool
if value, exists := myMap[name]; exists {  // exists would be true or false, can be checked directly
    return value
}
```

## Slices

#### What is Array?

It is a collection that have a fixed size of particular types.

```go
var n [3]int  // variable array "n" with size of 3. memory layout: n[0]  n[1]  n[2]  all type are int
```

- Properties of Arrays

* fixed size. (array initialization, defined length/size cannot be changed.)
* Array type is size and underlying type (Array of 3 int is different type of Array of 4 int. So Array type is its size + its type. cannot compare its Array based on its type)
* No initialization (0 valued)  (When init, all values are 0 out. Can immdediately use it.)
* Not a pointer  (In Go, Array is a value type, if you pass Array to a function, if function modify the array, function only modify a copy of the array value. Instead of a reference type like a map)

#### What is a Slice?

Slice need to have size, slice type is based on the underlying type, not the actual size, it wraps the array, act like a wrapper above the array. basically it is a pointer to the array, it allows more fexibility to slice from the array, working with this slice with its length and its capacity. Need to initialize slice via make, determine the length and capacity of the size

```go
// variable slice "s". No size needed. Look just like array. have a len of 3, cap of 5.
// slice with different size, it won't change the type of array
var s []int = make([]int, 3, 5)
```

```go
// @params: type, initial length, total capacity
// Create a slice, has a length of 10, which is 10 memory allocation slot that slice pointed to. Only 3 of them are active. The length of the slice is 3. Third options, capacity is optional, if omit, it would be the same like second param.
s = make([]int, 3, 10)
```

- Properties of Arrays

* fixed size (but can be reallocated with append, use append to make it grow)
* Type is slice of underlying type (does not have length, if pass slice to a function as an arg, pass slice in variant length, they are all the same type. In array, cannot pass an Array to a function, except exactly same size)
* Use make to initialize otherwise is nil ( Array is ready to go, no initialize.)
* Points to an array ( Slice is a reference type. Modify the slice, will modify the original. And can be slice(child) of slice(parent). )

- append and short hand version

```go
// slice of integer, make a slice of type int.
var s []int
s = make([]int 3)
s[0] = 1
s[1] = 10
s[2] = 500   // <= it is valid, since the length of 3 for this slice.
s[3] = 1000 // <= it will output an error, since it only has a length of 3. Index of range error

// To fix this issue, use `append`
s = append(s, 1000)  // <= this will increate the size of the slice

// s... means it extends its slice
s = append(s, s...)  //<= will append the slice to the end. return 1 10 500 1000 1 10 500 1000

// Short hand version
s1 := []int {1, 10, 500}

// To remove an index, will use `append` as well. Put two different slices to create a new slice
s1 = append(s1[:1], s1[2:]...)  // 1 500
```

- slice a portion of slice from a slice

```go
s := []int {1, 10, 500}
// 1:2 would be the index of the slice. in this case, index 0 would be 1, index 1 would be 10
slice1 = s[1:2]  // in this case, "slice1" would pick up "10"
slice2 = s[:2]  // in this case, "slice2" would pick up "1 and 10". Start from the beginning. like put 0 at the beginning
slice3 = s[1:]  // in this case, "slice3" would pick up "10 and 500". Start from the ending. like put length of slice at the end
slice4 = s[1:len(s)]  // same like above like slice3
```

## Methods in Go.

Define a function, the function will specified what type of it operates on, it works like regular function.
Difference, function has a section which define `named type`, go methods can operate on any named types. Any named type in the same package as the method declaration.
Ex: define a struct, it is a named type, we can define a method on it by defining a function

Methods in go can also operate on pointers to name types.
If we create a method on a name type, we cannot modify the name type. But we create a method to a pointer to a named type, we can modify the named type. Think of it as Methods in go taking one additional parameters which is Type.

Ex:
`func(*myType) myMethod(i int)`

## Interface

