# Go (lang)

Go is a compiled programming language, which means source code is translated into a language that your computer can understand. It is a typed programming language. This means that variables always have a specific type and that type cannot change.

## Installation ( Go compiler )

[Official Download Links](http://golang.org/dl/)

Check the installation by `go version` or `go help`

## Concept

Write source code to implement the solution, compile source code into an executable, run and test the program to make sure it works.

two types of Go programs:   executables ( run in terminal ) and libraries ( collections of code that package together which used in other programs ).

#### Files and Folders

Files: is a collection of data stored as a unit with a name, a definite size ( in bytes ) and an associated type based on file extension.

Folders: aka directories. are used to group files together or contain other folders.


#### Types

Data types categorize a set of related values, describe the operations that can be done on them and define the way they are stored, all values of a particualr type share certain properties. '

1. Numbers:

Operators: +, -, *, /, %.  List of built-in types:

- Integers

integers types: uint8, uint16, uint32, uint64, int6, int16, int32, int64

numbers without a decimal component. 8, 16, 32, 64 means how many bits each of the types use

int: signed integer. Mostly used.

uint: unsigned integers integer. Only contain positive numbers or zero. in addition, two alias type: byte wihch is the same as *uint8* and *rune* which is the same as *int32*.

uintptr:  int, uint, uintptr are three machine dependent integer types. their size depends on the type of architecture you are using.

bytes are an extremely common unit of measurement used on computers. 1 byte = 8 bits, 1024 bytes = 1 kilobyte, 1024 kilobyte = 1 megabyte. In go, byte data type is often used in the definition of other types.

- Floating Point Numbers

Floating types: float32 (single precision), float64 (double precision), complex64, complex128 (complex numbers with imaginary parts)

float64, is mostly used in general

Numbers that contain a decimal component, it is inexact, have a certain size (32 or 64 bit)

- NaN, positive and negative infinity

2. Strings

String literals can be created using double quotes ( can not contain newlines, but allow special escape sequences ) or back ticks.

3. Booleans:  &&, ||, !


## Hello World example

Read **go** program from top to bottom, left to right.

    touch main.go

    *main.go*
        package main   // a package declaration. it is a must
        import "fmt"     // `import` keyword could include code from other packages

        // This is a comment

        func main() {
            fmt.Println("Hello World")
        }

    go run main.go

Package declaration is a must start for every go program, its for organazing and reusing code.

Comments: // single line or /* multi lines */

Function name *main* is special because it's the function that gets called when you execute the program

`godoc fmt Println` // find out the **go** documentation


## Go Lang

#### Functions

functions: are the building blocks of a **go** program. They have inputs, outputs, and a series of steps called statements which are executed in order. All functions starts with `func`. and function creates a scope.

Syntax:  func funcName(arg) { //optional return type }

#### Variable

- var    ex:    x := 5

A variable (`var` keyword) is a storage location, with a specific type and an associated name. ex: `var x string = "hello world"`

Assignment: +=, == (boolean), := (no type specified)

ex:  x: = "Hello"   equal to   var x = "hello"  # Go compiler can infer the type based on the literal value. No var needed. shorter version is used whenever is possible.

- constant

constants are basically variables whose vlaues cannot be changed later. A good way to reuse common values in a program without writing them out each time.

syntax:    const x string = "Hello World"

- Multiple variables:  use keyword `var` or `const` follow by `()`, each variable on its own line

syntax:

    var (
        a = 1
        b = 2
        c = 3
    )

#### Control Flow statements

- for  : repeat a list of statement or block multiple times

    i := 1
    for i <= 10 {
        fmt.Println(i)
        i = i + 1
    }

    for i := 1; i <= 10; i++ {
        fmt.Printlin(i)
    }

    var total float64 = 0
    // i is the current position of the array, value is the same as x[i]
    // `range` followed by the name of the var that we want to loop over
    //  for i, value := range x  // since i is decleard and not used, it will fail
    // _ is used to tell compiler that we do not need this.
    for _, value := range x {
        total += value
    }
    fmt.Println( total / float64(len(x)) )

- if

    if i % 2 == 0 {
        // even
    } else {
        // odd
    }

- switch

    switch i {
        case 0: fmt.Println("0")
        case 1: fmt.Println("1")
        default: fmt.Println("unknown number")
    }

#### Arrays

syntax:  var x [5]int    // a numbered sequence of elements of a single type with a fixed length. 5 ints in this case

    func main() {
        var x [5]int
        x[4] = 100    // x: [0 0 0 0 100]  set the 5th element to 100
    }

Short syntax on creating arrays

    x := [5]float64{ 98, 93, 77, 82, 83　}　

    x := [4]float64 {    // since we only povide 4 elements, commented out last one, need to change type too
        98,
        93,
        77,
        82,   // last , is required.  allow us to remove an element from the array
        // 83,  // use `slices` for dynamic type
    }

type conversion: In general to convert between types you use the type name like a function.

    float64(len(x))  // convert from int to float64

#### Slices

A slice is a segment of an array. Like arrays slices are indexable and have a length. Unlike arrays this length is allowed to change.
Slices are always associated with some array, never be longer than the array, can be smaller.

syntax:

    var x []float64   // x has been created with a length of 0

    x := make( []float64, 5 )  //use the built-in `make` function. // create a slice with `float64` array of length 5

    x := make( []float64, 5, 10 )  // 10 represents the capacity of the underlying array which the slice points to

    arr := []float64{ 1, 2, 3, 4, 5 }
    x := arr[0:5]   // syntax: [low:high] expression.
    // arr[0: ] same to arr[0:len(arr)] ,   arr[ :5] us the same to arr[0:5],   arr[:] is the same to arr[0:len(arr)]
    // low: index of where to start the slice, high: index of where to end, not include the index itself
    // ex: arr[1:4]   return [2,3,4]

two built-in functions to assist with slices:   append, copy

append: create a new slice by taking an existing slice (1st arg) and appending all the following arguments to it
copy: copy the 2nd arg values into the 1st arg

    func main() {
        slice1 := []int{1,2,3}
        slice2 := append( slice1, 4, 5) // slice2 is [1,2,3,4,5]
        slice3 := make( []int, 2 )  //[0 0] no values are given
        copy(slice3, slice1)  // content of slice1 are copied into slice3. slice3 is [1,2]
    }

#### Maps

A map is an unordered collection of key-value pairs, known as an associative array, a hash table or a dictionary. Map look up a value by its associated key.

Map have to be initialized before they can be used.

    // x is a map of string to int. like arrays and slices, maps can be accessed using brackets
    var x map[string]int   // keyword `map` follow by the key type in brackets, finally the value type

    x := make( map[string]int )
    x["key"] = 10
    fmt.Println( x["key"] )  // 10

Shorter version of Map

    elements := map[string]string {
        "H": "Hydrogen",
        "Li": "Lithium",
    }

    // a map of strings to maps of strings to strings.
    // outer map is used as a lookup table based on the element's symbol
    // inner maps are used to store general information about the elements
    elements := map[string]map[string]string{
        "H": map[string]string{
            "name":"Hydrogen",
            "state":"gas",
        },
        "He": map[string]string{
            "name":"Helium",
            "state":"gas",
        },
    },

difference with array: the length of a map can change as we add new items to it. delete items from a map using the built-in `delete` function.

    delete(x, "key")

when a map key is not defined, call the map key would return nothing. technically a map returns the zero value for the value type, we could check zero value in a condition. `elements['Un'] == ''`. Go provide a better way:

    name, ok := elements["Un"]
    fmt.Println(name, ok)   // false, return since it is undefined

accessing an element of a map can return two values instead of one. 1st value is the result of the lookup, 2nd tells us if the lookup was successful

    if name, ok := elements["Un"]; ok {  // since elements["Un"] is undefined, ok is false, it won't execute if block
        fmt.Println(name, ok)
    }

## Commands

#### run

takes the subsequent files ( separated by spaces ) compiles them into an executable saved in a temporary directory and then runs the programs.



## Learn more about Go

[Go Wiki](https://code.google.com/p/go-wiki/wiki/Projects)


[Common Man - Go Blog](http://www.goinggo.net/)

[Go Reresource](http://dave.cheney.net/resources-for-new-go-programmers)
