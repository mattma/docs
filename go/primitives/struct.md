#### Struct

A struct is a collection of fields/properties. Can define new types as structs or interfaces. Like OOP, a light class that supports composition but not inheritance. No getter/setter, they can be accessd automatically. Only exported field (Capitalized) can be accessed from outside of a package.

```go
type Point struct {
        X, Y int
}
var (
    p = Point{1, 2}    // has type Point
    q = &Point{1, 2}  // has type *Point
    r = Point{X: 1}     // Y:0 is implicit
    s =Point{}            // X: 0 and Y: 0
)
func main() {
        fmt.Println(p, q, r, s)  // {1 2} &{1 2} {1 0} {0 0}
}
```

- Initializing  `new`

`new` expression to allocate a zero value of the requested type and to return a pointer to it. `ex: x := new(int)`

a common way to "initialize" a variable containing struct or a reference to one, is to create a struct literal.
Another way is to create a constructor. This is usually done when the zero value isn’t good enough and you need to set some default field values for instance.

Note: slices, maps, channels are usually allocated using `make` so the data structure these types are built upon can be initialized.

```go
type Bootcamp struct {
        Lat, Lon float64
}
func main() {
        x := new(Bootcamp) // has type *Bootcamp. value: {0 0}
        y := &Bootcamp{}     // has type *Bootcamp. value: {0 0}
        fmt.Println(*x == *y) // true
}
```

- Composition

context of interfaces. By composing one of your structure with one implementing a given interface, your structure automatically implements the interface.

The methods defined on a pointer are also automatically available on the value itself, work in both pointer and value.

```go
type User struct {
    Id             int
    Name, Location string
}
func (u *User) Greetings() string {
    return fmt.Sprintf("Hi %s from %s", u.Name, u.Location)
}
// Because our struct is composed of another struct, the methods on the User struct is also available to the Player.
type Player struct {
    User
    GameId int
}

func main() {
    // Way 1: Initializing
    p := Player{}
    p.Id = 42
    p.Name = "Matt"
    p.Location = "LA"
    p.GameId = 90404

    // Way 2: Initializing
    // When using a struct literal with an implicit composition, can’t just pass the composed fields.
    // Need to pass the types composing the struct. Once set, the fields are directly available.
    p := Player{
        User{Id: 42, Name: "Matt", Location: "LA"},
        90404,
    }

    fmt.Printf("%+v", p) // {User:{Id:42 Name:Matt Location:LA} GameId:90404}
    fmt.Printf("%v", p)   // {{42 Matt LA} 90404}
    // Directly set a field define on the Player struct
    p.Id = 11
    fmt.Printf("%+v", p) // {User:{Id:11 Name:Matt Location:LA} GameId:90404}

    fmt.Println(p.Greetings()) // Hi Matt from LA
}
```

- implementing a `Job` struct that can also behave as a `logger`.

```go
type Job struct {
        Command string

        // Way 1
        // Job struct has a field called `Logger` which is a pointer to another type (log.Logger)
        Logger  *log.Logger

        // Way 2: implicit composition, allows to easily and cheaply make your structs implement interfaces
        // skip defining the field for our logger
        // all the methods available on a pointer to log.Logger are available from our struct
        *log.Logger
}
func main() {
    job := &Job{"demo", log.New(os.Stderr, "Job: ", log.Ldate)}
    // same as
    // job := &Job{Command: "demo", Logger: log.New(os.Stderr, "Job: ", log.Ldate)}

    // When we initialize our value, we set the logger so we can then call its Print function by chaining the calls
    job.Logger.Print("test") // Job: 2009/11/10 test
}
```

An empty struct allocates zero bytes when values of this type are created. They’re
great when you need a type but not any state
Syntax: `type defaultMatcher struct{}`


The use of a receiver with any function declaration declares a method that is bound to
the specified receiver type.
`func (m defaultMatcher) Search`

It’s best practice to declare methods using pointer receivers, since many of the
methods we implement need to manipulate the state of the value being used to make the
method call. Using a pointer makes no sense since there is no state to be manipulated.

Unlike when we call methods directly from values and pointers, when we’re calling a
method via an interface type value, the rules are different. Methods declared with pointer
receivers can only be called by interface type values that contain pointers. Methods
declared with value receivers can be called by interface type values that contain both
values and pointers.

Example of method calls:

```go
// Way 1
// Method declared with a value receiver of type defaultMatcher
func (m defaultMatcher) Search(feed *Feed, searchTerm string)
// Declare a pointer of type defaultMatch
dm := new(defaultMatch)
// The compiler will dereference the dm pointer to make the call
dm.Search(feed, "test")

// Way 2
// Method declared with a pointer receiver of type defaultMatcher
func (m *defaultMatcher) Search(feed *Feed, searchTerm string)
// Declare a value of type defaultMatch
var dm defaultMatch
// The compiler will reference the dm value to make the call
dm.Search(feed, "test")
```

example of interface method call restrictions

```go
// Method declared with a pointer receiver of type defaultMatcher
func (m *defaultMatcher) Search(feed *Feed, searchTerm string)
// Call the method via an interface type value
var dm defaultMatcher
var matcher Matcher = dm // Assign value to interface type
matcher.Search(feed, "test") // Call interface method with value
> go build
cannot use dm (type defaultMatcher) as type Matcher in assignment

// Method declared with a value receiver of type defaultMatcher
func (m defaultMatcher) Search(feed *Feed, searchTerm string)
// Call the method via an interface type value
var dm defaultMatcher
var matcher Matcher = &dm // Assign pointer to interface type
matcher.Search(feed, "test") // Call interface method with pointer
> go build
Build Successful
```
