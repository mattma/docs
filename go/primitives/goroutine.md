
## Concurrency

Go concurrency shared values are passed around on channels, never actively shared by separate threads of execution. Only one goroutine has access to the value at any given time. Data races cannot occur, by design.
Do not communicate by sharing memory; instead, share memory by communicating.

- GoRoutine

A goroutine is a lightweight thread managed by the Go runtime. ex: `go f(x, y, x)`
The evaluation of f, x, y, and z happens in the current goroutine and the execution of `f` happens in the new goroutine.
Goroutines run in the same address space, so access to shared memory must be synchronized. The sync package provides useful primitives, although you won’t need them much in Go as there are other primitives.

- Channels (<-)

Channels are a typed conduit through which you can send and receive values with the channel operator(<-)
By default, sends and receives block wait until the other side is ready. This allows goroutines to synchronize without explicit locks or condition variables.

```go
ch <- v // Send v to channel ch.
v := <-ch // Receive from ch, and assign value to v.
```

Like maps and slices, channels must be created before use. ex: `ch := make(chan int)`

```go
func sum(a []int, c chan int) {
  sum := 0
  for _, v := range a {
    sum += v
  }
  c <- sum // send sum to c
}

func main() {
  a := []int{7, 2, 8, -9, 4, 0}

  c := make(chan int)
  go sum(a[:len(a)/2], c)
  go sum(a[len(a)/2:], c)
  x, y := <-c, <-c // receive from c

  fmt.Println(x, y, x+y)   // -5 17 12
}
```

- Buffered channels

Channels can be buffered. Provide the buffer length as the second argument to make to initialize a buffered channel.
Syntax: `ch := make(chan int, 100)`
Sends to a buffered channel block only when the buffer is full. Receives block when the buffer is empty.

```go
// That’s because we overfilled the buffer without letting the code a chance to read/remove a value from the channel.
func main() {
  c := make(chan int, 2)
  c <- 1
  c <- 2
  c <- 3
  fmt.Println(<-c)
  fmt.Println(<-c)
  fmt.Println(<-c)  // fatal error: all goroutines are asleep - deadlock!
}

// To fix: using GoRoutine works fine
// The reason is that we are adding an extra value from inside a go routine, so our code doesn’t block the main thread. The goroutine is being called before the channel is being emptied, but that is fine, the goroutine will wait until the channel is available. We then read a first value from the channel, which frees a spot and our goroutine can push its value to the channel.
func main() {
  c := make(chan int, 2)
  c <- 1
  c <- 2
  c3 := func() { c <- 3 }
  go c3()
  fmt.Println(<-c)
  fmt.Println(<-c)
  fmt.Println(<-c)
}
```

- Range

The loop `for i := range ch` receives values from the channel repeatedly until it is closed.
Only the sender should close a channel, never the receiver. Sending on a closed channel will cause a panic.
Channels aren’t like files; you don’t usually need to close them. Closing is only necessary when the receiver must be told there are no more values coming, such as to terminate a range loop.

```go
func fibonacci(n int, c chan int) {
  x, y := 0, 1
  for i := 0; i < n; i++ {
    c <- x
    x, y = y, x+y
  }
  close(c)
}

func main() {
  c := make(chan int, 10)
  go fibonacci(cap(c), c)
  for i := range c {
    fmt.Println(i)
  }
}
```

- Close

A sender can close a channel to indicate that no more values will be sent. Receivers can test whether a channel has been closed by assigning a second parameter to the receive expression. ex: `v, ok := <- ch`. `ok` is false if there are no more values to receive and the channel is closed.

- select

The select statement lets a goroutine wait on multiple communication operations.
A select blocks until one of its cases can run, then it executes that case. It chooses one at random if multiple are ready.

```go
func fibonacci(c, quit chan int) {
  x, y := 0, 1
  for {
    select {
    case c <- x:
      x, y = y, x+y
    case <-quit:
      fmt.Println("quit")
      return
    }
  }
}
func main() {
  c := make(chan int)
  quit := make(chan int)
  go func() {
    for i := 0; i < 10; i++ {
      fmt.Println(<-c)
    }
    quit <- 0
  }()
  fibonacci(c, quit)
}
```

- Default case

The default case in a select is run if no other case is ready. Use a default case to try a send or receive without blocking.

```go
select {
case i := <-c:
  // use i
default:
  // receiving from c would block
}
```

```go
func main() {
  tick := time.Tick(100 * time.Millisecond)
  boom := time.After(500 * time.Millisecond)
  for {
    select {
    case <-tick:
      fmt.Println("tick.")
    case <-boom:
      fmt.Println("BOOM!")
      return
    default:
      fmt.Println("    .")
      time.Sleep(50 * time.Millisecond)
    }
  }
}
```

- Timeout

```go
func main() {
  response := make(chan *http.Response, 1)
  errors := make(chan *error)

  go func() {
    resp, err := http.Get("http://matt.aimonetti.net/")
    if err != nil {
      errors <- &err
    }
    response <- resp
  }()
  for {
    select {
    case r := <-response:
      fmt.Printf("%s", r.Body)
      return
    case err := <-errors:
      log.Fatal(err)
    // time.After call as a timeout measure to exit if the request didn’t give a response within 200ms.
    case <-time.After(200 * time.Millisecond):
      fmt.Printf("Timed out!")
      return
    }
  }
}
```
