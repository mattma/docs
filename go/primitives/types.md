# Types

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

The type assertion doesn’t have to be done on an empty interface. It’s often used when you have a function taking a param of a specific interface but the function inner code behaves differently based on the actual object type.

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
                fmt.Println(str)
        case Stringer:
                fmt.Println(str.String())
} }
func main() {
        s := &fakeString{"Ceci n'est pas un string"}
        printString(s)
        printString("Hello, Gophers")
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
