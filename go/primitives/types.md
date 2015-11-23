# Types

Go is a statically typed programming language. The compiler always wants to know what the type is for every value in the program.

A value’s type provides the compiler with two pieces of information: 1st, how much memory to allocate, the size of the value. 2nd, what that memory represents.

Many of the built-in types, size and representation are part of the type’s name. A value of type `int64` requires 8 bytes of memory (64 bits) and represents an integer value. A `float32` requires 4 bytes of memory (32 bits) and represents an IEEE-754 binary floating-point number. A `bool` requires 1 byte of memory (8 bits) and represents a Boolean value of true or false.

Some types get their representation based on the architecture of the machine the code is built for. A value of type `int` can either have a size of 8 bytes (64 bits) or 4 bytes (32 bits), depending on the architecture.

## Named types || User defined types

A type declaration makes it possible to give a name to an existing type.

Go allows to declare your own types. When you declare a new type, the declaration is constructed to provide the compiler with size and representation information, similar to how the built-in types work.

There are two ways to declare a user defined type in Go. The most common way is to use the keyword `struct`, which allows you to create a composite type.

`struct` types are declared by composing a fixed set of unique fields. Each field in a `struct` is declared with a known type, which could be a built-in type or another user defined type.

```go
type user struct {
  name, email string
  ext int
  privileged bool
}

// Declare a variable of type user.
var bill user
```

## Methods

A method is a function associated with a named type. Go is unusual in that methods may be attached to almost any named type. Interfaces are abstract types that let us treat different concrete types in the same way based on what methods they have, not how they are represented or implemented.

Methods provide a way to add behavior to user defined types. Methods are functions that contain an extra parameter that’s declared between the keyword `func` and the function name. The parameter between the keyword `func` and the function name is called a receiver and binds the function to the specified type. When a function has a receiver, that function is called a method.

There are two types of receivers in Go: value receivers and pointer receivers.

When you declare a method using a value receiver, the method will always be operating operate on a copy of the value used to make the method call.

When you call a method declared with a pointer receiver, the value used to make the call is shared with the method, pointer receivers operate on the actual value.

```go
// value receiver: declared as a value of type user.
func (u user) notify() {
  fmt.Printf("Sending User Email To %s<%s>\n", u.name, u.email)
}

// changeEmail implements a method with a pointer receiver.
func (u *user) changeEmail(email string) {
  u.email = email
}
```

You can also call methods that are declared with a value receiver using a pointer. *notify* is operating against a copy, but this time a copy of the value that the *lisa* pointer points to.

```go
// Pointers of type user can also be used to call methods declared with a value receiver.
lisa := &user{"Lisa", "lisa@email.com"}
// the notify method is called using the pointer variable. To support the method call, Go adjusts the pointer value to comply with the method’s receiver. Go transformed to `(*lisa).notify()`
lisa.notify()
```

You can also call methods that are declared with a pointer receiver using a value. Go adjusts the value to comply with the method’s receiver to support the call. `(&bill).notify()` The value is referenced so the method call is in compliance with the receiver type. This is a great convenience Go provides, allowing method calls with values and pointers that don’t match a method’s receiver type natively.


## Method Set

Method Sets define the rules around interface compliance and the set of methods that are associated with values or pointers of a given type. The type of receiver used will determine whether a method is associated with a value, pointer, or both.

A value of type `T` only has methods declared that have a value receiver, as part of its method set.
But pointers of type `T` have methods declared with both value and pointer receivers, as part of its method set.

```bash
# Method sets as described by the specification (func definition)
Values      Methods Receivers
-----------------------------------------------
T              (t T) func ()
*T            (t T) and (t *T) func ()
```

Looking at these rules from the perspective of the value is confusing. Let’s look at these rules from the perspective of the receiver.

if you implement an interface using a pointer receiver, then only pointers of that type implement the interface. If you implement an interface using a value receiver, then both values and pointers of that type implement the interface.

```bash
# Method sets from the perspective of the receiver type (func/method caller)
Methods        Receivers Values
-----------------------------------------------
(t T)              T and *T
(t *T)            *T
```

The question now is why the restriction? Because it’s not always possible to get the address of a value, the method set for a value only includes methods that are implemented with a value receiver.


#### Guideline: use a value or pointer receiver

1. The nature of types

After declaring a new type, If create a new value, then use value receivers for your methods. If mutate the value, then use pointer receivers.

It’s important to be consistent. The idea is to not focus on what the method is doing with the value, but to focus on what the nature of the value is.

The decision to use a value or pointer receiver should not be based on whether the method is mutating the receiving value. The decision should be based on the nature of the type.

2. Built-in types

Built-in types are the set of types that are provided by the language. We know them as the set of numeric, string, and Boolean types. These types have a primitive nature to them. Because of this, when adding or removing something from a value of one of these types, a new value should be created. Based on this, when passing values of these types to functions and methods, a copy of the value should be passed.

3. Reference types

Reference types in Go are the set of slice, map, channel, interface, and function types. When you declare a variable from one of these types, the value that’s created is called a header value. Technically, a string is also a reference type value.

All the different header values from the different reference types contain a pointer to an underlying data structure. Each reference type also contains a set of unique fields that are used to manage the underlying data structure. You never share reference type values because the header value is designed to be copied. The header value contains a pointer; therefore, you can pass a copy of any reference type value and share the underlying data structure intrinsically.

