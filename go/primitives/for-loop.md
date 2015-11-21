// For loop without pre/post statements
sum := 1
for ; sum < 1000; {
  sum += sum
}

// For loop as a while loop
sum := 1
for sum < 1000 {
  sum += sum
}

// Infinite loop
for {
  // do something in a loop forever
}
```

the loop is infinite, thoug h lo ops of this form may be ter minated in some other way, like a
break or return statement.

- Range

The range form of the `for` loop iterates over a `slice` or a `map`.

```go
func main() {
  cities := map[string]int{
    "New York":    8336697,
    "Los Angeles": 3857799,
    "Chicago":     2714856,
  }
  for key, value := range cities {
    fmt.Printf("%s has inhabitants %d\n", key, value)
  }
}
```

- Break, continue

break: stop the iteration anytime
continue: skip an iteration

- Exercise: Given a list of names, you need to organize each name within a slice based on its length.

```go
var names = []string{"Katrina", "Evan", "Neil", "Adam", "Martin", "Matt",
  "Emma", "Isabella", "Emily", "Madison",
  "Ava", "Olivia", "Sophia", "Abigail",
  "Elizabeth", "Chloe", "Samantha",
  "Addison", "Natalie", "Mia", "Alexis"}

func main() {
  var maxLen int

  for _, name := range names {
    if l := len(name); l > maxLen {
      maxLen = l
    }
  }

  // To avoid an out of bounds insert, we need our output slice to be big enough.
  // use the longest name length to set the length of the output slice length
  output := make([][]string, maxLen)

  for _, name := range names {
    output[len(name)-1] = append(output[len(name)-1], name)
  }

  fmt.Printf("%v", output)
  // [[] [] [Ava Mia] [Evan Neil Adam Matt Emma] [Emily Chloe] [Martin Olivia Sophia Alexis] [Katrina Madison Abigail Addison Natalie] [Isabella Samantha] [Elizabeth]]
}
```
