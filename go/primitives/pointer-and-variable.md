# Pointer

Go has pointers, but no pointer arithmetic. Pointers reference a location in memory where a value is stored rather than the value itself. Pointers are comparable.

Pointers is values that contain the address of a variable. A pointer is thus the location at which a value is stored. Not every value has an address, but every variable does. With a pointer, we can read or update the value of a variable indirectly, without using or even knowing the name of the variable, if indeed it has a name. In other languages, pointers are disguised as "references", and there's not much that can be done with them except pass them around. Pointers are explicitly visible.

`&` operator yields the address of a variable, `&` symbol in front of the value to get the pointer of a value
`*` operator retrieves the variable that the pointer refers to, dereference a pointer, but there is no pointer arithmetic.

Struct fields can be accessed through a struct pointer. Can call fields and methods on a pointer.

- definition

If a variable is declared `var x int`, the expression `&x` (address of x)yields a pointer to an integer variable, that is, a value of type `*int`, which is pronounced "pointer to int."

If this value is called `p`, we say "p points to x", or "p contains the address of x". The variable to which `p` points is written `*p`. The expression `*p` yields the value of that variable, an `int`, but since `*p` denotes a variable, it may also appear on the left-hand side of an assignment,
in which case theassig nment updates the variable.

```go
x := 1
p := &x // p, of type *int, points to x
fmt.Println(*p) // "1"
*p = 2 // equivalent to x = 2
fmt.Println(x) // "2"
```

Variables are sometimes described as **addressable values**. Expressions that denote variables are the only expressions to which the *address-of* operator `&`` may be applied.

- Pointer Usage

**a function to return the address of a local variable**

```go
// Each call of f returns a distinct value
// fmt.Println(f() == f()) // "false"
var p = f()
func f() *int {
  v := 1
  return &v
}
```

**Because a pointer contains the address of a variable, passing a pointer argument to a function to update the variable that was indirectly passed.**

Each time we take the address of a variable or copy a pointer, we create new aliases or ways to identify the same variable.

For example, `*p` is an alias for `v`. Pointer aliasing is useful because it allows us to access a variable without using its name, but this is a double-e dged sword: to find all the statements that access a variable, we have to know all its aliases. It’s not just pointers that create aliases; aliasing also occurs when we copy values of other reference types like `slices, maps, channels`, and even structs, arrays, and interfaces that contain these types.

```go
func incr(p *int) int {
  *p++ // increments what p points to; does not change p
  return *p
}
v := 1
incr(&v) // side effect: v is now 2
fmt.Println(incr(&v)) // "3" (and v is 3)
```

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

The expression `new(T)` creates an unnamed variable of type `T`, initializes it to the zero value of `T`, and returns its address, which is a value of type `*T`. A variable created with `new` is no different from an ordinary local variable whose address is taken.

```go
// those two functions are identical
func newInt() *int {                func newInt() *int {
  return new(int)                      var dummy int
}                                     return &dummy
                                    }
```

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

A variable is a piece of storage containing a value.

`var` creates a variable of a particular type, attaches a name to it, and sets its initial value. Each declaration has the general form. `var name type = expression` Either the *type* or the *= expression* part may be omitted, but not both.

If the *type* is omitted, it is determined by the initializer expression.
If the *expression* is omitted, the initial value is the zero value for the type.
numbers: 0
booleans: false
strings: ""
interfaces and reference types (slice, pointer, map, channel, function): nil

The zero value of an aggregate type like an **array** or a **struct** has the zero value of all of its elements or fields.

The zero-value mechanism ensures that a variable always holds a well-defined value of its type; in Go there is no such thing as an uninitialized variable.



There are several ways to declare a string variable; these are all equivalent. In practice, you should generally use one of the first two forms, with explicit initialization to say that the initial value is important and implicit initialization to say that the initial value doesn’t matter.

```go
s := ""  // used only within a function, not for package level variables.
var s string // relies on default initialization to the zero value for strings, which is ""
var s = ""  // rarely used except when declaring multiple variables
var s string = ""  // explicit about the variable’s type, useful where they are not of the same type

var i, j, k int // int, int, int
var b, f, s = true, 2.3, "four" // bool, float64, string
```

- short variable

A short variable declaration acts like an assignment only to variables that were already declared in the same lexical block; declarations in an outer block are ignored.

One important point: a short variable declaration does not necessarily declare all the variables on its left-hand side. If some of them were already declared in the same lexical block, then the short variable declaration acts like an assignment to those variables.

```go
in, err := os.Open(infile)  // declares both in and err.
// ...
out, err := os.Create(outfile) // declares out but only assigns a value to the existing err variable
```

A short variable declaration must declare at least one new variable, however, so this code will not compile

```go
f, err := os.Open(infile)
// ...
f, err := os.Create(outfile) // compile error: no new variables. The fix is to use an ordinary assignment
```
