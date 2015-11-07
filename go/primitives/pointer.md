
Pointers are a way of sharing data across functions and goroutines.

Pointers reference a location in memory where a value
is stored rather than the value itself.

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

In Go a pointer is represented using the * (asterisk)
character followed by the type of the stored value.
* is also used to “dereference” pointer variables. Dereferencing
a pointer gives us access to the value the
pointer points to.

we use the & operator to find the address of a variable. &x returns a *int (pointer to an int) because x
is an int. This is what allows us to modify the original
variable. &x in main and xPtr in zero refer to the same
memory location.


- new

new takes a type as an argument, allocates enough
memory to fit a value of that type and returns a
pointer to it.
Another way to get a pointer is to use the built-in new
function:

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

#### Pointers

Go has pointers, but no pointer arithmetic. Struct fields can be accessed through a struct pointer. Can call fields and methods on a pointer.

By default, Go passes augruments by value (copying the arguments), if pass the argument by reference, pass pointers or use a structure using reference values like slices and maps.

To get the pointer of a value, use the **&** symbol in front of the value, to dereference a pointer, use `*`.

Methods are often defined on pointers and not values, although they can be defined on both, often store a pointer in a variable.
