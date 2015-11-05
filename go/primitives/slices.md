Slices are built around the concept of dynamic arrays that can grow and shrink as
we see fit.

They’re flexible in terms of growth because they have their own built-in
function called append, which can grow a slice quickly with efficiency. We can also
reduce the size of a slice by slicing out a part of the underlying memory. Slices give us
all the benefits of indexing, iteration, and garbage collection optimizations because the
underlying memory is allocated in contiguous blocks.

Regardless whether we’re using a slice or an empty slice, the nil built-in functions
append, len and cap work the same.

One way to create a slice is to use the built-in function make. When we use make, one
option we have is to specify the length of the slice:

```go
// Create a slice of strings.
// Contains a length and capacity of 5 elements.
// just specify the length, the capacity of the slice is the same.
slice := make([]string, 5)


// Create a slice of integers.
// Contains a length of 3 and has a capacity of 5 elements.
// create a slice with available capacity in the underlying array that we don’t have access to initially.
slice := make([]int, 3, 5)


// slice literal.
// Like creating an array, except we don’t specify a value inside of the operator.
// Create a slice of strings.
// Contains a length and capacity of 5 elements.
slice := []string{"Red", "Blue", "Green", "Yellow", "Pink"}
// Create a slice of integers.
// Contains a length and capacity of 3 elements.
slice := []int{10, 20, 30}


// Declare a slice with index position
// Create a slice of strings
// Initialize the 100th element with an empty string.
slice := []string{99: ""}
```

- nil and empty slices

Sometimes in our programs we may need to declare a nil slice. A nil slice is created
by declaring a slice without any initialization:
empty slice is length of zero and capacity of zero

```go
// Create a nil slice of integers.
var slice []int

// Use make to create an empty slice of integers.
slice := make([]int, 0)

// Use a slice literal to create an empty slice of integers.
slice := []int{}
```

Empty slices contain a zero-element underlying array that allocates no storage. Empty
slices are useful when we want to represent an empty collection, such as when a database
query returns zero results


- Taking the slice of a slice

```go
// Create a slice of integers.
// Contains a length and capacity of 5 elements.
slice := []int{10, 20, 30, 40, 50}
// Create a new slice.
// Contains a length of 2 and capacity of 4 elements.
newSlice := slice[1:3]
```

we have two slices that are
sharing the same underlying array. However, each slice views the underlying array in a
different way.

The original slice views the underlying array as having a capacity of five elements,
but the view of newSlice is different. For newSlice, the underlying array has a
capacity of four elements. newSlice can’t access the elements of the underlying array
that are prior to its pointer. As far as newSlice is concerned, those elements don’t even
exist.


We need to remember that we now have two slices sharing the same underlying array.
Making changes to the shared section of the underlying array by one slice can be seen by
the other slice:

```go
// Create a slice of integers.
// Contains a length and capacity of 5 elements.
slice := []int{10, 20, 30, 40, 50}
// Create a new slice.
// Contains a length of 2 and capacity of 4 elements.
newSlice := slice[1:3]
// Change index 1 of newSlice.
// Change index 2 of the original slice.
newSlice[1] = 35
```


- how the new length and capacity is being calcualated

For slice[i:j] with an underlying array of capacity k
Length: j - i
Capacity: k - i

Another way to look at this, the first value represents the starting index position of the
element the new slice will start with. In this case that is (1). The second value represents
the starting index position (1) plus the number of elements we want to include (2). One
plus two is three so the second value is (3). Capacity will be the total number of elements
associated with the slice.


A slice can only access indexes up to its length. Trying to access an element outside
of its length will cause a runtime exception. The elements associated with a slice’s
capacity are only available for growth. They must be incorporated into the slices length
before they can be used


- append

To use append, we need a source slice and a value that is to be appended. When our
append call returns, it provides us a new slice with the changes. The append function
will always increase the length of the new slice. The capacity on the other hand, may or
may not be affected depending on the available capacity of the source slice.


