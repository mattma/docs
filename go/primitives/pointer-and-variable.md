# Pointer

Go has pointers, but no pointer arithmetic. Pointers reference a location in memory where a value is stored rather than the value itself.

Pointers is values that contain the address of a variable. In other languages, pointers are disguised as "references", and there's not much that can be done with them except pass them around. Pointers are explicitly visible.

`&` operator yields the address of a variable, `&` symbol in front of the value to get the pointer of a value
`*` operator retrieves the variable that the pointer refers to, dereference a pointer, but there is no pointer arithmetic.

Struct fields can be accessed through a struct pointer. Can call fields and methods on a pointer.

- Pointers are a way of sharing data across functions and goroutines.

A pointer is represented using the `*` (asterisk) character followed by the type of the stored value. `*` is also used to "dereference" pointer variables. Dereferencing a pointer gives us access to the value the pointer points to.

`&` operator to find the address of a variable. `&x` returns a `*int` (pointer to an int) because `x` is an `int`. This is what allows us to modify the original variable. `&x` in main and `xPtr` in zero refer to the same memory location.

```go
func zero(xPtr *int) {
  *xPtr = 0
}

func main() {
  x := 5
  zero(&x)
  fmt.Println(x) // x is 0
}
```

## new

`new` takes a type as an argument, allocates enough memory to fit a value of that type and returns a pointer to it.

```go
func one(xPtr *int) {
  *xPtr = 1
}
func main() {
  xPtr := new(int)
  one(xPtr)
  fmt.Println(*xPtr) // x is 1
}
```

#### Gotcha

1. No pointer arithmetic.

Cannot alter the address `p` points to unless you assign another address to it.

```go
var p *int  // Pointer cannot do arithetic. Change to `int` will work
p++ // invalid operation: p++ (non-numeric type *int)
```

2. Safe pointer

Once a value is assigned to a pointer, with the exception of `nil`, Go guarantees that the thing being pointed to will continue to be valid for the lifetime of the pointer. The compiler will arrange for the memory location holding the value of i to be valid after f() returns

```go
func f() *int {
  i := 1
  return &i  // 0x820244080. Return the address of value
}
```

3. `nil` pointers

you can have `nil` pointers and `panic` because of them

Strings are value types, not pointers. `var s string // the zero value of s is "", not nil`

In fact, most of the built in data types, maps, slices, channels, and arrays, have a sensible default if they are left uninitialized.


# Varible

There are several ways to declare a string variable; these are all equivalent. In practice, you should generally use one of the first two forms, with explicit initialization to say that the initial value is important and implicit initialization to say that the initial value doesn’t matter.

```go
s := ""  // used only within a function, not for package level variables.
var s string // relies on default initialization to the zero value for strings, which is ""
var s = ""  // rarely used except when declaring multiple variables
var s string = ""  // explicit about the variable’s type, useful where they are not of the same type
```
