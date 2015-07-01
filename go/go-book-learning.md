# Setup on Mac OS X

By convention, all your Go code and the code you will import, will live inside a workspace.

```bash
# ~/.bash_profile. allow your Go workspace to always be set and to call the binaries you compiled
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

Installing `Godoc`, `vet` and `Golint`, three very useful Go tools from the Go team, is highly recommended:

```bash
# Install mercurial and bazaar
brew install hg bzr

go get code.google.com/p/go.tools/cmd/godoc
go get code.google.com/p/go.tools/cmd/vet
go get github.com/golang/lint/golint
```

# Basic

## Variables (var)

A variable can contain any type, including functions. It is static type, means type cannot change when it initialized.
All variables in Go are initialised to the zero value for their type when they’re declared and this eliminates an entire category of initialisation bugs which could otherwise be difficult to identify.

the convention is to use MixedCaps or mixedCaps rather than underscores to write multiword names.

```go
// Way 1, declare one by one
var name string
var age int = 40

// Way 2, list of variables, optional include initializer
var (
    name, location string
    age int = 32
)

// Way 3, You can also initialize variables on the same line
var (
    name, location, age = "Prince Oberyn", "Dorne", 32
)
```

Inferred typing: If an initializer is present, the type can be omitted, the variable will take the type of the initializer.

Inside a function, the `:=` short assignment statement can be used in place of a var declaration with implicit type.
Outside a function, every construct begins with a keyword (var, func, etc) and the `:=` construct is not available.

```go
func main() {
    name, location := "Prince Oberyn", "Dorne"
    age := 32
    fmt.Printf("%s (%d) of %s", name, age, location)
}
```

## fmt.Printf

```go
const pi = 3.14159265
const isOver40 = true
fmt.Printf("%.3f \n", pi)   // %f return a float number, .3 means 3 digit. output: 3.141
fmt.Printf("%T \n", pi)  // %T, means the type of pi,  output: float64
fmt.Printf("%t \n", isOver40)  // %t, show the bool type    # true
fmt.Printf("%d \n", 100)  // %d, show an integer type     # 100
fmt.Printf("%b \n", 100)  // %b, show binary representation of 100   # output: 1100100
fmt.Printf("%c \n", 44)  // %c, the character which is the character number is 44  # output: ,
fmt.Printf("%x \n", 17)  // %x, the hex code of 17   # output: 11
fmt.Printf("%e \n", pi)  // %e, the scitific notation  # output: 3.141593e+00
```

## Some Notes

1.  ==, !=, <, >, <=, >=
2. i++,  i--
3. +, -, *, /, %
4. +=, -=, *=, /=
5. function keywords: delete, copy, append, recover, panic

- recover(), will handle any error if happens. Recover allows program can continue execution, without crashing.

- panic(). kind of like using an exception and catching.

```go
func demoPanic() {
    defer func() {
        fmt.Println(recover())  // PANIC  will be print out.
    }()
    panic("PANIC")  // simulate an Error case
}
```

## Constants (const)

Constants can only be character, string, boolean, or numeric values and cannot be declared using the `:=` syntax. An untyped constant takes the type needed by its context.

```go
const Pi = 3.14
const (
    StatusOK = 200
    StatusCreated = 201
)
```

## Packages and Imports

A package is a library which provides a group of related functions and data types we can use in our programs. Package name should be good: short, concise, evocative. By convention, packages are given lower case, single-word names; there should be no need for underscores or mixedCaps.

Every Go program is made up of packages. Programs start running in package `main`. When writing an executable code (versus a library), then you need to define a `main` package and a `main()` function which will be the entry point to your software.
unlike C/C++ the main() function neither takes parameters nor has a return value.

```go
package main
func main() {
    print("Hello, World!\n")
}
```

By convention, the package name is the same as the last element of the import path. Ex: "math/rand" package comprises files that begin with the statement package `rand`.

```go
// Way 1,
import "fmt"
import "math/rand"

// Way 2, Grouped
import (
    "fmt"
    "math/rand"
)
```

By convention, non standard lib packages are namespaced using a web url. Ex: basically tells the compiler to import the crypto package at `github.com/mattetti/goRailsYourself/crypto` path. The compiler won't automatically pull down the repository, You need to pull down the code yourself via `go get`. It pull down the code and put it in your Go path.

Another convention is that the package name is the base name of its source directory; the package in `src/encoding/base64` is imported as "encoding/base64" but has name base64, not encoding_base64 and not encodingBase64.

```go
import "github.com/mattetti/goRailsYourself/crypto"
```

`GOPATH` environment variable and that is what’s used to store binaries and libraries. That’s also where you should store your code
(your workspace).

```bash
ls $GOPATH
# bin  # contain the Go compiled binaries. Add the bin path to your system path.
# pkg # contains the compiled versions of the available libraries so the compiler can link against them without recompiling them.
# src   # contains all the Go source code organized by import path
```

When starting a new program or library, it is recommended to do so inside the `src` folder, using a fully qualified path (Ex: `github.com/<your username>/<project name>`)

#### Exported names

After importing a package, you can refer to the names it exports (meaning variables, methods and functions that are available from outside of the package). In Go, a name is exported if it begins with a capital letter. `Foo` is an exported name, as is `FOO`. The name foo is not exported.

## Functions, signature, return values, named results

A function can take zero or more typed arguments. The type comes after the variable name. Functions can be defined to return any number of values that are always typed.

```go
// Return a single value
func add(x, y int) int {
    return x + y
}

