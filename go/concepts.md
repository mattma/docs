## Introduction

- Why use Go, not C?

C is inherently a serial language. Various libraries, such as POSIX threads and OpenMP, make it possible to write multithreaded code in C, but it’s very hard to write code that scales well. Writing C code that scales to two, or even eight cores is quite difficult but not insanely hard. Writing C code that scales to 64 or 256 cores is very challenging.

Go was designed with concurrency in mind, does lots of things in parallel. It provides a number of mid-level abstractions, which provide high-level access to low-level features. Go compiler and runtime environment can easily run on a single core by simply timeslicing between the various parts, or many core machine by distributing the tasks across different threads. Go combines the best of both worlds (erlang and C). In single threaded performance, it is close to C, yet it encourages a programming style that scales well to large numbers of cores.

- Concurrency, GoRoutine, CSP

**CSP communicating sequential processes**

Hoare’s Communicating Sequential Processes (CSP) is for describing the foudamental concepts of concurrency. In CSP, a program is a parrellel composition of processes that have no shared state, the process communicate and synchronize using channels. It formalism to facilitate communication between goroutines. CSP defines communication channels that events can be sent down.

**GoRoutine**

A goroutine is a like function call that completes asynchronously. Conceptually, it runs in parallel, but the language does not define how this actually works in terms of real parallelism. A Go compiler may spawn a new operating system thread for every goroutine, or it may use a single thread and use timer signals to switch between them.

Creating a goroutine is intended to be much cheaper than creating a thread using a typical C threading library. The main reason is to use of segmented stacks in Go implementations. They treat the stack as a linked list of memory allocations. If there is enough space in the current stack page for their use, then they work like C functions; otherwise they will request that the stack grows. A short-lived goroutine will not use more than the 4KB initial stack allocation, so you can create a lot of them without exhausting your
address space, even on a 32-bit platform.

Goroutines are not intended to be implemented as kernel threads. The language does not make hard guarantees on their concurrency. Like Java threads or Erlang processes, a large number of goroutines can be multiplexed onto a small number of kernel threads. This means that context switches between goroutines is often cheaper than between POSIX threads.

- Type system

In Go, you may define methods on any concrete type that you define, not just on structures.

Data types categorize a set of related values, describe the operations that can be done on them and define the way they are stored. If you call a method on an expression with a static type directly, then the methods on it are just syntactic sugar on function calls. They are statically looked up and called.

Go interface support duck typing and don’t have to be explicitly adopted. Any type that implements the methods that an interface lists implicitly implements that interface. Interface types can be used as variable types. When you call any method on an interface-typed variable, it uses dynamic dispatch to find the correct method implementation.

**empty interface**

You can either define an interface specifying the methods that you require, or use the empty interface, which can be used to represent any type (including primitive types) if you are just storing values and don’t need to call any methods. It allows you to avoid explicit type annotations on most variable declarations. If you combine initialization with declaration, then the compiler will infer the variable’s type from the type of the expression assigned to it.

- Garbage collection

Garbage collection (automatically) means that you don’t have to think about when to deallocate memory. In Go, you explicitly allocate values, but they are automatically reclaimed when they are no longer required. As with other garbage collected languages, it is still possible to leak objects if you accidentally keep references to them after you stop using them.

In single-threaded code, garbage collection is a luxury(not a vital feature). In multi-threaded code. If you are sharing pointers to an object between multiple threads, then working out exactly when you can destroy the object is incredibly hard. Even implementing something like reference counting is hard. Acquiring a reference in a thread requires an atomic increment operation, and you have to be very careful that objects aren’t prematurely deallocated by race conditions.

Go does not explicitly differentiate between stack and heap allocations. Memory is just memory. If you create an object with local scope, then current implementations will allocate it on the stack unless it has its address taken somewhere.

Because Go is designed for concurrency, the memory model defines explicitly what to expect when two goroutines touch the same memory: in short, there are no guarantees. Go does not enforce any constraints on the order that memory accesses occur with regard to each other. The compiler is free to reorder any memory accesses within a goroutine, as long as that reordering does not alter the semantics of the goroutine running in isolation.

Although the statements reading and writing the values of the two variables are no longer in the same order, it is not possible for the user to distinguish the difference. This means that you have to be very careful when using shared memory from two goroutines: if either variable in this example is shared then this kind of optimization would have confusing consequences. In general, it’s a good idea to only share readonly structures.

- Syntax

Every Go program must start with a package declaration, ex: `package main`. Every program must contain a `main` package, which contains a `main()`` function, which is the program entry point. Packages are Go's way of organizing and reusing code.

There are two types of Go programs: executables and libraries. Executable applications are the kinds of programs that run directly from the terminal. Libraries are collections of code that we package together so that we can use them in other programs, like libraries or modules in other languages.

Go only provides access control at the package level, while Java provides it at the class level.

Variadic functions in Go are particularly interesting. In C, a variadic function call just pushes extra parameters onto the stack, and
the callee has to know how to pop them off. In Go, the variadic parameters, as a slice, must all be of the same type, although you can use the empty interface type (interface{}) to allow variables of any type and then use type introspection to find out what they really are.

Calling functions that return multiple values. The return values must either all be ignored, or all assigned to variables. The blank identifier, `_`, can be used for values that you wish to discard.

Command line arguments and environment variables are stored globally in Go, making it easy to access them from any function, not just one near the program entry point (`main()` in `package main` does not take any parameters).

## Build-in Types

Bytes are an extremely common unit of measurement used on computers (1 byte = 8 bits, 1024 bytes = 1 kilobyte, 1024 kilobytes = 1 megabyte, …) and therefore Go's byte data type is often used in the definition of other types.

`uint` means "unsigned integer", only contain positive numbers or zero. `int` means"signed integer". 8, 16, 32 and 64 tell us how many bits each of the types use.

Floating point numbers are numbers that contain a decimal component.

String literals can be created using double quotes "Hello World" which can contain newlines and they allow special escape sequences, or back ticks `Hello World`, use in multi lines, excaping characters.


- Types list

bool
string: by default, type is rune (works for unicode character), not byte.

uint: either 32 or 64 bits
uintptr: un unsigned integer large enough to store the uninterpreted bits of a pointer value
uint8/byte: unsigned, 8-bits integers ( 0 to 255 )
uint16: unsigned, 16-bits integers ( 0 to 65535 )
uint32: unsigned, 32-bits integers ( 0 to 4294967295 )
uint64: unsigned, 64-bits integers ( 0 to 18446744073709551615 )

int: either 32 or 64 bits
int8: signed, 8-bits integers ( -128 to 127 )
int16: signed, 16-bits integers ( -32768 to 32767 )
int32/rune: signed, 32-bits integers ( -2147483648 to 2147483647 ). Like a Character, Unicode
int64: signed, 64-bits integers ( -9223372036854775808 to 9223372036854775807)

float32: the set of all IEEE-754 32-bit floating-point numbers. Refer as single precision
float64: the set of all IEEE-754 64-bit floating-point numbers. Refer as double precision (Recommend using when floating numbers)

complex64: the set of all complex numbers with float32 real and imaginary parts
complext128: the set of all complex numbers with float64 real and imaginary parts

byte: alias for uint8
rune: alias for int32 (represents a Unicode code point)

array
slice: Recommend to use. a segment of an array
struct: define OO type of contracts. Go does not have classes.

function
interface
map
channel