When there is no available capacity in the underlying array for a slice, the append
function will create a new underlying array, copy the existing values that are being referenced and assign the new value

The append operation is clever when growing the capacity of the underlying array.
Capacity is always doubled when the existing capacity of the slice is under 1,000
elements. Once the number of elements goes over 1,000, the capacity is grown by a
factor of 1.25 or 25%. This growth algorithm may change in the language over time.


- third index slice

This third index gives us control over the capacity of the new slice. The purpose
is not to increase capacity, but to restrict the capacity.

```go
// Slice the third element and restrict the capacity.
// Contains a length of 1 element and capacity of 2 elements.
slice := source[2:3:4]
```

After this slicing operation, we have a new slice that references one element from the
underlying array and has a capacity of two elements.

If we attempt to set a capacity that is larger than the available capacity, we will get a
runtime error

How length and capacity are calcuated:

For slice[i:j:k] or [2:3:4]
Length: j - i or 3 - 2 = 1
Capacity: k - i or 4 - 2 = 2


- Benefits of setting length and capacity to be the same

As we’ve discussed and seen, the built-in function will append use any available
capacity first. Once that capacity is reached, it will allocate a new underlying array. It’s
easy to forget which slices are sharing the same underlying array.

By having the option to set the capacity of a new slice to be the same as the length,
we can force the first append operation to detach the new slice from the underlying
array. Detaching the new slice from its original source array makes it safe to change.


```go
// Create a slice of strings.
// Contains a length and capacity of 5 elements.
source := []string{"Apple", "Orange", "Plum", "Banana", "Grape"}
// Slice the third element and restrict the capacity.
// Contains a length and capacity of 1 element.
slice := source[2:3:3]
// Append a new string to the slice.
slice = append(slice, "Kiwi")
```
Without this third index, appending Kiwi to our slice would’ve changed the value of
Banana in index 3 of the underlying array, because all of the remaining capacity would
still belong to the slice. But in listing 4.36, we restricted the capacity of the slice to one.
When we call append for the first time on our slice, it will create a new underlying
array of two elements, copy the fruit Plum, add the new fruit Kiwi, and return a new slice
that references this underlying array

With the new slice now having its own underlying array, we have avoided potential
problems. We can now continue to append fruit to our new slice without worrying if
we’re changing fruit to other slices inappropriately. Also, allocating the new underlying
array for the slice was easy and clean.


-

The built-in function is also a variadic function. This append means we can pass
multiple values to be appended in a single slice call. If we use the ... operator, we can
append all the elements of one slice into another:

```go
// Create two slices each initialized with two integers.
s1 := []int{1, 2}
s2 := []int{3, 4}
// Append the two slices together and display the results.
fmt.Printf("%v\n", append(s1, s2...))
Output: [1 2 3 4]
```








A slice is . `var x []float64` The only difference between this and an array is the
missing length between the brackets. In this case x
has been created with a length of 0.

create a slice you should use the built-in
make function:

// 10 represents the capacity of the underlying array
which the slice points to:
x := make([]float64, 5, 10)

Another way to create slices is to use the [low : high]
expression:
arr := []float64{1,2,3,4,5}
x := arr[0:5]

#### Slices

[]T is a slice with elements of type T.

Slices wrap arrays to give a more general, powerful, and convenient interface to sequences of data.
Slices hold references to an underlying array, and if you assign one slice to another, both refer to the same array. If a function takes a slice argument, changes it makes to the elements of the slice will be visible to the caller, analogous to passing a pointer to the underlying array.

- Slicing a slice (s[lo:hi])

creating a new slice value that points to the same array.

`s[lo:hi]`  evaluates to a slice of the elements from `lo` through `hi-1`, inclusive
`s[lo:lo]`  is empty

- Making slices (make)

Besides creating slices by passing the values right away (slice literal), you can also use `make`. You create an empty slice of a specific length and then populate each entry.  ex: `var cities = make([]string, 3)`

It works by allocating a zeroed array and returning a slice that refers to that array.

- Appending to a slice (append)

