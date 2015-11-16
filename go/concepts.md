`.a`file, These files are special static Go libraries that the Go build tools create and use
when compiling and linking your final programs together. This helps the build process
to be fast. But there’s no way to specify these files when performing a build, so
you can’t share them. The Go tooling knows when it can use an existing .a file and
when it needs to rebuild one from the source code on your machine.



When you’re writing code that will live in its own package, it’s good practice to name the package the same as the folder the code is in.
All the Go tooling expects this convention, so it’s a good practice to follow.


When an identifier starts with a lowercase letter, the identifier is unexported or
unknown to code outside the package. When an identifier starts with an uppercase letter,
it’s exported or known to code outside the package.

First, identifiers are exported or unexported, not
values. Second, the short variable declaration operator is capable of inferring the type
and creating a variable of the unexported type. You can never explicitly create a variable
of an unexported type, but the short variable declaration operator can.

```go
// entities/entities.go
// -----------------------------------------------------------------------
// Package entities contains support for types of
// people in the system.
package entities
// an unexported struct type named user is declared.
// It contains two exported fields named Name and Email.
type user struct {
Name string
Email string
}
// an exported struct type named Admin is declared
type Admin struct {
user // The embedded type is unexported.
Rights int
}

// listing74.go
// -----------------------------------------------------------------------
// Sample program to show how unexported fields from an exported
// struct type can't be accessed directly.
package main
import (
"fmt"
"github.com/goinaction/code/chapter5/listing74/entities"
)
// main is the entry point for the application.
func main() {
    //Since the user inner type is unexported, this code can’t
// access the inner type to initialize it inside the struct literal.
// Even though the inner type
// is unexported, the fields declared within the inner type are exported. Since the identifiers
// from the inner type are promoted to the outer type, those exported fields are
// known through a value of the outer type.
// Create a value of type Admin from the entities package.
a := entities.Admin{
Rights: 10,
}

// the Name and Email fields from the unexported inner
// type can be accessed and initialized through the outer type variable a. There’s no
// access to the inner type directly, since the user type is unexported.
// Set the exported fields from the unexported // inner type.
a.Name = "Bill"
a.Email = "bill@email.com"
fmt.Printf("User: %v\n", a)
}
```

## Introduction

#### Why use Go, not C?

C is inherently a serial language. Various libraries, such as POSIX threads and OpenMP, make it possible to write multithreaded code in C, but it’s very hard to write code that scales well. Writing C code that scales to two, or even eight cores is quite difficult but not insanely hard. Writing C code that scales to 64 or 256 cores is very challenging.

Go was designed with concurrency in mind, does lots of things in parallel. It provides a number of mid-level abstractions, which provide high-level access to low-level features. Go compiler and runtime environment can easily run on a single core by simply timeslicing between the various parts, or many core machine by distributing the tasks across different threads. Go combines the best of both worlds (erlang and C). In single threaded performance, it is close to C, yet it encourages a programming style that scales well to large numbers of cores.

Go’s built-in concurrency features, our software will scale to use the resources available without forcing us to use special threading libraries.

Go uses a simple and effective type system that takes much of the overhead out of object-oriented development and lets us focus on code reuse.

Go has a garbage collector, so we don’t have to manage our own memory.


#### CSP, Concurrency, GoRoutine

**CSP**

Hoare’s Communicating Sequential Processes (CSP) is for describing the foudamental concepts of concurrency. In CSP, a program is a parrellel composition of processes that have no shared state, the process communicate and synchronize using channels. It formalism to facilitate communication between goroutines. CSP defines communication channels that events can be sent down.

**GoRoutine**

Goroutines are functions that run concurrently with other goroutines, including the entry point of our program. In other languages, we’d use threads to accomplish the same thing, but in Go many goroutines execute on a single thread. Goroutines use less memory than threads and the Go runtime will automatically schedule the execution of goroutines against a set of configured logical processors. Each logical processor is bound to a single OS thread. This makes our application much more efficient with significantly less development effort.

A goroutine is a like function call that completes asynchronously. Goroutines are not intended to be implemented as kernel threads. Conceptually, it runs in parallel, but the language does not define how this actually works in terms of real parallelism. A Go compiler may spawn a new operating system thread for every goroutine, or it may use a single thread and use timer signals to switch between them. Like Java threads or Erlang processes, a large number of goroutines can be multiplexed onto a small number of kernel threads. This means that context switches between goroutines is often cheaper than between POSIX threads.

