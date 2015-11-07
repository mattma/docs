# Go Web Programming

## Concept

- Vertical scaling: increasing the amount of CPUs or capacity in a single machine
- Horizontal scaling: increasing the number of machines to increase capacity

Go scales well vertically (concurrency), a single Go webapp with a single OS thread can be scheduled to run hundreds of
thousands of GoRoutines with efficiency and performance.

Go scale well horizontally as well by layering a proxy above a number of instances of a Go webapp. Go webapp are compiled
as static binaries, without any dynamic dependencies and can be distributed to systems that do not even have Go built in.

While Go is statically typed, it has an interface mechanism that describes behavior and allows dynamic typing. Functions
can take in interfaces, which means we can introduce new code into the system and still be able to use existing functions
by implementing methods required by that interface. Also, with a function that takes in an empty interface, we can put
any value as the parameter since all types implement the empty interface. Go implements a number of features usually associated
with functional programming, including function types, functions as values and closures.

```go
func main() {
	// create a multiplexer that redirects requests to handlers
	// `net/http` provides a default multiplexer via `NewServeMux` function
	mux := http.NewServeMux()
	// use the multiplexer to serve static files
	// FileServer function to create a handler that will serve files out from a given directory
	files := http.FileServer(http.Dir("/public"))
	// pass the handler to the Handle function of the multiplexer.
	// the StripPrefix function to remove the given prefix from the request URL's path
	mux.Handle("/static/", http.StripPrefix("/static/", files))

	// we are telling the server that for all request URLs starting with /static/
	// strip off the string /static/ from the URL, then look for a file with the name
	// starting at the public directory. For example, if there is a request for the file
	// Request is http://localhost/static/css/bootstrap.min.css
	// Server looks for  <application root>/css/bootstrap.min.css

	// To redirect the root URL to a handler function, we use the HandleFunc function:
	mux.HandleFunc("/", index)
	// starting up the server
	server := &http.Server{
		Addr:    "0.0.0.0:8080",
		Handler: mux,
	}
	server.ListenAndServe()
}

func index(w http.ResponseWriter, r *http.Request) {
}
```

## net/http

`net/http` library is divided into 2 parts, with various structs and functions support either one of (or both):

1. Client  – Header, Request, Cookie, Client, Response,
2. Server – Header, Request, Cookie, Server, ServeMux, Handler/HandleFunc, ResponseWriter

#### Server

net/http library provides capabilities to start up a HTTP server that handle requests and sends responses to those requests. It also provides an interface for a multiplexer, and a default multiplexer.

- ListenAndServe. (simple, but no config allowed)

Go provides a set of libraries to create a web server. `ListenAndServe` func with the first parameter being the network address and the second parameter being the handler to take care of the requests. If the network address is an empty string, the default is all network interfaces at port 80. If the handler parameter is `nil`, the default multiplexer, `DefaultServeMux` is used.

```go
func main() {
    http.ListenAndServe("", nil)
}
```

- `Server` struct (with server config)

```go
func main() {
    server := http.Server{
        Addr: "127.0.0.1:8080",
        Handler: nil,
    }
    server.ListenAndServe()
}
```

```go
// Server struct configuration
type Server struct {
    Addr           string
    Handler        Handler
    ReadTimeout    time.Duration
    WriteTimeout   time.Duration
    MaxHeaderBytes int
    TLSConfig      *tls.Config
    TLSNextProto   map[string]func(*Server, *tls.Conn, Handler)
    ConnState      func(net.Conn, ConnState)
    ErrorLog       *log.Logger
}
```

- HTTPS

HTTPS encrypt and protect the communications between the client and the server when confidential information like passwords and credit card information is shared.

```go
func main() {
    server := http.Server{
        Addr:    "127.0.0.1:8080",
        Handler: nil,
    }
    // cert.pem: SSL certificate.  key.pem is the private key for the server
    server.ListenAndServeTLS("cert.pem", "key.pem")
}
```
