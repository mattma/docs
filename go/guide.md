Memory model:
Constant/Static instrcution  =>  stacks(in Go, each GoRoutine has its own stack, but local variable does not save in stack, save in the heap)  => Heap


slash := new(Artist)
# instruct Go program to create an structure on the heap, and give an reference back

slash := &Artist{}
# also init the value here
# create a local variable on the stack, and require its address
# because in Go,when you request a local variable, will create an new instance of Struct on the heap, basically equal to `new`



make VS new

new will allocate the memory for you, set initialize value (in memory address location) to zero
make will allocate the memory for you, set initialize value in memory address location

channel also need initialization, so it use `make`


unbuffer channel: it need to write to the channel, you need to have something listening the channel

buffer channel: write to the channel without blocking, channel can hold `capacity` value until it blocks on write.


Mark and Sweep

1st, GC will mark accessible entities, 2nd, GC remove all inaccessible ones.  Go is currently transitioning from a stop-the-world model to a concurrency model



ServeMux = http request router = multiplexor = mux

compares incoming requests against a list of predefined URL paths and calls the associated handler for the path whenever a match is found


muteness are something else


Handlers

responsible for writing response headers and bodies. Almost any type(“object”) can be a handler, so long as it satisfies the `http.Handler` interface. In lay terms, that simply means it must have a ServeHTTP method method with the following signature:

`ServeHTTP(http.ResponseWriter, *http.Request)`


## Book start here

Go code is organize d into packages, which are simi lar
to librar ies or modules in other langu ages. A package consists of one or more .go source files
in a single direc tor y that define what the package does. Each source file beg ins with a package
de clarat ion, here package main, that states which package the file belongs to, followed by a list
of other packages that it imports, and then the declarat ions of the program that are stored in
that file.

Package main is speci al. It defines a standalone executable program, not a librar y. Within
package main the function main is also speci al—it’s where execution of the program beg ins.
Whatever main do es is what the program does. Of course, main wi l l normal ly cal l upon functions
in other packages to do much of the work,

We must tell the compiler what packages are needed by this source file; that’s the role of the
import de clarat ion that follows the package de clarat ion.

### note

The increment statement i++ adds 1 to i; it’s equivalent to i += 1 which is in tur n equivalent
to i = i + 1. There’s a corresponding decrement statement it hat
subtracts 1. These are statements, not expressions as they are in most langu ages in the C fami ly, so j = i++ is illegal,
and they are postfix only, so i
is not legal either.