Creating a goroutine is intended to be much cheaper than creating a thread using a typical C threading library. The main reason is to use of segmented stacks in Go implementations. They treat the stack as a linked list of memory allocations. If there is enough space in the current stack page for their use, then they work like C functions; otherwise they will request that the stack grows. A short-lived goroutine will not use more than the 4KB initial stack allocation, so you can create a lot of them without exhausting your address space, even on a 32-bit platform.

Concurrency and synchronization is accomplished by launching goroutines and using channels.

**Channels**

Channels are data structures that let us send typed messages between goroutines with synchronization built in. Channels are data structures that enable safe data communication between goroutines. This facilitates a programming model where we send data between goroutines, rather than letting the goroutines fight to use the same data. The hardest part of concurrency is ensuring that our data isn’t unexpectedly modified by concurrently running processes, threads, or goroutines. Channels help to enforce the pattern that only one goroutine should modify the data at any time.

```bash
Goroutines
  ||
  =>  Channel (send data)  => Goroutines
                              ||
                              =>  Channel (send data)  => Goroutines
```

Three goroutines and two unbuffered channels. The first goroutine passes a data value through the channel to a second goroutine that is already waiting. The exchange of the data between both goroutines is synchronized and once the hand off occurs, both goroutines know the exchange took place. After the second goroutine performs its tasks with the data, it then sends the data to a third goroutine that is waiting. Again, that exchange is also synchronized and both goroutines can have guarantees the exchange has been made. This safe exchange of data between goroutines requires no other locks or synchronization mechanisms.

It is important to note that channels do not provide data access protection between goroutines. If copies of data are exchanged through a channel, then each goroutine has their own copy and can make any changes to that data safely. If pointers to the data are being exchanged, each goroutine still needs to be synchronized if reads and writes are going to be performed by the different goroutines.


#### SSL, TLS, HTTP(S)

**SSL**

Secure Socket Layer is a protocol that provides data encryption and authentication between two parties, usually a client and a server, using Public Key Infrastructure (PKI).

**TLS**

SSL was originally developed by Netscape, and was later taken over by the IETF, who renamed it to TLS.

**HTTPS or HTTP**

HTTP layered over an SSL/TLS connection.

An SSL/TLS certificate is used to provide data encryption and authentication. An SSL certificate is a X.509 formatted piece of data that contains some information, as well as a public key, stored at a web server. SSL certificates are usually signed by a certificate authority (CA), which assures the authenticity of the certificate. When the client makes a request to the server, it returns with the certificate. If the client is satisfied that the certificate is authentic, it will generate a random key and use the certificate (or more specifically the public key in the certificate) to encrypt it. This symmetric key is the actual key used to encrypt the data between the client and the server.

In SSL, the certificates can be saved in files of different formats. One of them is the PEM format file (Privacy Enhanced Email), which is a Base64-encoded DER X.509 certificate enclosed between "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----".


#### Type

In Go, you may define methods that operate on that data on any concrete type that you define, not just on structures. Embed types to reuse functionality in a design pattern called **composition**.

Data types categorize a set of related values, describe the operations that can be done on them and define the way they are stored. If you call a method on an expression with a static type directly, then the methods on it are just syntactic sugar on function calls. They are statically looked up and called.

**Types list**

bool
string: by default, type is rune (works for unicode character), not byte.

uint: 32 or 64 bits
uintptr: unsigned integer large enough to store the uninterpreted bits of a pointer value
uint8/byte: unsigned, 8-bits integers ( 0 to 255 )
uint16: unsigned, 16-bits integers ( 0 to 65535 )
uint32: unsigned, 32-bits integers ( 0 to 4294967295 )
uint64: unsigned, 64-bits integers ( 0 to 18446744073709551615 )

int: 32 or 64 bits
int8: signed, 8-bits integers ( -128 to 127 )
int16: signed, 16-bits integers ( -32768 to 32767 )
int32/rune: signed, 32-bits integers ( -2147483648 to 2147483647 )
int64: signed, 64-bits integers ( -9223372036854775808 to 9223372036854775807)

float32: the set of all IEEE-754 32-bit floating-point numbers. Refer as single precision
float64: the set of all IEEE-754 64-bit floating-point numbers. Refer as double precision (Recommend using when floating numbers)

complex64: the set of all complex numbers with float32 real and imaginary parts
complext128: the set of all complex numbers with float64 real and imaginary parts

