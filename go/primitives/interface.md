
## Interface

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
