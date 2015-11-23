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

```go
func main() {
counts := make(map[string]int)
// The scanner reads from the program’s standard input.
input := bufio.NewScanner(os.Stdin)
// the result can be ret rie ved by cal ling input.Text(). The Scan function retur ns true if there is a line and false when there is no more input.
for input.Scan() {
counts[input.Text()]++
}
// NOTE: ignoring potential errors from input.Err()
for line, n := range counts {
if n > 1 {
fmt.Printf("%d\t%s\n", n, line)
}
}
}
```

A map holds a set of key/value pairs and provides constant-t ime operat ions to store, retr ieve,
or test for an item in the set. The key may be of any typ e whos e values can compared with ==,
strings being the most common example; the value may be of any typ e at all. In this example,
the keys are str ings and the values are ints. The bui lt-in function make creates a new empty
map; it has other uses too. Maps are discussed at lengt h in Sec tion 4.3.
Each time dup reads a line of input, the line is used as a key into the map and the corresponding
value is incremented. The statement counts[input.Text()]++ is equivalent to
thes e two statements:

```go
line := input.Text()
counts[line] = counts[line] + 1
```

It’s not a problem if the map doesn’t yet contain that key. The first time a new line is seen, the
expression counts[line] on the rig ht-hand side evaluates to the zero value for its typ e, which
is 0 for int.

#### fmt verbs

%d de cimal integer
%x, %o, %b integer in hexade cimal, octal, binary
%f, %g, %e floating-p oint number: 3.141593 3.141592653589793 3.141593e+00
%t boole an: true or false
%c rune (Unico de co de point)
%s string
%q quoted str ing "abc" or rune 'c'
%v any value in a natural format
%T type of any value
%% literal percent sig n (no operand)

By convention, formatting functions whose names end in f, such as
log.Printf and fmt.Errorf, use the formatting rules of fmt.Printf, whereas those whose
names end in ln follow Println, formatting their arguments as if by %v, followed by a
newline.