byte: alias for uint8
rune: alias for int32 (represents a Unicode code point or character)

array
slice: (Recommended). a segment of an array
struct: define type of contracts. Go does not have classes.

function
interface
map
channel


#### Interface

Interfaces allow us to express the behavior of a type. If a value of a type implements an interface, it means the value has a specific set of behaviors. If our type implements the methods of an interface, a value of our type can be stored in a value of that interface type. No special declarations are required.

Go has a unique interface implementation that allows us to model behavior, rather than modeling types. We don’t need to declare that we’re implementing an interface in Go; the compiler does the work of determining whether values of our types satisfy the interfaces we’re using. Many interfaces in Go’s standard library are very small, exposing only a few functions.

Go interface support duck typing and don’t have to be explicitly adopted. Any type that implements the methods that an interface lists implicitly implements that interface. Interface types can be used as variable types. When you call any method on an interface-typed variable, it uses dynamic dispatch to find the correct method implementation.

**empty interface**

You can either define an interface specifying the methods that you require, or use the empty interface, which can be used to represent any type (including primitive types) if you are just storing values and don’t need to call any methods. It allows you to avoid explicit type annotations on most variable declarations. If you combine initialization with declaration, then the compiler will infer the variable’s type from the type of the expression assigned to it.

empty interface type, which means it can take in any type. It provide the flexibility of accepting different types, using interfaces. Interfaces in Go are constructs that are sets of methods and are also types. An empty interface is then an empty set, meaning any type can be an empty interface; we can pass any type into this function.


#### Garbage collection

Garbage collection (automatically) means that you don’t have to think about when to deallocate memory. In Go, you explicitly allocate values, but they are automatically reclaimed when they are no longer required. As with other garbage collected languages, it is still possible to leak objects if you accidentally keep references to them after you stop using them.

In single-threaded code, garbage collection is a luxury(not a vital feature). In multi-threaded code. If you are sharing pointers to an object between multiple threads, then working out exactly when you can destroy the object is incredibly hard. Even implementing something like reference counting is hard. Acquiring a reference in a thread requires an atomic increment operation, and you have to be very careful that objects aren’t prematurely deallocated by race conditions.

Go does not explicitly differentiate between stack and heap allocations. Memory is just memory. If you create an object with local scope, then current implementations will allocate it on the stack unless it has its address taken somewhere.

Because Go is designed for concurrency, the memory model defines explicitly what to expect when two goroutines touch the same memory: in short, there are no guarantees. Go does not enforce any constraints on the order that memory accesses occur with regard to each other. The compiler is free to reorder any memory accesses within a goroutine, as long as that reordering does not alter the semantics of the goroutine running in isolation.

Although the statements reading and writing the values of the two variables are no longer in the same order, it is not possible for the user to distinguish the difference. This means that you have to be very careful when using shared memory from two goroutines: if either variable in this example is shared then this kind of optimization would have confusing consequences. In general, it’s a good idea to only share readonly structures.

- compiler

The
compiler will always look for the packages we import at the locations referenced by the
GOROOT and GOPATH environment variables

```go
GOROOT="/Users/me/go"
GOPATH="/Users/me/spaces/go/projects"
```

- Variable zero value

In Go, all variables are initialized to their zero value. For numeric types, that value is
0; for strings it is an empty string; for boolean it is false; and for pointers, the zero
value is nil. When it comes to reference types, there are underlying data structures that
are initialized to their zero values. But variables declared as a reference type set to their
zero value will return the value of nil.

A good rule of thumb when declaring variables is to use
the keyword var when declaring variables that will be initialized to their zero value, and
to use the short variable declaration operator when you’re providing extra initialization or
making a function call.

- Packages

All Go programs are organized into groups of files called , so packages that code has the
ability to be included into other projects as smaller reusable pieces.

All .go files must declare the package that they belong to as the first line of the file
excluding whitespace and comments. Packages are contained in a single directory. We
may not have multiple packages in the same directory, nor may we split a package across
multiple directories. This means that all .go files in a single directory must declare the
same package name.

The convention for naming our package is to use the name of the directory containing it.

The package name main has special meaning in Go. It designates to the Go command
that this package is intending to be compiled into a binary executable. All of the
executable programs we build in Go must have a package called main. The main() function is the
entry point for the program so without one, the program has no starting point.

- Syntax

