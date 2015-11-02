
#### Arrays

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
