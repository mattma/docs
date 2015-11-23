# Interface

Interfaces are types that declare behavior and provide polymorphism. This behavior is never implemented by the interface type directly but instead by user defined types via methods. When a user defined type implements the set of methods declared by an interface type, values of the user defined type can be assigned to values of the interface type. This assignment stores the value of the user defined type into the interface value.

Once a type implements an interface, an entire world of functionality can be opened up to values of that type.

If a method call is made against an interface value, the equivalent method for the stored user defined value is executed. Since any user-defined type can implement any interface, method calls against an interface value are polymorphic in nature. The user defined type in this relationship is often called a concrete type, since interface values have no concrete behavior without the implementation of the stored user-defined value. There are rules around whether values or pointers of a user-defined type satisfy the implementation of an interface. Not all values are created equal.

you see what the value of the interface variable looks like after the
assignment of the user type value (graph below). Interface values are two-word data structures. The first word contains a pointer to an internal table called an iTable, which contains type information about the stored value. The iTable contains the type of value that has been stored and a list of methods associated with the value. The second word is a pointer to the stored value. The combination of type information and pointer binds the relationship between the two values.


```bash
var n notifier
# type value assignment  or  type pointer assignment
n = user{"bill"}  or  n = &user{"bill"}

# Interface value. ex: notifier
Address   ------------------------------------>   iTable
                                               Type(user) or Type(*user)
                                               Method set
Address              Stored value
ex: user    -------->   User
```


## Interface

#### Interface naming convention

If the interface type contains only one method, the name of the interface ends with the *er* suffix.

When multiple methods are declared within an interface type, the name of the interface should relate to its general behavior.

#### Definition

An interface type is defined by a set of methods. A value of interface type can hold any value that implements those methods.

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
  fmt.Println(Greet(u)) // Dear Matt Ma
  c := &Customer{30, "Matt Ma"}
  fmt.Println(Greet(c)) // Dear Matt Ma is 30 years old
}
```

**Interfaces are satisfied implicitly**

A type implements an interface by implementing the methods. There is no explicit declaration of intent. Implicit interfaces decouple implementation packages from the packages that define the interfaces: neither depends on the other. It also encourages the definition of precise interfaces, because you don’t have to find every implementation and tag it with the new interface name.

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
  // os.Stdout implements Writer
  var w Writer = os.Stdout
  fmt.Fprintf(w, "hello, writer\n") // hello, writer
}
```