// return multiple values
var str1, str2 = location("sf")
func location(city string) (string, string) {
    var region string
    var country string
    ...
    return region, country
}

// Return values ca be named and act just like variables. If the result parameters are named, a return statement without arguments returns the current values of the results. Do not recommend it, causing confusion
func location(name, city string) (name, country string) {
    ...
    return
}
```

- Pass undefined numbers of arguments to a function

```go
// using `args` follow by `...`, then follow by arguments type. then the return type
func subtractThem(args ...int) int {
    // then use the `args` as a variables as an Array of arguments. ex: `for _, v := range args`
}
```

- closure: func inside func
- recursive: func call itself

```go
func main() {
    num3 :=3
    doubleNum := func() int {
        return num3 * 2
    }
    fmt.Println(doubleNum())
}

func factorial(num int) int {
    if num == 0 {
        return 1
    }
    return num * factorial(num -1)  // factorial(3) //output: 6
}
```

- defer function, delay function

Normally used in cleanup function, make sure it always execute at the very last

```go
func main() {
    defer printTwo()  // defer func will wait main func finished, then execute itself
    printOne()  // 1 2, since printTwo() has been delayed, print 1 first, then 2
}

func printOne() { fmt.Println(1) }
func printTwo() { fmt.Println(2) }
```

## Pointers

Go has pointers, but no pointer arithmetic. Struct fields can be accessed through a struct pointer. The indirection through the pointer is transparent (you can directly call fields and methods on a pointer).

By default Go passes arguments by value (copying the arguments), if you want to pass the arguments by reference, you need to pass pointers (or use a structure using reference values like **slices** and **maps**.

To get the pointer of a value, use the `&` symbol in front of the value
To dereference a pointer, use the `*` symbol.

Methods are often defined on pointers and not values (although they can be defined on both), so you will often store a pointer in a variable. ex:

```go
client := &http.Client{}
resp, err := client.Get("http://gobootcamp.com")
```

Pointer, in short, passing memory address, then assign the value in the different way

```go
func main() {
    x := 0
    changeX(x) // value won't be change because it is the copy of value, not a pointer
    fmt.Println("x = ", x)  // x = 0

    changeXNow(&x)  // pass the actual memory address in, allow it to be changed
    fmt.Println("x = ", x)  // x = 2
    fmt.Println("memory address of x:  ", &x)  // memory address of x: 0x1026804c
}
func changeX(x int) {
    x = 2
}
func changeXNow(x *int) { //change the value in the memory address, reference by the pointer
    *x = 2  // deal with the actual variable, not the value anymore
}
```

```go
func main() {
    y := new(int)
    fmt.Println("y = ", y)  // y = 0x20818a220
    fmt.Println("y = ", *y)  // y = 0
    changeY(y)
    fmt.Println("y = ", *y)  // y = 100
}
func changeY(y *int) {
    *y = 100
}
```

## Mutability

In Go, only constants are immutable. However because arguments are passed by value, a function receiving an value argument and mutating it, won’t mutate the original value. To mutate the passed value, need to pass it by reference, using a pointer via `*` symbol.

```go

type Artist struct {
    Name, Genre string
    Songs       int
}
func newRelease(a *Artist) int {  // takes a pointer to an Artist value
    a.Songs++
    return a.Songs
}
func main() {
    me := &Artist{Name: "Matt", Genre: "Electro", Songs: 42}  // used the & symbol to get a pointer to the value
    fmt.Printf("%s released their %dth song\n", me.Name, newRelease(me))  // Matt released their 43th song
    fmt.Printf("%s has a total of %d songs", me.Name, me.Songs)  // Matt has a total of 43 songs
}
```

# Type

## Basic types

```bash
bool
string   # using double-quote, or backslash. "" or ``

Numeric types:

uint          either 32 or 64 bits
int            same size as uint
uintptr      an unsigned integer large enough to store the uninterpreted bits of a pointer value

uint8        the set of all unsigned 8-bit integers (0 to 255)
uint16      the set of all unsigned 16-bit integers (0 to 65535)
uint32      the set of all unsigned 32-bit integers (0 to 4294967295)
uint64      the set of all unsigned 64-bit integers (0 to 18446744073709551615)

int8          the set of all signed 8-bit integers (-128 to 127)
int16        the set of all signed 16-bit integers (-32768 to 32767)
int32        the set of all signed 32-bit integers (-2147483648 to 2147483647)
int64        the set of all signed 64-bit integers (-9223372036854775808 to 9223372036854775807)