Ex: `golang.org/src/net/ip.go`. The `MarshalText` method has been declared using a value receiver of type `IP`. A value receiver is exactly what you expect to see since you don’t share reference type values. This also applies to passing reference type values as parameters to functions and methods.

Note: the caller’s reference type value for this parameter is not shared with the function. The function is passed a copy of the caller’s reference type value. This also applies to return values. In the end, reference type values
are treated like primitive data values.

4. struct types

Struct types can represent data values that could have either a primitive or nonprimitive nature. When the decision is made that a struct type value should not be mutated when something needs to be added or removed from the value, then it should follow the guidelines for the built-in and reference types.

In most cases, struct types don’t exhibit a primitive nature, but a nonprimitive one. In these cases, adding or removing something from the value of the type should mutate the value. When this is the case, you want to use a pointer to share the value with the rest of the program that needs it.

When a factory function returns a pointer, it’s a good indication that the nature of the value being returned is nonprimitive. Even if a function or method is never going to directly change the state of a nonprimitive value, it should still be shared. a pointer receiver is declared even though no changes are made to the receiver value. Since values of type `File`(example) have a
nonprimitive nature, they’re always shared and never copied.

5. exception

One exception to this guideline is when you need the flexibility that value
type receivers provide when working with interface values. In these cases, you may choose to use a value receiver even though the nature of the type is nonprimitive. It’s entirely based on the mechanics behind how interface values call methods for the values stored inside of them.


## Type conversion. `T(v)`

Expression `T(v)` converts the value type of `v` to the type `T`


## Type assertion `Interface.(type)`

It takes a value and tried to create another version in the specific type.
If you have a value and want to convert it to another or a specific type (in case of interface{}), you can use type assertion.

```go
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

The type assertion doesn’t have to be done on an empty interface. It’s often used when you have a function taking a parameter of a specific interface but the function inner code behaves differently based on the actual object type.

```go
type Stringer interface {
  String() string
}
type fakeString struct {
  content string
}

// function used to implement the Stringer interface
func (s *fakeString) String() string {
  return s.content
}

func printString(value interface{}) {
  switch str := value.(type) {
  case string:
    fmt.Printf("case string: %s\n", str)
  case Stringer:
    fmt.Printf("case Stringer: %s\n", str.String())
  }
}

func main() {
  s := &fakeString{"Ceci n'est pas un string"}
  printString(s) // case Stringer: Ceci n'est pas un string
  printString("Hello, Gophers") // case string: Hello, Gophers
}
```

Another example is when checking if an error is of a certain type:

```go
if err != nil {
  if msqlerr, ok := err.(*mysql.MySQLError); ok && msqlerr.Number == 1062 {
    log.Println("We got a MySQL duplicate :(")
  } else {
    return err
  }
}
```


## Type embedding

Type embedding provides the ability to extend types without the need for inheritance.

Go allows you to take existing types and both extend and change their behavior. This capability is important for code reuse and for changing the behavior of an existing type to suit a new need. This is accomplished through type embedding. It works by taking an existing type and declaring that type within the declaration of a new struct type. The type that is embedded is then called an inner type of the new outer type.

Through inner type promotion, identifiers from the inner type are promoted up
to the outer type. These promoted identifiers become part of the outer type as if they were declared explicitly by the type itself. The outer type is then composed of everything the inner type contains, and new fields and methods can be added. The outer type can also declare the same identifiers as the inner type and override any fields or methods it needs to. This is how an existing type can be both extended and changed.

```go
// notifier is an interface that defined notification type behavior.
type notifier interface {
    notify()
}

// user defines a user in the program.
type user struct {
    name, email string
}

// admin represents an admin user with privileges.
type admin struct {
    user
    level string
}

// notify implements a method that can be called via a value of type user.
func (u *user) notify() {
    fmt.Printf("Sending user email to %s<%s>\n", u.name, u.email)
}

func main() {
    // Create an admin user.
    ad := admin{
        user: user{
            name:  "john smith",
            email: "john@yahoo.com",
        },
        level: "super",
    }
    // The embedded inner type's implementation of the interface is "promoted" to the outer type. you won’t see the admin type implement the interface. it means the outer type now implements the interface.
    sendNotification(&ad) // Send the admin user a notification.

    ad.user.notify() // We can access the inner type's method directly.

    ad.notify() // The inner type's method is promoted.
}

// accepts values that implement notifier interface and sends notifications
func sendNotification(n notifier) {
    n.notify()
}
```

What if the outer type doesn’t want to use the inner type’s implementation because it needs an implementation of its own?

This shows how the inner type’s implementation was not promoted once the outer type implemented the notify method. But the inner type is always there, in and of itself, so the code is still able to call the inner type’s implementation directly.

```go
// notify implements a method that can be called via a value of type admin.
func (a *admin) notify() {
  fmt.Printf("Sending admin email to %s<%s>\n", a.name, a.email)
}
func main() {
  ...
  // Send the admin user a notification. The embedded inner type's implementation of the interface is NOT "promoted" to the outer type.
  sendNotification(&ad)
  ad.user.notify() // We can access the inner type's method directly.
  ad.notify() // The inner type's method is NOT promoted.
  ...
}
````
