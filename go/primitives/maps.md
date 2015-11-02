

A map is an unordered collection of key-value pairs.
Also known as an associative array, a hash table or a
dictionary, maps are used to look up a value by its associated
key.  `var x map[string]int`

Accessing an element of a map can return two values
instead of just one. The first value is the result of the
lookup, the second tells us whether or not the lookup
was successful.
if name, ok := elements["Un"]; ok {
fmt.Println(name, ok)
}

```go
elements := map[string]map[string]string{
"H": map[string]string{
    "name":"Hydrogen",
    "state":"gas",
    },
}
```

#### Maps

Like “dictionaries” or “hashes”. A map maps keys to values.
When not using map literals, maps must be created with `make` (not `new`) before use.
The `nil` map is empty and cannot be assigned to.

```go
type Vertex struct {
  Lat, Long float64
}
var m map[string]Vertex
func main() {
  m = make(map[string]Vertex)
  m["Bell Labs"] = Vertex{40.68433, -74.39967}
}
```

When using map literals, if the top-level type is just a type name, you can omit it from the elements of the literal.

```go
type Vertex struct {
        Lat, Long float64
}
var m = map[string]Vertex{
  "Bell Labs": {40.68433, -74.39967},
  // same as "Bell Labs": Vertex{40.68433, -74.39967} "Google": {37.42202, -122.08408},
}
```

- Mutating maps

```go
// Insert or update an element in map
m[key] = elem

// Retrieve an element
elem = m[key]

// Delete an element
delete(m, key)

// Test that a key is present with a two-value assignment
// If key is in m, ok is true. If not, ok is false and elem is the zero value for the map’s element type.
elem, ok = m[key]
```
