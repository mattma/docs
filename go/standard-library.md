# [standard library](http://golang.org/pkg/)

Go standard library is a set of core packages that enhance and extend the language. No matter how you installed Go, all the source code for the standard library can be
found on your development machine in the $GOROOT/src/pkg folder. Since these packages
are tied to the language, they come with some special guarantees:

They will always exist for each minor release of the language.
 They will honor the backward-compatibility promise.
 They are part of the dev, build, and release process for Go.
 They are maintained and reviewed by Go contributors.
 They are tested and benchmarked with each new release of the language.

- summary

The standard library comes with special guarantees and is widely used by the
community.
 Using packages from the standard library makes it easier to manage and trust
your code.
 Well over 100 packages are organized within 38 different categories.
 The log package from the standard library has everything you need for logging.
 The standard library has two packages called xml and json that make working
with these data formats trivial.
 The io package supports working with streams of data very efficiently.
 Interfaces allow your code to compose with existing functionality.
 Reading code from the standard library is a great way to get a feel for idiomatic
Go.

#### How many

there are well over 100 packages
organized within 38 categories

```bash
# Set of top-level folders and packages in the standard library
archive bufio bytes compress container crypto database
debug encoding errors expvar flag fmt go
hash html image index io log math
mime net os path reflect regexp runtime
sort strconv strings sync syscall testing text
time unicode unsafe
```

## Packages

#### Log

UNIX architects added a device called stderr. This device
was created to be the default destination for logging. It allows developers to separate
their programs’ output from their logging. For a user to see both the output and the
logging when running a program, terminal consoles are configured to display what’s
written to both stdout and stderr. But if your program only writes logs, then it’s common
practice to write general logging information to stdout and errors or warnings
to stderr.

The purpose of logging is to get a trace of
what the program is doing, where it’s happening, and when. This is some of the information
that you can write on every log line with some configuration.

One nice thing about the log package is that loggers are multigoroutine-safe. This
means that multiple goroutines can call these functions from the same logger value at
the same time without the writes colliding with each other. The standard logger and
any customized logger you may create will have this attribute.

```go
func init() {
log.SetPrefix("TRACE: ")
log.SetFlags(log.Ldate | log.Lmicroseconds | log.Llongfile)
}
func main() {
// Println writes to the standard logger.
log.Println("message")
// Fatalln is Println() followed by a call to os.Exit(1).
log.Fatalln("fatal message")
// Panicln is Println() followed by a call to panic().
log.Panicln("panic message")
}
```

Declarations of the different logging methods

```go
func (l *Logger) Fatal(v ...interface{})
func (l *Logger) Fatalf(format string, v ...interface{})
func (l *Logger) Fatalln(v ...interface{})
func (l *Logger) Flags() int
func (l *Logger) Output(calldepth int, s string) error
func (l *Logger) Panic(v ...interface{})
func (l *Logger) Panicf(format string, v ...interface{})
func (l *Logger) Panicln(v ...interface{})
func (l *Logger) Prefix() string
func (l *Logger) Print(v ...interface{})
func (l *Logger) Printf(format string, v ...interface{})
func (l *Logger) Println(v ...interface{})
func (l *Logger) SetFlags(flag int)
func (l *Logger) SetPrefix(prefix string)
```

#### Encoding/Decoding

The first aspect of working with JSON we’ll explore is using the NewDecoder function
and Decode method from the json package. If you’re consuming JSON from a web
response or a file, this is the function and method you want to use.

If metadata tags are not present, the decoding and encoding process
will attempt to match against the field names directly in a case-insensitive way. When a
mapping can’t be made, the field in the struct value will contain its zero value.