float32     the set of all IEEE-754 32-bit floating-point numbers
float64     the set of all IEEE-754 64-bit floating-point numbers

complex64    the set of all complex numbers with float32 real and imaginary parts
complex128  the set of all complex numbers with float64 real and imaginary parts

byte         alias \for uint8
rune         alias \for int32 (represents a Unicode code point)
```

## Type conversion

The expression `T(v)` converts the value `v` to the type `T`. Go assignment between items of different type requires an explicit conversion which means that you manually need to convert types if you are passing a variable to a function expecting another type.

```go
// Way 1, long form
var i int = 42
var f float64 = float64(i)

// Way 2, short form
i := 42
f := float64(i)
```

## Type assertion

A type assertion takes a value and tries to create another version in the specified explicit type.

```go
package main

import (
    "fmt"
    "time"
)

// convert it to another or a specific type (in case of `interface{}`)
// timeMap function takes a value and if it can be asserted as a map of interfaces{} keyed by strings, then it injects a new entry called “updated_at” with the current time value.
func timeMap(y interface{}) {
    z, ok := y.(map[string]interface{})
    if ok {
        z["updated_at"] = time.Now()
    }
}
func main() {
    foo := map[string]interface{}{
        "Matt": 42,
    }
    timeMap(foo)
    fmt.Println(foo)
}
```

```go
// checking if an error is of a certain type
if err != nil {
    if msqlerr, ok := err.(*mysql.MySQLError); ok && msqlerr.Number == 1062 {
        log.Println("We got a MySQL duplicate :(")
    } else {
        return err
    }
}
```

## Structs

A struct is a collection of fields/properties, you can think of a struct to be a light class that supports composition but not inheritance. You don’t need to define getters and setters on struct fields, fields can be accessed automatically by using the dot notation. You can define new types as structs or interfaces.

```go
// Declaration of struct literals
type Point struct {
    X, Y int
}
var (
    p = Point{1, 2} // has type Point
    q = &Point{1, 2} // has type *Point
    r = Point{X: 1} // Y:0 is implicit
    s = Point{} // X:0 and Y:0
    b = Point{ Y: 10, X: 20}
)
fmt.Println(b.Y)  // 10
```

It allows to define our own data type.

## Initializing (new)

`new` expression to allocate a zeroed value of the requested type and to return a pointer to it.

```go
x := new(int)
```

A common way to “initialize” a variable containing struct or a reference to one, is to create a struct literal.

```go
type Bootcamp struct {
    Lat, Lon float64
}
func main() {
    fmt.Println(Bootcamp{
        Lat: 34.012836,
        Lon: -118.495338,
    }
}
```

Another option is to create a constructor. This is usually done when the zero value isn’t good enough and you need to set some default field values for instance. In addition, it demos working with struct and assign methods to struct

```go
type Bootcamp struct {
    Lat, Lon float64
}
func main() {
    // Using `new` and `an empty struct literal` are the same
    // result in the same kind of allocation/initialization
    x := new(Bootcamp)
    y := &Bootcamp{}
    fmt.Println(*x == *y)  // Output: true
    c := Bootcamp {Lat: 3, Lon: 4}
    fmt.Println(c.total())  // 7
}
// define "total" func will only work with struct Bootcamp
func (boot *Bootcamp) total() float64 {
    return boot.Lat + boot.Lon
}
```

Note: slices, maps, channels are usually allocated using `make` so the data structure these types are built upon can be initialized.

## Composition vs inheritance

Go is not supported Inheritance. Instead, think of [componsition and interfaces](http://golang.org/doc/effective_go.html#embedding).

```go
type User struct {
    Id             int
    Name, Location string
}
// Player struct has the same fields as the User struct, be simplified by composing struct
type Player struct {
    User
    GameId int
}
// Way 1: initialize a new variable of type Player, Using the dot notation to set the fields
func main() {
    p := Player{}

    p.Id = 42
    p.Name = "Matt"
    p.Location = "LA"
    p.GameId = 90404
    fmt.Printf("%+v", p)  // {User:{Id:42 Name:Matt Location:LA} GameId:90404}
}
// Way 2, use a struct literal
func main() {
    p := Player{
        User{Id: 42, Name: "Matt", Location: "LA"},
        90404,
    }
    fmt.Printf("%+v", p)  // {User:{Id:42 Name:Matt Location:LA} GameId:90404}

    fmt.Println(p.UserGreetings())
    fmt.Println(p.PlayerGreetings())
}

func (u *User) UserGreetings() string {
    return fmt.Sprintf("Hi %s from %s", u.Name, u.Location)  // Since u is type of User struct, it cannot access `GameId`
}
func (u *Player) PlayerGreetings() string {
    return fmt.Sprintf("Hi %s from %s, game id: %d", u.Name, u.Location, u.GameId)
}
```

```go
package main
import (
    "log"
    "os"
)
// Way 1
type Job struct {
    Command string
    // field Logger which is a pointer to another type (log.Logger)
    // When initialize our value, set the logger, calling `job.Logger.Print()`
    Logger *log.Logger
}
func main() {
    job := &Job{"demo", log.New(os.Stderr, "Job: ", log.Ldate)}
    // same as // job := &Job{Command: "demo", Logger: log.New(os.Stderr, "Job: ", log.Ldate)}
    job.Logger.Print("test")  // Job: 2015/05/11 test
}

// Way 2, Go lets you go even further and use implicit composition. We can skip defining the field for our logger and now all the methods available on a pointer to log.Logger are available from our struct:
type Job struct {
    Command string
    *log.Logger
}

func main() {
    job := &Job{"demo", log.New(os.Stderr, "Job: ", log.Ldate)}
    job.Print("starting now...")  // Job: 2015/05/11 starting now...
}
```

# Collection Types

## Arrays

The type `[n]T` is an array of `n` values of type `T`. An array’s length is part of its type, so arrays cannot be resized.

```go
// Way 1,
var a [10]int  // declares a variable a as an array of ten integers.
func sth () {
    favNums := [5]float64 {1,2,3,4,5}
}

// Way 2, set the array entries as you declare the array
func main () {
    a := [2]string{"hello", "world!"}
    // %q to print each element quoted.
    fmt.Printf("%q", a)  // ["hello" "world"]
}
```

#### Multi-dimensional arrays

```go
package main
import "fmt"
func main() {
    var a [2][3]string
    for i := 0; i < 2; i++ {
        for j := 0; j < 3; j++ {
            a[i][j] = fmt.Sprintf("row %d - column %d", i+1, j+1)
        }
    }
    fmt.Printf("%q", a)
    // [["row 1 - column 1" "row 1 - column 2" "row 1 - column 3"]
    // ["row 2 - column 1" "row 2 - column 2" "row 2 - column 3"]]
}
```

## Slices

[]T is a slice with elements of type T. Just like Array, when created, leave out the size.

Slices wrap arrays to give a more general, powerful, and convenient interface to sequences of data. Except for items with explicit dimension such as transformation matrices, most array programming in Go is done with slices rather than simple arrays.

Slices hold references to an underlying array, and if you assign one slice to another, both refer to the same array. If a function takes a slice argument, changes it makes to the elements of the slice will be visible to the caller, analogous to passing a pointer to the underlying array.

A slice points to an array of values and also includes a length. Slices can be resized since they are just a wrapper on top of another data structure.

#### Slicing a slice

Slices can be re-sliced, creating a new slice value that points to the same array. Evaluates to a slice of the elements from lo through hi-1, inclusive `s[lo:hi]`

```go
func main() {
    p := []int{2, 3, 5, 7, 11, 13}
    fmt.Println(p) // [2 3 5 7 11 13]
    fmt.Println(p[1:4]) // [3 5 7]
    fmt.Println(p[:3])  // [2 3 5]
    fmt.Println(p[3:])  // [7 11 13]
}
```

#### Making slices

Create a slice without defining a set of default values. Using 'make'.

create an empty slice of a specific length and then populate each entry via `make`. It works by allocating a zeroed array and returning a slice that refers to that array.

```go
func main() {
    cities := make([]string, 2)
    cities[0] = "Santa Monica"
    cities[1] = "Venice"
    fmt.Printf("%q", cities) // ["Santa Monica" "Venice"]
}
```

```go
func main () {
    numSlice := []int {5,4,3,2,1}
    numSlice3 := make([]int, 5, 10)  // create default 5 allocation with zero value, type are int. Max size of slice is 10
    copy(numSlice3, numSlice)  // copy numSlice value into numSlice3 slice
    fmt.Println(numSlice3)  // [5 4 3 2 1]
}
```

#### Appending to a slice

Code below will raise a runtime error. Because a slice is seating on top of an array, in this case, the
array is empty and the slice can’t set a value in the referred array.

```go
cities := []string{}
cities[0] = "Santa Monica"
```

```go
func main() {
    cities := []string{}
    cities = append(cities, "San Diego", "Mountain View")
    fmt.Println(cities) // ["San Diego" "Mountain View"]
}

// append a slice to another slice using an ellipsis
func main() {
    cities := []string{"San Diego", "Mountain View"}
    otherCities := []string{"Santa Monica", "Venice"}
    cities = append(cities, otherCities...)
    fmt.Printf("%q", cities)  // ["San Diego" "Mountain View" "Santa Monica" "Venice"]
}
```

Note: the ellipsis is a built-in feature in Go which means the element is a collection. We can’t append an element of type slice of strings ([]string) to a slice of strings, only strings can be appended. However, using the ellipsis (...) after our slice, we indicate that we want to append each element of our slice. Because we are appending strings from another slice, the compiler will accept the operation since the types are matching.

#### Length

At any time, you can check the length of a slice by using `len`. ex: `fmt.Println(len(cities))`

#### Nil slices

The zero value of a slice is `nil`. A nil slice has a length and capacity of 0.

```go
func main() {
    var z []int
    fmt.Println(z, len(z), cap(z)) // [] 0 0
    if z == nil {
        fmt.Println("nil!") // nil!
    }
}
```

## Range

Range is the for loop iterates over a slice or a map (To iterate over all the elements of a data structure)
It allow to take every single value which take out of an array, slice, or a map

```go
func main() {
    a := []int{1, 2, 3}
    for i, v := range a {
        fmt.Printf("Index: %d, value: %d\n", i, v)  // index: 0, value: 1, ...
    }
}
```

The blank identifier: To skip the index or value by assigning to _. If you only want the index, drop the “, value” entirely.

```go
for _, v := range a {
    fmt.Printf("value: %d\n", v)  // value: 1, ...
}
```

#### Break & Continue

break: stop the iteration anytime
continue: skip an iteration

#### Range used on maps

in that case, the first parameter isn’t an incremental integer but the map key

```go
func main() {
    cities := map[string]int{
        "New York":    8336697,
        "Los Angeles": 3857799,
    }
    for key, value := range cities {
        fmt.Printf("%s has %d inhabitants\n", key, value)  // New York has 8336697 inhabitants, ...
    }
}

```

## Maps

Like JS “dictionaries” or “hashes”. A map maps keys to values.

```go
// using make to create a map, map[TypeForKey]TypeForValue
func main () {
    presAge := make(map[string] int)
    presAge["Theodore Roosevelt"] = 42  // space is allowed
}
```

```go
func main() {
    celebs := map[string]int{
        "Jude Law":           41,
        "Scarlett Johansson": 29,
    }
    fmt.Printf("%#v", celebs) // map[string]int{"Scarlett Johansson":29, "Jude Law":41}
}
```

When not using map literals like above, maps must be created with `make` (not `new`) before use. The `nil` map is empty and cannot be assigned to.

```go
type Vertex struct {
    Lat, Long float64
}
var m map[string]Vertex
func main() {
    m = make(map[string]Vertex)
    m["Bell Labs"] = Vertex{40.68433, -74.39967}
    fmt.Println(m["Bell Labs"])   // {40.68433 -74.39967}
}

// When using map literals, if the top-level type is just a type name, omit it from the elements of the literal.
var m = map[string]Vertex{
    "Bell Labs": {40.68433, -74.39967},
    // same as "Bell Labs": Vertex{40.68433, -74.39967}
    "Google": {37.42202, -122.08408},
}
```

#### Mutating maps

```go
// Insert or update an element in map m
m[key] = elem
// Retrieve an element
// if the key is not present the result is the zero value for the map’s element type.
elem = m[key]
// Delete an element:
delete(m, key)
// Test that a key is present with a two-value assignment
// If key is in m, ok is true. If not, ok is false and elem is the zero value for the map’s element type.
elem, ok = m[key]
```

# Control Flow

There is no `do` or `while` loop, only a slightly generalized `for`;
`if` and `switch`(more flexible) accept an optional initialization statement like that of `for`;
`break` and `continue` statements take an optional label to identify what to break or continue;
New control structures including a type switch and a multiway communications multiplexer, select.
The syntax is also slightly different: there are no parentheses and the bodies must always be brace-delimited.

## if

( ) are gone and the { } are required. Like `for`, the if statement can start with a short statement to execute before the condition. Variables declared by the statement are only in scope until the end of the if. Variables declared inside an if short statement are also available inside any of the else blocks.

## for

Go has only one looping construct, for loop. ( ) are gone (they are not even optional) and the { } are required.

```go
// Way 1
for i := 0; i < 10; i++ {
}

// Way 2, For loop without pre/post statements
sum := 1
for ; sum < 1000; {
    sum += sum
}

// Way 3, For loop as a while loop
sum := 1
for sum < 1000 {
    sum += sum
}

// Way 4, Infinite loop
for {
    // do something in a loop forever
}
```

## switch

Only compare value of the same type.
When set an optional default statement to be exectuted if all the others fail.
You can use an expression in the case statement, for instance you can calculate a value to use.
You can have multiple values in a case statement.
You can execute all the following statements after a match using the `fallthrough` statement.
You can use a break statement inside your matched statement to exit the switch processing

```go
func main() {
    num := 3
    v := num % 2
    switch v {
    case 0, 4, 5:
        fmt.Println("even")
    case 3:
        fmt.Println("<= 3")
        if time.Now().Unix()%2 == 0 {
            break  // if this is true, it will exit the switch processing
        }
    case 2:
        fallthrough  // when v is 2, it will fall through to the next case
    case 3 - 2:
        fmt.Println("odd")   // odd   output in this case
    default:
        fmt.Println("Try again!")
    }
}
```

- Type switch

A switch can also be used to discover the dynamic type of an interface variable. Such a type switch uses the syntax of a type assertion with the keyword type inside the parentheses. If the switch declares a variable in the expression, the variable will have the corresponding type in each clause. It's also idiomatic to reuse the name in such cases, in effect declaring a new variable with the same name but a different type in each case.

```go
var t interface{}
t = functionOfSomeType()
switch t := t.(type) {
    default:
        fmt.Printf("unexpected type %T", t)       // %T prints whatever type t has
    case bool:
        fmt.Printf("boolean %t\n", t)             // t has type bool
    case int:
        fmt.Printf("integer %d\n", t)             // t has type int
    case *bool:
        fmt.Printf("pointer to boolean %t\n", *t) // t has type *bool
    case *int:
        fmt.Printf("pointer to integer %d\n", *t) // t has type *int
}
```

# Methods

Go is not an OOP language. types and methods allow for an object-oriented style of programming. The big difference
is that Go does not support type inheritance but instead has a concept of interface.

A method is a function that has a defined receiver, in OOP terms, a method is a function on an instance of an object.

Go does not have classes. However, you can define methods on struct types. The method receiver appears in its own argument list between the `func` keyword and the method name. methods are defined outside of the struct.

## Code organization

Methods can be defined on any file in the package and on any type in your package, not just structs. But cannot define a method on a type from another package or on a basic type. Here is the recommended layout:

```go
package models

// list of packages to import
import (
    "fmt"
)

// list of constants
const (
    ConstExample = "const before vars"
)

// list of variables
var (
    ExportedVar    = 42
    nonExportedVar = "so say we all"
)

// Main type(s) for the file,
// try to keep the lowest amount of structs per file when possible.
type User struct {
    FirstName, LastName string
    Location            *UserLocation
}
type UserLocation struct {
    City    string
    Country string
}

// List of functions
func NewUser(firstName, lastName string) *User {
    return &User{FirstName: firstName,
        LastName: lastName,
        Location: &UserLocation{
            City:    "Santa Monica",
            Country: "USA",
        },
    }
}

// List of methods
func (u *User) Greeting() string {
    return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}
```

## Type aliasing

Type aliasing: To define methods on a type you don’t “own”, need to extend

```go
package main
import (
    "fmt"
    "strings"
)
type MyStr string
func (s MyStr) Uppercase() string {
    return strings.ToUpper(string(s))
}
func main() {
    fmt.Println(MyStr("test").Uppercase())
}
```

## Method receivers

Methods can be associated with a named type (ex: User) or a pointer to a named type (ex: *User). Example above, methods were defined on the value types (ex: MyStr).

There are two reasons to use a pointer receiver.

* First, to avoid copying the value on each method call (more efficient if the value type is a large struct). Remember that Go passes everything by value, meaning that when `Greeting()` is defined on the value type, every time you call Greeting(), you are copying
the User struct. Instead when using a pointer, only the pointer is copied (cheap).

* Second, why you might want to use a pointer is so that the method can modify the value that its receiver points to. Ex: a series of methods operate on the same variable.

# Interfaces

An interface type is defined by a set of methods. A value of interface type can hold any value that implements those methods.

Interface names: By convention, one-method interfaces are named by the method name plus an -er suffix or similar modification to construct an agent noun: Reader, Writer, Formatter, CloseNotifier etc. To avoid confusion, don't give your method one of those names unless it has the same signature and meaning. Conversely, if your type implements a method with the same meaning as a method on a well-known type, give it the same name and signature; call your string-converter method String not ToString.

```go
package main
import (
    "fmt"
)

type User struct {
    FirstName, LastName string
}
// To make our User struct implement the interface, we defined a Name() method.
func (u *User) Name() string {
    return fmt.Sprintf("%s %s", u.FirstName, u.LastName)
}
// Namer is a new interface which defines one method: Name().
type Namer interface {
    Name() string
}
// more generic func which takes a param of interface type Namer
// So Greet() will accept as param any value which has a Name() method defined.
func Greet(n Namer) string {
    return fmt.Sprintf("Dear %s", n.Name())
}
// now define a new type that would implement the same interface and our Greet function would still work.
type Customer struct {
    Id int
    FullName string
}
func (c *Customer) Name() string {
    return c.FullName
}

func main() {
    u := &User{"Matt", "Ma"}
    // Greet and pass our pointer to User type.
    fmt.Println(Greet(u))    // Dear Matt Ma
    c := &Customer{42, "Kelly Ma"}
    fmt.Println(Greet(c))    // Dear Kelly Ma
}
```

## Interfaces are satisfied implicitly

A type implements an interface by implementing the methods.

There is no explicit declaration of intent. Implicit interfaces decouple implementation packages from the packages that define the interfaces: neither depends on the other.

It also encourages the definition of precise interfaces, because you don’t have to find every implementation and tag it with the new interface name.

```go
// Package io defines Reader and Writer so you don’t have to.
package main
import (
    "fmt"
    "os"
)
type Reader interface {
    Read(b []byte) (n int, err error)
}
type Writer interface {
    Write(b []byte) (n int, err error)
}
type ReadWriter interface {
    Reader
    Writer
}
func main() {
    var w Writer
    w = os.Stdout  // os.Stdout implements Writer
    fmt.Fprintf(w, "hello, writer\n")
}
```

## Errors

An error is anything that can describe itself as an error string. The idea is captured by the predefined, built-in interface type, error, with its single method, Error, returning a string:

```go
type error interface {
    Error() string
}
```

The `fmt` package’s various print routines automatically know to call the method when asked to print an error.

```go
package main
import (
    "fmt"
    "time"
)
type MyError struct {
    When time.Time
    What string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("at %v, %s", e.When, e.What)
}
func run() error {
    return &MyError{time.Now(), "it didn't work"}
}
func main() {
    if err := run(); err != nil {
        fmt.Println(err)  // at 2015-05-12 04:43:09.658309427 -0700 PDT, it didn't work
    }
}
```

# Concurrency

Go encourages to shared values are passed around on channels and, in fact, never actively shared by separate threads of execution. Only one goroutine has access to the value at any given time. Data races cannot occur, by design. To encourage this way of thinking we have reduced it to a slogan: "Do not communicate by sharing memory; instead, share memory by communicating." as a high-level
approach, using channels to control access makes it easier to write clear, correct programs.

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime. Ex: the evaluation of f, x, y, and z happens in the current goroutine and the execution of `f` happens in the new goroutine.

```go
go f(x, y, z)
// starts a new goroutine running
f(x, y, z)
```

Goroutines run in the same address space, so access to shared memory must be synchronized. The `sync` package provides useful primitives, although you won’t need them much in Go as there are other primitives.

```go
package main
import (
    "fmt"
    "time"
)
func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}
func main() {
    go say("world")
    say("hello")
}
```

## Channels

Channels are a typed pipe through which you can send and receive values with the channel operator, `<-`.
The data flows in the direction of the arrow.

```go
ch <- v // Send v to channel ch.
v := <-ch // Receive from ch, and assign value to v.
```

Like maps and slices, channels must be created before use, By default, sends and receives block wait until the other side is ready. This
allows goroutines to synchronize without explicit locks or condition variables.

```go
ch := make(chan int)
```

```go
package main
import "fmt"
func sum(a []int, c chan int) {
    sum := 0
    for _, v := range a {
        sum += v
    }
    c <- sum // send sum to c
}
func main() {
    a := []int{7, 2, 8, -9, 4, 0}
    c := make(chan int)
    go sum(a[:len(a)/2], c)
    go sum(a[len(a)/2:], c)
    x, y := <-c, <-c // receive from c
    fmt.Println(x, y, x+y)   // 17 -5 12
}
```

- Buffered channels

Channels can be buffered. Provide the buffer length as the second argument to `make` to initialize a buffered channel.

```go
ch := make(chan int, 100)
```

Sends to a buffered channel block only when the buffer is full. Receives block when the buffer is empty.

```go
func main() {
    c := make(chan int, 2)
    c <- 1
    c <- 2
    // uncomment below: fatal error: all goroutines are asleep - deadlock!  Fix provided below
    // because overfilled the buffer without letting the code a chance to read/remove a value from the channel.
    // c <- 3
    fmt.Println(<-c)
    fmt.Println(<-c)
    // fmt.Println(<-c)
}
```

Adding an extra value from inside a go routine, so our code doesn’t block the main thread. The goroutine is being called before
the channel is being emptied, but that is fine, the goroutine will wait until the channel is available. We then read a first value from the channel, which frees a spot and our goroutine can push its value to the channel.

```go
func main() {
    c := make(chan int, 2)
    c <- 1
    c <- 2
    c3 := func() { c <- 3 }
    go c3()
    fmt.Println(<-c)
    fmt.Println(<-c)
    fmt.Println(<-c)
}
```

## Range and close

A sender can close a channel to indicate that no more values will be sent. Receivers can test whether a channel has been closed by assigning a second parameter to the receive expression: after

```go
// ok is false if there are no more values to receive and the channel is closed.
v, ok := <-ch
// The loop `for i := range ch` receives values from the channel repeatedly until it is closed.
```

Note: Only the sender should close a channel, never the receiver. Sending on a closed channel will cause a panic.
Note: Channels aren’t like files; you don’t usually need to close them. Closing is only necessary when the receiver must be told there are no more values coming, such as to terminate a range loop.

## Select

Select: lets a goroutine wait on multiple communication operations. A select blocks until one of its cases can run, then it executes that case. It chooses one at random if multiple are ready.

The default case in a select is run if no other case is ready. The default case in a select is run if no other case is ready.

```go
package main
import "fmt"
func fibonacci(c, quit chan int) {
    x, y := 0, 1
    for {
        select {
        case c <- x:
            x, y = y, x+y
        case <-quit:
            fmt.Println("quit")
            return
        default:
            // receiving from c would block
        }
    }
}
func main() {
    c := make(chan int)
    quit := make(chan int)
    go func() {
        for i := 0; i < 10; i++ {
            fmt.Println(<-c)
        }
        quit <- 0
    }()
    fibonacci(c, quit)
}
```

- Timeout

We are using the `time.After` call as a timeout measure to exit if the request didn’t give a response within 500ms.

```go
package main
import (
    "fmt"
    "time"
)
func main() {
    tick := time.Tick(100 * time.Millisecond)
    boom := time.After(500 * time.Millisecond)
    for {
        select {
        case <-tick:
            fmt.Println("tick.")
        case <-boom:
            fmt.Println("BOOM!")
            return
        default:
            fmt.Println(" .")
            time.Sleep(50 * time.Millisecond)
        }
    }
}
```

## Tips and Tricks

* embrace the interface, instead of OOP. Use as many as interface as needed.
* Go idioms: simplicity, concurrency, composition

- AlternateWays to Import Packages

```go
import format "fmt"  // Creates an alias of fmt. Preceed all fmt package content with format instead of fmt.
import . "fmt" // Allows content of the package to be accessed directly, without the need for it to be preceded with fmt.
import _ "fmt"// Suppresses compiler warnings related to fmt if it is not being used, and executes initialization functions if there are any. The remainder of fmt is inaccessible.
```

- Other cool utilities

1. [goimports]() updates your Go import lines, adding missing ones and removing unreferenced ones.
2. [gofmt](http://golang.org/cmd/gofmt/)  drop-in replacement for formatting, also fixes imports. Auto formats Go program.

- Sets

To extract unique value from a collection. Go doesn’t have that built in, however it’s not too hard to implement.

```go
func main() {
    a := []string{"a", "b", "c", "a", "b", "c"}
    fmt.Println(UniqStr(a))
}
// UniqStr returns a copy if the passed slice with only unique string results.
func UniqStr(col []string) []string {
    // chose an empty structure because it will be as fast as a boolean but doesn’t allocate as much memory.
    m := map[string]struct{}{}  // the map of empty structs
    for _, v := range col {
        // check if there is a value associated with the key `v` in the map `m`
        // if we know that we don’t have a value, then we add one.
        if _, ok := m[v]; !ok {
            m[v] = struct{}{}
        }
    }
    list := make([]string, len(m))
    i := 0
    // Once we have a map with unique keys, we can extract them into a new slice of strings and return the result.
    for v := range m {
        list[i] = v
        i++
    }
    return list
}
```

- Set the build id using git’s SHA

Use a build id in your binaries. I personally like to use the SHA1 of the git commit I’m committing.

```bash
git rev-parse --short HEAD  # get the short version of the sha1 of your latest commit
go run -ldflags "-X main.Build a1064bc" hello.go
```

```go
package main
import "fmt"
// compile passing -ldflags "-X main.Build <build sha1>"
var Build string
func main() {
    fmt.Printf("Using build: %s\n", Build)  // Using build: a1064bc
}
```

- How to see what packages my app imports

```bash
# To see what packages your app is importing. it is doable via `go list`
go list -f '{{join .Deps "\n"}}' | xargs go list -f '{{if not .Standard}}{{.ImportPath}}{{end}}'

