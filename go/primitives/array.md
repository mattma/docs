When variables in Go are declared, they’re always initialized to their zero value

#### Arrays

An array in Go is a fixed-length data type that contains a contiguous block of elements of the same type. This could be a built-in type such as integers and strings, or it can be a
struct type. Arrays are valuable data structures because the memory is allocated sequentially.
Having memory in a contiguous form can help to keep the memory we use stay loaded
within CPU caches longer.

Once an array is declared, neither the type of data being stored nor its length can be
changed. If we need more elements, we need to create a new array with the length needed
and then copy the values from one array to the other.

```go
// Declare an integer array of five elements.
var array [5]int

// Declare an integer array of five elements.
// Initialize each element with a specific value.
array := [5]int{10, 20, 30, 40, 50}

// Declare an integer array.
// Initialize each element with a specific value.
// Capacity is determined based on the number of values initialized.
array := [...]int{10, 20, 30, 40, 50}

// Declare an integer array of five elements.
// Initialize index 1 and 2 with specific values.
// The rest of the elements contain their zero value.
array := [5]int{1: 10, 2: 20}


// Declare an integer pointer array of five elements.
// Initialize index 0 and 1 of the array with integer pointers.
array := [5]*int{0: new(int), 1: new(int)}
// Assign values to index 0 and 1.
*array[0] = 10
*array[1] = 20


/* Multi demensional array*/
// Declare a two dimensional integer array of four elements
// by two elements.
var array [4][2]int
// Use an array literal to declare and initialize a two
// dimensional integer array.
array := [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
// Declare and initialize index 1 and 3 of the outer array.
array := [4][2]int{1: {20, 21}, 3: {40, 41}}
// Declare and initialize individual elements of the outer
// and inner array.
array := [4][2]int{1: {0: 20}, 3: {1: 41}}
```


- Pass array between functions

Passing an array between functions can be an expensive operation in terms of memory
and performance.

When we pass variables between functions, they’re always passed by
value. When our variable is an array, this means the entire array, regardless of its size, is
copied and passed to the function.

If not pass `foo2(&array)`, use `foo1(array)`, Every time the function foo1 is called, eight megabytes of memory has to be allocated
on the stack.

By pass `foo2(&array)`, We can pass a pointer to the array and only copy eight
bytes, instead of eight megabytes of memory on the stack
This time the function foo takes a pointer to an array of one million elements of type
integer. The function call now passes the address of the array, which only requires eight
bytes of memory to be allocated on the stack for the pointer variable.

We just need to be aware that because we’re now using a pointer, changing
the value that the pointer points to will change the memory being shared. What is really
awesome is that slices inherently take care of dealing with these types of issues for us, as
we will see.

```go
// Allocate an array of 8 megabytes.
var array [1e6]int

// Pass the array to the function foo.
foo1(array)
// Function foo accepts an array of one million integers.
func foo1(array [1e6]int) {

}

// Pass the address of the array to the function foo.
foo2(&array)
// Function foo accepts a pointer to an array of one million integers.
func foo2(array *[1e6]int) {
}
```




The type `[n]T` is an array of `n` values of type `T`.  ex: `var a [10]int`

Use an ellipsis to use an implicit length when you pass the values. ex: `var a = [...]string{"hello", "world!"}`
An array’s length is part of its type, so arrays cannot be resized.

Trying to access or set a value at an index that doesn’t exist will prevent your program from compiling

- Multi-dimensional arrays

```go
func main() {
  var a [2][3]string
  for i := 0; i < 2; i++ {
    for j := 0; j < 3; j++ {
      a[i][j] = fmt.Sprintf("row %d - column %d", i+1, j+1)
    }
  }
  fmt.Printf("%q", a)
  // [ ["row 1 - column 1" "row 1 - column 2" "row 1 - column 3"]
  // ["row 2 - column 1" "row 2 - column 2" "row 2 - column 3"] ]
}
```


#### slices, array

- Array

Rarely use `array` directly. It is a fixed piece of memory. cannot pass around function by reference unless you specific say you want to reference it.

```go
func main() {
  words := [...]string{"hello", "world", "matt", "ma"}
  fmt.Printf("%T\n", words)   // [4]string
}
```

- slice

It can be changed. Use `slice` everywhere, small foot print, very fast.

```go
func printer(msgs []string) {
  for _, word := range msgs {
    fmt.Printf("%s", word)
  }
  fmt.Printf("\n")
  msgs[2] = "red"
}

func main() {
  words := []string{"hello", "world", "matt", "ma"}
  printer(words)
  printer(words)
}
```

- slice a slice. `slice[3:9]`

- make

make a slice then add things later. When add more index to the array, `cap` value will increase.

- append

Note: when initialize a capacity value of 3, if you try to add 4th index by `words[4] =`, you get an runtime error. have
to use `append` keyword here because 4th index is not exists and capacity is max out

```go
func main() {
  // make an array with capacity of 3, currently have 0
  var words2 = make([]string, 0, 3)
  words2 = append(words2, "you")
  words2 = append(words2, "are")
  words2 = append(words2, "rocks")
  fmt.Printf("%d %d\n", len(words2), cap(words2))  // 3 3
}
```

- copy

Make/Create a complete separate copy of data.

```go
func main() {
  var words = []string{"You", "are", "rocks", "sir"}
  newWords := make([]string, len(words))
  copy(newWords, words)
}
```
