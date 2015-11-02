#### Condition

- Switch

By default, switch statement does not need `break` statement, it won't fall through the next case.
if you ever need to fallthrough, use `fallthrough` statement to force it to fall through.
Or use `case "a", "b", "c"`, it can be on one line, it works just like `fallthrough`

#### Loop: Go only have one loop which is `for`

```go
// can assign two variables in one line
for i, j := 0, 1; i < 10; i, j = i++, j*2 {

}
```

```go
func main() {
  x := 1
  stop := false
  for !stop {
    x++
    if x == 10 {
      fmt.Printf("x value is: %d\n", x)
      stop = true
    }
  }
}
```

#### Switch

Only compare values of the same type.
Set an optional default statement to be executed if all the others fail.
Use an expression in the case statement. Ex: calculate a value to use in the case
Multiple values in a case statement. ex: case 0, 1, 3:
Execute all the following statements after a match using the fallthrough statement
Use a `break` statement inside your matched statement to exit the switch processing


## Methods

A method is a function that has a defined receiver, in OOP terms, a method is a function on an instance of an object.
Go does not have classes. However, you can define methods on struct types.

The method receiver appears in its own argument list between the func keyword and the method name. ex: `func (u User) Greeting() string {}`

You can define a method on any type you define in your package, not just structs.
You cannot define a method on a type from another package, or on a basic type.

- Type aliasing

To define methods on a type you don’t “own”, you need to define an alias for the type you want to extend

```go
type MyStr string
func (s MyStr) Uppercase() string {
  return strings.ToUpper(string(s))
}
func main() {
  fmt.Println(MyStr("test").Uppercase())
}
```

- Method receivers

Methods can be associated with a named/value type (User for instance) or a pointer to a named type (*User).

Two reasons to use a pointer receiver.

First, to avoid copying the value on each method call (more efficient if the value type is a large struct).

Remember that Go passes everything by value, meaning that when Greeting() is defined on the value type, every time you call Greeting(), you are copying the User struct. Instead when using a pointer, only the pointer is copied (cheap).

```go
type User struct {
  FirstName, LastName string
}
func (u *User) Greeting() string {
  return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}
func main() {
  u := &User{"Matt", "Aimonetti"}
  fmt.Println(u.Greeting())
}
```

Second, the method can modify the value that its receiver points to.

Abs() could be defined on the value type or the pointer since the method doesn’t modify the receiver value (the vertex).
However Scale() has to be defined on a pointer since it does modify the receiver. Scale() resets the values of the X and Y fields.

```go
type Vertex struct {
  X, Y float64
}

func (v *Vertex) Scale(f float64) {
  v.X = v.X * f
  v.Y = v.Y * f
}

func (v *Vertex) Abs() float64 {
  return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
  v := &Vertex{3, 4}
  v.Scale(5)
  fmt.Println(v, v.Abs()) // &{15 20} 25
}
```