# the list also contain standard package
go list -f '{{join .Deps "\n"}}' | xargs go list -f '{{.ImportPath}}'
```

# Effective Go

## gofmt

All Go code in the standard packages has been formatted with `gofmt`.

Indentation: tabs for indentation and gofmt emits them by default. Use spaces only if you must.
Line length: Go has no line length limit. If a line feels too long, wrap it and indent with an extra tab.
Parentheses: Go needs fewer parentheses than C and Java: control structures (if, for, switch) do not have parentheses in their syntax.Also, the operator precedence hierarchy is shorter and clearer

## Commentary  ( /* */  // )

`godoc` (web server) processes Go source files to extract documentation about the contents of the package. Comments that appear before top-level declarations, with no intervening newlines, are extracted along with the declaration to serve as explanatory text for the item. The nature and style of these comments determines the quality of the documentation godoc produces.

Note: `gofmt` will takes care of spacing, formating, etc.

```go
/*
Package regexp implements a simple library for regular expressions.

The syntax of the regular expressions accepted is:

    regexp:
        concatenation { '|' concatenation }
    ...
*/
```

If the package is simple, the package comment can be brief.

```go
// Package path implements utility routines for
// manipulating slash-separated filename paths.
```

## Semicolons

Semicolons will be applied. If the last token before a newline is an identifier (which includes words like int and float64), a basic literal such as a number or string constant, or one of the tokens

```go
break continue fallthrough return ++ -- ) }
// A semicolon can also be omitted immediately before a closing brace
go func() { for { dst <- <-src } }()
```

Go programs have semicolons only in places such as for loop clauses, to separate the initializer, condition, and continuation elements. They are also necessary to separate multiple statements on a line, should you write code that way.



https://www.youtube.com/watch?v=CF9S4QZuV30  minutes 36mins  start from interface