```go
// a slice is seating on top of an array, in this case, the array is empty and the slice can’t set a value in the referred array.
cities := []string{}
cities[0] = "Santa Monica" // panic: runtime error: index out of range

// To fix, use `append` function. append several entry to a slice
cities = append(cities, "San Diego", "mountain view")

// append a slice to another using an ellipsis
otherCities := []string{"Santa Monica", "Venice"}
cities = append(cities, otherCities...)  // [San Diego mountain view Santa Monica Venice]
```

ellipsis is a built-in feature of the language that means that the element is a collection.
We can’t append an element of type slice of strings ([]string) to a slice of strings, only strings can be appended. However, using the ellipsis (...) after our slice, we indicate that we want to append each element of our slice.

- Length

At any time, you can check the length of a slice. ex: `len(slicess)`

- Nil slices

The zero value of a slice is nil. A nil slice has a length and capacity of 0.

```go
func main() {
  var z []int
  fmt.Println(z, len(z), cap(z)) // [] 0 0
  if z == nil {
    fmt.Println("nil!")   // nil!
  }
}
```

You can skip the index or value by assigning to `_`.


- [SliceTricks](https://github.com/golang/go/wiki/SliceTricks)

```go
// AppendVector
a = append(a, b...)

// Copy
b = make([]T, len(a))
copy(b, a)
// or
b = append([]T(nil), a...)

// Cut
a = append(a[:i], a[j:]...)

// Delete
a = append(a[:i], a[i+1:]...)
// or
a = a[:i+copy(a[i:], a[i+1:])]

// Delete without preserving order
a[i] = a[len(a)-1]
a = a[:len(a)-1]
```

NOTE: If the type of the element is a pointer or a struct with pointer fields, which need to be garbage collected, the above implementations of Cut and Delete have a potential memory leak problem: some elements with values are still referenced by slice a and thus can not be collected. The following code can fix this problem:

```go
// Cut
copy(a[i:], a[j:])
for k, n := len(a)-j+i, len(a); k < n; k++ {
    a[k] = nil // or the zero value of T
}
a = a[:len(a)-j+i]

// Delete
copy(a[i:], a[i+1:])
a[len(a)-1] = nil // or the zero value of T
a = a[:len(a)-1]
// or, more simply:
a, a[len(a)-1] = append(a[:i], a[i+1:]...), nil

// Delete without preserving order
a[i] = a[len(a)-1]
a[len(a)-1] = nil
a = a[:len(a)-1]
```

```go
// Expand
a = append(a[:i], append(make([]T, j), a[i:]...)...)

// Extend
a = append(a, make([]T, j)...)

// Insert
a = append(a[:i], append([]T{x}, a[i:]...)...)
// NOTE The second append creates a new slice with its own underlying storage and copies elements in a[i:] to that slice, and these elements are then copied back to slice a (by the first append). The creation of the new slice (and thus memory garbage) and the second copy can be avoided by using an alternative way:
s = append(s, 0)
copy(s[i+1:], s[i:])
s[i] = x

// InsertVector
a = append(a[:i], append(b, a[i:]...)...)

// Pop
x, a = a[len(a)-1], a[:len(a)-1]

// Push
a = append(a, x)

// Shift
x, a := a[0], a[1:]

// Unshift
a = append([]T{x}, a...)
```

```go
// Filtering without allocating
// This trick uses the fact that a slice shares the same backing array and capacity as the original, so the storage is reused for the filtered slice. Of course, the original contents are modified.
b := a[:0]
for _, x := range a {
    if f(x) {
        b = append(b, x)
    }
}

// Reversing
// To replace the contents of a slice with the same elements but in reverse order
for i := len(a)/2-1; i >= 0; i-- {
    opp := len(a)-1-i
    a[i], a[opp] = a[opp], a[i]
}
// The same thing, except with two indices
for left, right := 0, len(a)-1; left < right; left, right = left+1, right-1 {
    a[left], a[right] = a[right], a[left]
}
```
