## [Errors](http://blog.golang.org/error-handling-and-go)

An error is anything that can describe itself as an error string.
The idea is captured by the predefined, built-in interface type, error, with its single method, Error, returning a string:

```go
type error interface {
    Error() string
}
```

```go
type MyError struct {
  When time.Time
  What string
}

func (e *MyError) Error() string {
  return fmt.Sprintf("at %v, %s",
    e.When, e.What)
}

func run() error {
  return &MyError{
    time.Now(),
    "it didn't work",
  }
}

func main() {
  if err := run(); err != nil {
    fmt.Println(err)
  }
}
```

The error handling in Go seems cumbersome and repetitive at first, but quickly becomes part of the way we think. Instead of creating exceptions that bubble up and might or might not be handled or passed higher, errors are part of the response and designed to be handled by the caller. Whenever a function might generate an error, its response should contain an error param.

In many cases `fmt.Errorf` is good enough, but since error is an interface, you can use arbitrary data structures as error values, to allow callers to inspect the details of the error.

- The error type

The error type is an interface type. An error variable represents any value that can describe itself as a string. Here is the interface's declaration:

```go
type error interface {
    Error() string
}
```

The most commonly used error implementation is the errors package's unexported `errorString` type.

```go
// errorString is a trivial implementation of error.
type errorString struct {
    s string
}

func (e *errorString) Error() string {
    return e.s
}
// Usage
// New returns an error that formats as the given text.
func New(text string) error {
    return &errorString{text}
}
```

- Build on top of error interface

The error interface requires only a Error method; specific error implementations might have additional methods. For instance, the net package returns errors of type error, following the usual convention, but some of the error implementations have additional methods defined by the net.Error interface:

```go
package net

type Error interface {
    error
    Timeout() bool   // Is the error a timeout?
    Temporary() bool // Is the error temporary?
}

// Usage
if nerr, ok := err.(net.Error); ok && nerr.Temporary() {
    time.Sleep(1e9)
    continue
}
if err != nil {
    log.Fatal(err)
}
```

- Simplifying repetitive error handling

In Go, error handling is important. The language's design and conventions encourage you to explicitly check for errors where they occur (as distinct from the convention in other languages of throwing exceptions and sometimes catching them). In some cases this makes Go code verbose, but fortunately there are some techniques you can use to minimize repetitive error handling.

To reduce the repetition we can define our own HTTP appHandler type that includes an error return value. ex: `type appHandler func(http.ResponseWriter, *http.Request) error`

```go
// Original
func init() {
    http.HandleFunc("/view", viewRecord)
}

func viewRecord(w http.ResponseWriter, r *http.Request) {
    c := appengine.NewContext(r)
    key := datastore.NewKey(c, "Record", r.FormValue("id"), 0, nil)
    record := new(Record)
    if err := datastore.Get(c, key, record); err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    if err := viewTemplate.Execute(w, record); err != nil {
        http.Error(w, err.Error(), 500)
    }
}
```

```go
// Updated: http package doesn't understand functions that return error. To fix this we can implement the http.Handler interface's ServeHTTP method on appHandler
type appHandler func(http.ResponseWriter, *http.Request) error

func viewRecord(w http.ResponseWriter, r *http.Request) error {
    c := appengine.NewContext(r)
    key := datastore.NewKey(c, "Record", r.FormValue("id"), 0, nil)
    record := new(Record)
    if err := datastore.Get(c, key, record); err != nil {
        return err
    }
    return viewTemplate.Execute(w, record)
}

// The ServeHTTP method calls the appHandler function and displays the returned error (if any) to the user
// Receive is func. The method invokes the function by calling the receiver in the expression fn(w, r).
func (fn appHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if err := fn(w, r); err != nil {
        http.Error(w, err.Error(), 500)
    }
}

// Now when registering viewRecord with the http package we use the Handle function (instead of HandleFunc) as appHandler is an http.Handler (not an http.HandlerFunc).
func init() {
    http.Handle("/view", appHandler(viewRecord))
}
```

make it more user friendly. give the user a simple error message with an appropriate HTTP status code, and logging the full error.

```go
type appError struct {
    Error   error
    Message string
    Code    int
}

type appHandler func(http.ResponseWriter, *http.Request) *appError

// And make `appHandler`'s ServeHTTP method display the `appError`'s Message to the user with the correct HTTP status Code and log the full Error to the developer console:
func (fn appHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if e := fn(w, r); e != nil { // e is *appError, not os.Error.
        c := appengine.NewContext(r)
        c.Errorf("%v", e.Error)
        http.Error(w, e.Message, e.Code)
    }
}
// Finally, we update viewRecord to the new function signature and have it return more context when it encounters an error:
func viewRecord(w http.ResponseWriter, r *http.Request) *appError {
    c := appengine.NewContext(r)
    key := datastore.NewKey(c, "Record", r.FormValue("id"), 0, nil)
    record := new(Record)
    if err := datastore.Get(c, key, record); err != nil {
        return &appError{err, "Record not found", 404}
    }
    if err := viewTemplate.Execute(w, record); err != nil {
        return &appError{err, "Can't display record", 500}
    }
    return nil
}
```


#### Error

`error` is a build in type in Go.

```go
func printer(msg string) (string, error) {
  msg += "\n"
  _, err := fmt.Printf("%s", msg)
  return msg, err
}
func main() {
  msg, err := printer("hello world") // hello world
  if err != nil {
    os.Exit(1)
  } else {
    fmt.Printf("%q", msg+" no err") // hello world\n no err
  }
}
```

- Two ways to define your Error: 1. fmt package   2. Error package

```go
// `Errorf` formats according to a format specifier and returns the string as
// a value that satisfies error. It can be used to show custom error
fmt.Errorf("Run into my custom err")

// Error package allow to define custom Error type import "errors"
// it allows to compare with variable to identify which error that user hit
var errorEmptyString = errors.New("Run into my custom err")
```

- Panic, Recover

**panic** and **recover** is not general used in Error case.
`panic(errorEmptyString)` The program is terminated with stack trace logs.
Only use `panic` with sth extremely case or when something went to extremely wrong.



## Error

three different ways to create errors. Super simple error handle in Go

1. `errors.New("some errors")`
2. `fmt.Errorf("%s", "some errors")`
3. satisfies Error interface

```go
func main() {
    err := Boom()
}
func Boom() error {
    return &Foo{}
}
type Foo struct {}
func (f *Foo) Error() string {
    return "some error"
}
```

Using `switch` statement to check the Error type for different errors
ex:  `switch e := err.(type) {}` assign to `e` variable so that we could use it later
Case statment has to be a type of Error, cannot be an instance of Error.