```json
{
"responseData": {
    "results": [
        {
            "GsearchResultClass": "GwebSearch",
            "unescapedUrl": "https://www.reddit.com/r/golang",
            "url": "https://www.reddit.com/r/golang",
            "content": "First Open Source \u003cb\u003eGolang\u..."
        },
        {
            "GsearchResultClass": "GwebSearch",
            "unescapedUrl": "http://tour.golang.org/",
            "url": "http://tour.golang.org/",
            "title": "A Tour of Go",
        }
    ]
   }
}
```
```go
type (
    // gResult maps to the result document received from the search.
    gResult struct {
        GsearchResultClass string `json:"GsearchResultClass"`
        UnescapedURL       string `json:"unescapedUrl"`
        URL                string `json:"url"`
        Content            string `json:"content"`
        Title              string `json:"title"`
    }
    // gResponse contains the top level document.
    gResponse struct {
        ResponseData struct {
            Results []gResult `json:"results"`
        } `json:"responseData"`
    }
)

func main() {
    uri := "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=8&q=golang"
    // Issue the search against Google, retrieves a JSON document from Google.
    resp, err := http.Get(uri)
    if err != nil {
        log.Println("ERROR:", err)
        return
    }
    defer resp.Body.Close()

    // Decode the JSON response into our struct type.
    var gr gResponse
    // JSON document from the response is decoded into a
    // variable of the struct type `gResponse`
    // pass the address of a pointer variable of type gResponse, with the
    // value of nil, After the method call, the value of the pointer
    // variable will be assigned to a value of type gResponse and initialized based on the JSON document being decoded.
    err = json.NewDecoder(resp.Body).Decode(&gr)
    if err != nil {
        log.Println("ERROR:", err)
        return
    }

    fmt.Println(gr)
}
```

Sometimes the JSON documents you’re working with come to you as a string
value. In these cases, you need to convert the string into a byte slice ([]byte) and
use the Unmarshal function from the json package.

```go
// Contact represents our JSON string.
type Contact struct {
   Name    string `json:"name"`
   Title   string `json:"title"`
   Contact struct {
      Home string `json:"home"`
      Cell string `json:"cell"`
   } `json:"contact"`
}

// JSON contains a sample string to unmarshal.
var JSON = `{
   "name": "Gopher",
   "title": "programmer",
   "contact": {
   "home": "415.333.3333",
   "cell": "415.555.5555"
   }
}`

func main() {
   // Unmarshal the JSON string into our variable.
   var c Contact
   // takes a JSON document inside of a string variable
   // and uses the Unmarshal() to decode the JSON into a struct type value.
   err := json.Unmarshal([]byte(JSON), &c)
   if err != nil {
      log.Println("ERROR:", err)
      return
   }
   fmt.Println(c) // {Gopher programmer {415.333.3333 415.555.5555}}
}
```

Sometimes it’s not possible to declare a struct type and you need more flexibility to
work with the JSON document. In these cases you can decode or unmarshal the JSON
document into a map variable. Use above example, use a map variable
instead of our struct type variable. The map variable is declared as a map with a key of
type string and a value of type interface{}. This means the map can store any type of
value for any given key.

shows how you
need to convert the value of the contact key to another map with a key of type string
and a value of type interface{}. This can make using maps that contain JSON documents
sometimes unfriendly to work with. But if you never need to dig into the JSON
documents you’re working with or you plan to do very little manipulation, using a map
can be fast, and then there’s no need to declare new types.

```go
func main() {
   // Unmarshal the JSON string into our map variable.
   var c map[string]interface{}
   err := json.Unmarshal([]byte(JSON), &c)
   if err != nil {
      log.Println("ERROR:", err)
      return
   }
   fmt.Println("Name:", c["name"])
   fmt.Println("Title:", c["title"])
   fmt.Println("Contact")
   // required to access the home field from the contact subdocument.
   // Because the value for each key is of type interface{}, you need to convert the value to the proper native type in order to work with the value.
   fmt.Println("H:", c["contact"].(map[string]interface{})["home"])
   fmt.Println("C:", c["contact"].(map[string]interface{})["cell"])
}
```

- Encoding JSON

using the MarshalIndent function from the json package. The MarshalIndent function uses reflection to determine how to
transform the map type into a JSON string. This comes in handy when you want to publish a
pretty-printed JSON document from a Go map or struct type value. Marshaling is the
process of transforming data into a JSON string.

If you don’t need the pretty-print formatting for your JSON encoding, the json
package also provides a function called Marshal. This function is good for producing
JSON that could be returned in a network response, like a web API. The Marshal function
works the same as the MarshalIndent function, but without the parameters for
prefix and indent.

