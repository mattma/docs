- Unit testing

A unit test is a function that tests a specific piece or set of code from a package or program.
The job of the test is to determine whether the code in question is working as
expected for a given scenario.

A test function must be an exported function that begins with the word Test. Not only must the function start with the word Test, it must have a signature that
accepts a pointer of type testing.T and returns no value. If we don’t follow these
conventions, the testing framework won’t recognize the function as a test function
and none of the tooling will work against it.

The pointer of type testing.T is important. It provides the mechanism for reporting
the output and status of each test. There’s no one standard for formatting the output
of your tests. I like the test output to read well, which does follow the Go idioms
for writing documentation. For me, the testing output is documentation for the code.
The test output should document why the test exists, what’s being tested, and the
result of the test in clear complete sentences that are easy to read.

```go
// Sample test to show how to write a basic unit test.
package listing01
// testing framework to report the output and status of any test.
import "testing"
// TestDownload validates the http Get function can download content.
func TestDownload(t *testing.T) {
    t.Log("Given the need to test downloading content.")
    t.Logf("\tWhen checking \"%s\" for status code \"%d\"", url, statusCode)
    t.Fatal("\t\tShould be able to make the Get call.", ballotX, err)
    t.Errorf("\t\tShould receive a \"%d\" status. %v %v", statusCode, ballotX, resp.StatusCode)
}
```

`t.Fatal` method not only reports the
unit test has failed, but also writes a message to the test output and then stops the execution
of this particular test function. If there are other test functions that haven’t run
yet, they’ll be executed. A formatted version of this method is named `t.Fatalf`.

When we need to report the test has failed but don’t want to stop the execution of
the particular test function, we can use the `t.Error` family of methods.

- Table tests

When you’re testing code that can accept a set of different parameters with different
results, a table test should be used. A table test is like a basic unit test except it maintains
a table of different values and results. The different values are iterated over and
run through the test code. With each iteration, the results are checked. This helps to
leverage a single test function to test a set of different values and conditions.

- mock

the standard library has a package called `httptest` that will let
you mock HTTP-based web calls. Mocking is a technique many developers use to simulate
access to resources that won’t be available when tests are run. The httptest package
provides you with the ability to mock requests and responses from web resources
on the internet.


The mockServer function in listing 9.13 is declared to return a pointer of type
httptest.Server. The httptest.Server value is the key to making all of this work.
The code starts out with declaring an anonymous function that has the same signature
as the http.HandlerFunc function type.

```go
// feed is mocking the XML document we except to receive.
var feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
...
</rss>`

// mockServer returns a pointer to a server to handle the get call.
// mockServer that leverages the support inside the httptest package to simulate a call to a real server on the internet.
func mockServer() *httptest.Server {
    f := func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(200)
        w.Header().Set("Content-Type", "application/xml")
        fmt.Fprintln(w, feed)
    }
    // returned via a pointer
    return httptest.NewServer(http.HandlerFunc(f))
}
```

```go
func TestDownload(t *testing.T) {
    server := mockServer()
    defer server.Close()
    t.Log("Given the need to test downloading content.")
    t.Logf("\tWhen checking \"%s\" for status code \"%d\"", server.URL, statusCode)
    // ...
}
```
