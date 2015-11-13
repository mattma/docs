Interfaces are types that declare behavior and provide polymorphism.
Type embedding provides the ability to extend types without the need for
inheritance.

## Interface

Once a type implements an interface, an entire world of
functionality can be opened up to values of that type.

Interfaces are types that just declare behavior. This behavior is never implemented by
the interface type directly but instead by user-defined types via methods. When a userdefined
type implements the set of methods declared by an interface type, values of
the user-defined type can be assigned to values of the interface type. This assignment
stores the value of the user-defined type into the interface value.

If a method call is made against an interface value, the equivalent method for the
stored user-defined value is executed. Since any user-defined type can implement any
interface, method calls against an interface value are polymorphic in nature. The userdefined
type in this relationship is often called a concrete type, since interface values have
no concrete behavior without the implementation of the stored user-defined value.
There are rules around whether values or pointers of a user-defined type satisfy the
implementation of an interface. Not all values are created equal.


you see what the value of the interface variable looks like after the
assignment of the user type value (graph below). Interface values are two-word data structures. The
first word contains a pointer to an internal table called an iTable, which contains type
information about the stored value. The iTable contains the type of value that has
been stored and a list of methods associated with the value. The second word is a
pointer to the stored value. The combination of type information and pointer binds
the relationship between the two values.


```bash
var n notifier
# type value assignment  or  type pointer assignment
n = user{"bill"}  or  n = &user{"bill"}

# Interface value. ex: notifier

Address   ------------------------------------>   iTableiTable
                                                                Type(user) or Type(*user)

                                                                Method set
Address              Stored value
ex: user    -------->   User
```

- Method set Rule

Method sets define the rules around interface compliance. Method sets define the set of methods that are associated with values or pointers
of a given type. The type of receiver used will determine whether a method is associated
with a value, pointer, or both.

Method sets as described by the specification (func definition)

Values      Methods Receivers
-----------------------------------------------
T               (t T)
*T              (t T) and (t *T)

It says that a value of
type T only has methods declared that have a value receiver, as part of its method set.
But pointers of type T have methods declared with both value and pointer receivers, as
part of its method set. Looking at these rules from the perspective of the value is confusing.
Let’s look at these rules from the perspective of the receiver.

Method sets from the perspective of the receiver type (func/method caller)

Methods          Receivers Values
-----------------------------------------------
(t T)                 T and *T
(t *T)               *T

Listing 5.43 shows the same rules, but from the perspective of the receiver. It says that
if you implement an interface using a pointer receiver, then only pointers of that type
implement the interface. If you implement an interface using a value receiver, then
both values and pointers of that type implement the interface.


The question now is why the restriction? The answer comes from the fact that it’s
not always possible to get the address of a value. Because it’s not always possible to get the address of a value, the method set for a value
only includes methods that are implemented with a value receiver.


- Type embedding

Go allows you to take existing types and both extend and change their behavior. This
capability is important for code reuse and for changing the behavior of an existing
type to suit a new need. This is accomplished through type embedding. It works by
taking an existing type and declaring that type within the declaration of a new struct
type. The type that is embedded is then called an inner type of the new outer type.

Through inner type promotion, identifiers from the inner type are promoted up
to the outer type. These promoted identifiers become part of the outer type as if they
were declared explicitly by the type itself. The outer type is then composed of everything
the inner type contains, and new fields and methods can be added. The outer
type can also declare the same identifiers as the inner type and override any fields or
methods it needs to. This is how an existing type can be both extended and changed.


```go
// Sample program to show how embedded types work with interfaces.
package main
import (
"fmt"
)
// notifier is an interface that defined notification
// type behavior.
type notifier interface {
notify()
}
// user defines a user in the program.
type user struct {
name string
email string
}
// notify implements a method that can be called via
// a value of type user.
func (u *user) notify() {
fmt.Printf("Sending user email to %s<%s>\n", u.name, u.email)
}
// admin represents an admin user with privileges.
type admin struct {
user
level string
}
// main is the entry point for the application.
func main() {
// Create an admin user.
ad := admin{
user: user{
name: "john smith",
email: "john@yahoo.com",
},
level: "super",
}
// Send the admin user a notification.
// The embedded inner type's implementation of the
// interface is "promoted" to the outer type.
// you won’t see the admin type implement the interface.
// Thanks to inner type promotion, the implementation of the interface by the
// the inner type has been promoted up to the outer type. That means the outer type now implements the interface,
sendNotification(&ad)

// We can access the inner type's method directly.
ad.user.notify()

// The inner type's method is promoted.
ad.notify()
}
// sendNotification accepts values that implement the notifier
// interface and sends notifications.
func sendNotification(n notifier) {
n.notify()
}
```

What if the outer type doesn’t want to use the inner type’s implementation because
it needs an implementation of its own? This code sample adds an implementation of the notifier interface by the admin type.

This shows how the inner type’s implementation was not promoted
once the outer type implemented the notify method. But the inner type is
always there, in and of itself, so the code is still able to call the inner type’s implementation
directly.

```go
// notify implements a method that can be called via
// a value of type admin.
func (a *admin) notify() {
fmt.Printf("Sending admin email to %s<%s>\n", a.name, a.email)
}

// caller in the main func

// Send the admin user a notification.
// The embedded inner type's implementation of the
// interface is NOT "promoted" to the outer type.
sendNotification(&ad)
// We can access the inner type's method directly.
ad.user.notify()
// The inner type's method is NOT promoted.
ad.notify()
````



## Interface

There is a naming convention in Go we follow when naming interfaces. If the
interface type contains only one method, the name of the interface ends with the er
suffix. This is the exact case for our interface, so the name of the interface is Matcher.
When multiple methods are declared within an interface type, the name of the interface
should relate to its general behavior.

An interface type is defined by a set of methods.
A value of interface type can hold any value that implements those methods.

```go
type User struct {
  FirstName, LastName string
}

func (u *User) Name() string {
  return fmt.Sprintf("%s %s", u.FirstName, u.LastName)
}

type Customer struct {
  id       int
  FullName string
}

func (c *Customer) Name() string {
  return fmt.Sprintf("%s is %d years old", c.FullName, c.id)
}


type Namer interface {
  Name() string
}

func Greet(n Namer) string {
  return fmt.Sprintf("Dear %s", n.Name())
}

func main() {
  u := &User{"Matt", "Ma"}
  fmt.Println(Greet(u))  // Dear Matt Ma
  c := &Customer{30, "Matt Ma"}
  fmt.Println(Greet(c)) // Dear Matt Ma is 30 years old
}
```

- Interfaces are satisfied implicitly

A type implements an interface by implementing the methods. (There is no explicit declaration of intent.)
Implicit interfaces decouple implementation packages from the packages that define the interfaces: neither depends on the other.
It also encourages the definition of precise interfaces, because you don’t have to find every implementation and tag it with the new interface name.

```go
// Package io defines Reader and Writer so you don’t have to.
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

  // os.Stdout implements Writer
  w = os.Stdout
  fmt.Fprintf(w, "hello, writer\n") // hello, writer
}
```