```go
func main() {
   // Create a map of key/value pairs.
   c := make(map[string]interface{})
   c["name"] = "Gopher"
   c["title"] = "programmer"
   c["contact"] = map[string]interface{}{
      "home": "415.333.3333",
      "cell": "415.555.5555",
   }

   // Marshal the map into a JSON string.
   // The MarshalIndent function returns a byte slice that represents the JSON string and an error value.
   // func MarshalIndent(v interface{}, prefix, indent string) ([]byte, error)
   data, err := json.MarshalIndent(c, "", " ")
   if err != nil {
      log.Println("ERROR:", err)
      return
   }

   fmt.Println(string(data))
}
```

#### input and output

One of the things that makes the UNIX-based operating systems so great is the idea
that the output of one program can be the input for another. In
this world the stdout and stdin devices serve as the conduits to move data between
processes.

This same idea has been extended to the io package, and the functionality that it
provides is amazing. The package supports working with streams of data very efficiently,
regardless of what the data is, where it’s coming from, or where it’s going.
Instead of stdout and stdin, you have two interfaces called io.Writer and
io.Reader. Values from types that implement these interfaces can be used against all
the functionality provided by the io package or any function and method in any other
package that also accepts values of these interface types. That’s the real beauty of creating
functionality and APIs from interfaces types. Developers can compose on top of
existing functionality, take advantage of what exists, and focus on the business problems
they’re trying to solve.

- Writer and Reader interfaces

The io package is built around working with values from types that implement the
io.Writer and io.Reader interfaces. The functions and methods that make up the io
package have no understanding about the type of data nor how that data is physically
read and written.

Write Documentation is that writes len(p) bytes from p to the underlying data stream. It
returns the number of bytes written from p (0 <= n <= len(p)) and any
error encountered that caused the write to stop early. Write must
return a non-nil error if it returns n < len(p). Write must not modify
the slice data, even temporarily.

They mean that the implementation
of the Write method should attempt to write the entire length of the byte
slice that’s passed in. But if that isn’t possible, then the method must return an error. The number of bytes reported as written can be less than the length of the byte slice,
but never more. Finally, the `byte` slice must never be modified in any way.

```go
// Declaration of the io.Writer interface
type Writer interface {
   // accepts a byte slice and returns two values.
   // first return value is the number of bytes written
   Write(p []byte) (n int, err error)
}
```

implementation should attempt to read the
entire length of the byte slice that’s passed in. It’s okay to read less than the entire
length, and it shouldn’t wait to read the entire length if that much data isn’t available
at the time of the call.

When
the last byte is read, two options are available. Read either returns the final bytes with
the proper count and EOF for the error value, or returns the final bytes with the proper count and nil for the error value. In the latter case, the next read must return
no bytes with the count of 0 and EOF for the error value.

When make the Read call. Any time the Read
method returns bytes, those bytes should be processed first before checking the error
value for an EOF or other error value.

Finally, the fourth rule requests that implementations
of the Read method never return a 0 byte read count with an error value of
nil. Reads that result in no bytes read should always return an error.

```go
// Declaration of the io.Reader interface
type Reader interface {
   Read(p []byte) (n int, err error)
}
```

Working with `io.Writer` and `io.Reader`

```go
// main is the entry point for the application.
func main() {
   // Create a Buffer value and write a string to the buffer.
   // Using the Write method that implements io.Writer.
   var b bytes.Buffer
   b.Write([]byte("Hello "))
   // Use Fprintf to concatenate a string to the Buffer.
   // Passing the address of a bytes.Buffer value for io.Writer.
   fmt.Fprintf(&b, "World!")
   // Write the content of the Buffer to the stdout device.
   // Passing the address of a os.File value for io.Writer.
   // accepts a value that implements the `io.Writer` interface
   b.WriteTo(os.Stdout) // Hello World!
}
```

`Fprintf` accepts values from types that implement the io.Writer interface. This means that the Buffer
type from the bytes package must implement this interface since we’re able to pass
the address of a variable of that type through

```go
// Fprintf formats according to a format specifier and writes to w. It
// returns the number of bytes written and any write error encountered.
func Fprintf(w io.Writer, format string, a ...interface{})
(n int, err error)
```