Every Go program must start with a package declaration, ex: `package main`. Every program must contain a `main` package, which contains a `main()`` function, which is the program entry point. Packages are Go's way of organizing and reusing code.

function main declared. For the
build tools to produce an executable, the function main must be declared and it becomes
the entry point for the program. If our main
function doesn’t exist in package main, the build tools won’t produce an executable. Every code file in Go belongs to a package, and main.go is no exception.

a package defines a unit of
compiled code, and each unit of code represents a package.

Every code file belongs to a package and that package name should be the same as the
folder the code file exists in.

All init functions in any code file that are part of the program will get called before
the main function. This init function sets the logger from the standard library to write
to the stdout device.

Once the compiler sees the init
function, it is scheduled to be called prior to the main function being called.

There are two types of Go programs: executables and libraries. Executable applications are the kinds of programs that run directly from the terminal. Libraries are collections of code that we package together so that we can use them in other programs, like libraries or modules in other languages.

Go only provides access control at the package level, while Java provides it at the class level.

In Go, once the main function returns, the program terminates. Any goroutines that
were launched and are still running at this time will also be terminated by the Go
runtime. When we write concurrent programs, it’s best to cleanly terminate any
goroutines that were launched prior to letting the main function return. Writing
programs that can cleanly start and shut down help reduce bugs and prevent resources
from corruption.

```go
// A WaitGroup is a great way to track when a goroutine is finished performing its work.
// As each goroutine completes their work, it will
// decrement the count of the WaitGroup variable, and once the variable gets to zero,
// we’ll know all the work is done.
// Setup a wait group so we can process all the feeds.
var waitGroup sync.WaitGroup
// Set the number of goroutines we need to wait for while
// they process the individual feeds.
waitGroup.Add(len(feeds))


go func() {
46 // Wait for everything to be processed.
47 waitGroup.Wait()
48
49 // Close the channel to signal to the Display
50 // function that we can exit the program.
51 close(results)
52 }()
```

- import

The import statement tells the compiler where to look on disk to find the package
we’re wanting to import.

Packages are found on disk based on their relative path to the directories referenced
by the Go environment. Packages in the standard library are found under where Go is
installed on our computer. Packages that are created by us or other Go developers live
inside the GOPATH, which is our own personal workspace for packages.


The compiler
would look for the net/http package in the following order:

```bash
$GOROOT/src/pkg/net/http
$GOPATH/myproject/src/net/http
$GOPATH/mylibraries/src/net/http
```
The important thing to remember is that the Go installation directory is the
first place the compiler looks, then each directory listed in our GOPATH in the order that
they are listed.

The compiler will stop searching once it finds a package that satisfies the import
statement.

1. Named imports  `import myfmt "mylib/fmt"`
2. Blank identifier
The _ (underscore character) is known as the blank identifier and
has many uses within Go. It’s used when we want to throw away
the assignment of a value, including the assignment of an import to
its package name, or ignoring return values from a function when
we’re only interested in the others.

- Init

Each package has the ability to provide as many init functions as necessary to be
invoked at the beginning of execution time. All the init functions that are discovered
by the compiler are scheduled to be executed prior to the main function being executed.
The init functions are great for setting up our packages, initializing variables, or
performing any other bootstrapping we may need prior to the program running.


- Variadic functions

It meaning it can take zero or more parameters. This allows us to pass any number of template files to the function. Variadic parameters need to be the last parameter for the function.

In C, a variadic function call just pushes extra parameters onto the stack, and the callee has to know how to pop them off. In Go, the variadic parameters, as a slice, must all be of the same type, although you can use the empty interface type (interface{}) to allow variables of any type and then use type introspection to find out what they really are.

Calling functions that return multiple values. The return values must either all be ignored, or all assigned to variables. The blank identifier, `_`, can be used for values that you wish to discard.

Command line arguments and environment variables are stored globally in Go, making it easy to access them from any function, not just one near the program entry point (`main()` in `package main` does not take any parameters).

## Build-in Types

Bytes are an extremely common unit of measurement used on computers (1 byte = 8 bits, 1024 bytes = 1 kilobyte, 1024 kilobytes = 1 megabyte, …) and therefore Go's byte data type is often used in the definition of other types.

`uint` means "unsigned integer", only contain positive numbers or zero. `int` means"signed integer". 8, 16, 32 and 64 tell us how many bits each of the types use.

Floating point numbers are numbers that contain a decimal component.

String literals can be created using double quotes "Hello World" which can contain newlines and they allow special escape sequences, or back ticks `Hello World`, use in multi lines, excaping characters.

