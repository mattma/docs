
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
