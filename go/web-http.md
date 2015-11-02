 Vertical scaling, meaning increasing the amount of CPUs or capacity in a single
machine, or
 Horizontal scaling, meaning increasing the number of machines to increase capacity.

Go scales well vertically, with its excellent support for concurrent programming. A single
Go web application with a single operating system thread can be scheduled to run hundreds of
thousands of goroutines with efficiency and performance.
Just like any other web applications, Go can scale well horizontally as well by layering a
proxy above a number of instances of a Go web application. Go web applications are compiled
as static binaries, without any dynamic dependencies and can be distributed to systems that
do not even have Go built in.

While Go is statically typed, it has an interface mechanism that describes behavior and
allows dynamic typing. Functions can take in interfaces, which means we can introduce new
code into the system and still be able to use existing functions by implementing methods
required by that interface. Also, with a function that takes in an empty interface, we can put
any value as the parameter since all types implement the empty interface. Go implements a
number of features usually associated with functional programming, including function types,
functions as values and closures.

just write the documentation
above the source code itself and godoc will extract it along with the code to generate the
necessary documentation.

```go
package main
import (
"net/http"
)
func main() {
// handle static assets
// create a multiplexer that redirects a request to a handler
// net/http standard library provides a default multiplexer that can be created by
// calling the NewServeMux function
mux := http.NewServeMux()
// use the multiplexer to serve static files
// the FileServer function to create a handler that will serve files out from a given directory
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
Addr: "0.0.0.0:8080",
Handler: mux,
}
server.ListenAndServe()
}

func index(w http.ResponseWriter, r *http.Request) {
files := []string{"templates/layout.html",
"templates/navbar.html",
"templates/index.html",}
templates := template.Must(template.ParseFiles(files...))
threads, err := data.Threads(); if err == nil {
templates.ExecuteTemplate(w, "layout", threads)
}
}
```
