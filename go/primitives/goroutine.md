Concurrency in Go is the ability for functions to run independent of each other.
When a function is created as a goroutine, it’s treated as an independent unit of
work that gets scheduled and then executed on an available logical processor.
The Go runtime scheduler is a sophisticated piece of software that manages all
the goroutines that are created and need processor time. The scheduler sits on
top of the operating system, binding operating system’s threads to logical processors
which, in turn, execute goroutines. The scheduler controls everything related to
which goroutines are running on which logical processors at any given time.

Concurrency synchronization comes from a paradigm called communicating sequential
processes or CSP. CSP is a message-passing model that works by communicating data
between goroutines instead of locking data to synchronize access. The key data type
for synchronizing and passing messages between goroutines is called a channel. For
many developers who have never experienced writing concurrent programs using
channels, they invoke an air of awe and excitement, which you hopefully will experience
as well. Using channels makes it easier to write concurrent programs and makes
them less prone to errors.


#### Concurrency versus parallelism

Each process contains at least one thread, and the initial thread for each process is
called the main thread. When the main thread terminates, the application terminates,
because this path of the execution is the origin for the application. The operating system
schedules threads to run against processors regardless of the process they belong
to.

- processes

think of a process like a container that holds all the resources an application uses and
maintains as it runs.

a process that contains common resources that may be allocated
by any process. These resources include but are not limited to a memory address
space, handles to files, devices, and threads.

- threads

A thread is a path of execution that’s
scheduled by the operating system to run the code that you write in your functions.


The operating system schedules threads to run against physical processors and the
Go runtime schedules goroutines to run against logical processors. Each logical processor
is individually bound to a single operating system thread. As of version 1.5, the
default is to allocate a logical processor for every physical processor that’s available.



As goroutines are created and ready to
run, they’re placed in the scheduler’s global run queue. Soon after, they’re assigned
to a logical processor and placed into a local run queue for that logical processor.
From there, a goroutine waits its turn to be given the logical processor for execution.

The process maintains a memory address space, handles to files, and
devices and threads for a running application. The OS scheduler
decides which threads will receive time on any given CPU.

The Go runtime schedules goroutines
to run in a logical processor that is bound
to a single operating system thread. When
goroutines are runnable, they are added
to a logical processor's run queue.


When a goroutine makes a blocking
syscall, the scheduler will detach the
thread from the processor and create
a new thread to service that processor.

Sometimes a running goroutine may need to perform a blocking syscall, such as opening
a file. When this happens, the thread and goroutine are detached from the logical
processor and the thread continues to block waiting for the syscall to return. In the
meantime, there’s a logical processor without a thread. So the scheduler creates a new
thread and attaches it to the logical processor. Then the scheduler will choose
another goroutine from the local run queue for execution. Once the syscall returns,
the goroutine is placed back into a local run queue, and the thread is put aside for
future use.


If a goroutine needs to make a network I/O call, the process is a bit different. In
this case, the goroutine is detached from the logical processor and moved to the runtime
integrated network poller. Once the poller indicates a read or write operation is
ready, the goroutine is assigned back to a logical processor to handle the operation.
There’s no restriction built into the scheduler for the number of logical processors
that can be created. But the runtime limits each program to a maximum of 10,000
threads by default. This value can be changed by calling the SetMaxThreads function
from the runtime/debug package. If any program attempts to use more threads, the
program crashes.

Concurrency is not parallelism. Parallelism can only be achieved when multiple
pieces of code are executing simultaneously against different physical processors. Parallelism
is about doing a lot of things at once. Concurrency is about managing a lot of
things at once. In many cases, concurrency can outperform parallelism, because the
strain on the operating system and hardware is much less, which allows the system to
do more. This less-is-more philosophy is a mantra of the language.


If you want to run goroutines in parallel, you must use more than one logical processor.
When there are multiple logical processors, the scheduler will evenly distribute
goroutines between the logical processors. This will result in goroutines running on
different threads. But to have true parallelism, you still need to run your program on
a machine with multiple physical processors. If not, then the goroutines will be running
concurrently against a single physical processor, even though the Go runtime is
using multiple threads.



#### Goroutines

Let’s uncover more about the behavior of the scheduler and how to create goroutines
and manage their lifespan.

```go
// This sample program demonstrates how to create goroutines and
// how the scheduler behaves.
package main
import (
"fmt"
"runtime"
"sync"
)
// main is the entry point for all Go programs.
func main() {
// Allocate 1 logical processor for the scheduler to use.
// allows the program to change the number of logical processors to be used by the scheduler.
// also an environmental variable that can be set with the same name if we don't want to make this call
runtime.GOMAXPROCS(1)
// wg is used to wait for the program to finish.
// Add a count of two, one for each goroutine.
var wg sync.WaitGroup
wg.Add(2)
fmt.Println("Start Goroutines")
// Declare an anonymous function and create a goroutine.
go func() {
// Schedule the call to Done to tell main we are done.
defer wg.Done()
// Display the alphabet three times
for count := 0; count < 3; count++ {
for char := 'a'; char < 'a'+26; char++ {
fmt.Printf("%c ", char)
}
}
}()
// Declare an anonymous function and create a goroutine.
go func() {
// Schedule the call to Done to tell main we are done.
defer wg.Done()
// Display the alphabet three times
for count := 0; count < 3; count++ {
for char := 'A'; char < 'A'+26; char++ {
fmt.Printf("%c ", char)
}
}
}()
// Wait for the goroutines to finish.
fmt.Println("Waiting To Finish")
wg.Wait()
fmt.Println("\nTerminating Program")
}
```

The amount of time it takes the first goroutine to finish displaying the alphabet is so
small that it can complete its work before the scheduler swaps it out for the second
goroutine. This is why you see the entire alphabet in capital letters first and then in
lowercase letters second. The two goroutines we created ran concurrently, one after
the other, performing their individual task of displaying the alphabet.


Once the two anonymous functions are created as goroutines, the code in main
keeps running. This means that the main function can return before the goroutines
complete their work. If this happens, the program will terminate before the goroutines
have a chance to run.

Based on the internal algorithms of the scheduler, a running goroutine can be
stopped and rescheduled to run again before it finishes its work. The scheduler does
this to prevent any single goroutine from holding the logical processor hostage. It will
stop the currently running goroutine and give another runnable goroutine a chance
to run.

from a logical processor point of view. In step 1 the
scheduler begins to execute goroutine A while goroutine B waits for its turn in the run queue. Then, suddenly in step 2, the scheduler swaps out goroutine A for goroutine
B. Since goroutine A doesn’t finish, it’s placed back into the run queue. Then, in
step 3 goroutine B completes its work and it’s gone. This allows goroutine A to get
back to work.


If we change the number of logical processors to 2, if we have two goroutine, allow the goroutines to be run in parallel. Almost immediately, both goroutines start running, so each goroutine is running on its own core.

Remember that goroutines
can only run in parallel if there’s more than one logical processor and there’s a physical
processor available to run each goroutine simultaneously.


#### Race conditions

When two or more goroutines have unsynchronized access to a shared resource and
attempt to read and write to that resource at the same time, you have what’s called a
race condition.

Read and write operations against a
shared resource must always be atomic, or in other words, done by only one goroutine
at a time.

```bash
# Go has a special tool that can detect race conditions in your code.
go build -race # Build the code using the race detector flag
./example # Run the code
```


#### Locking shared resources

Go provides traditional support to synchronize goroutines by locking access to shared
resources. If you need to serialize access to an integer variable or a block of code, then
the functions in the atomic and sync packages may be a good solution.

- Atomic functions

Atomic functions provide low-level locking mechanisms for synchronizing access to
integers and pointers.
ex: `atomic.AddInt64(&counter, 1)`
// Safely Add One To Counter. This function synchronizes the adding of integer values by enforcing that only one
goroutine can perform and complete this add operation at a time. When GoRoutine attempt to call any atomic function, they’re automatically synchronized against the
variable that’s referenced.


Two other useful atomic functions are LoadInt64 and StoreInt64. These functions
provide a safe way to read and write to an integer value.

- Mutexes

Another way to synchronize access to a shared resource is by using a mutex. A mutex is
named after the concept of mutual exclusion. A mutex is used to create a critical
section around code that ensures only one goroutine at a time can execute that code
section.

```go
// mutex is used to define a critical section of code.
var mutex sync.Mutex

// Only allow one goroutine through this
// critical section at a time.
mutex.Lock()

// Release the lock and allow any waiting goroutine through.
mutex.Unlock()
```

within a critical section
defined by the calls to Lock() and Unlock(). in between the `mutex` lock and unlock, Only one goroutine can enter the critical section at a time. Not until the call to the
Unlock() function is made can another goroutine enter the critical section.

#### Channels

channels that synchronize goroutines as they send and receive the resources they
need to share between each other.

When a resource needs to be shared between goroutines, channels act as a conduit
between the goroutines and provide a mechanism that guarantees a synchronous
exchange. When declaring a channel, the type of data that will be shared needs to be
specified. Values and pointers of built-in, named, struct, and reference types can be
shared through a channel.

Creating a channel in Go requires the use of the built-in function `make`. The first argument to make requires the keyword chan and
then the type of data the channel will allow to be exchanged. Sending a value or pointer into a channel requires the use of the "<-" operator. When receiving a value or pointer from a channel, the "<-" operator is attached to the
left side of the channel variable,

```go
// Unbuffered channel of integers.
unbuffered := make(chan int)
// create a buffered channel of type string that contains a buffer of 10 values
buffered := make(chan string, 10)

// Send a string through the channel.
buffered <- "Gopher"

// For another goroutine
// to receive that string from the channel, we use the same <- operator, but this time
// as a unary operator.

// Receive a string from the channel.
value := <-buffered
```

- Unbuffered channels

An unbuffered channel is a channel with no capacity to hold any value before it’s
received. These types of channels require both a sending and receiving goroutine to
be ready at the same instant before any send or receive operation can complete. If the
two goroutines aren’t ready at the same instant, the channel makes the goroutine that
performs its respective send or receive operation first wait. Synchronization is inherent
in the interaction between the send and receive on the channel. One can’t happen
without the other.

When two goroutines sharing a value using an unbuffered
channel. One goroutine send a channel, At this point, that goroutine is locked in the channel until the exchange is complete.
The other goroutine receive on the channel, That
goroutine is now locked in the channel until the exchange is complete. Finally, both goroutines are free to remove
their hands, which simulates the release of the locks. They both can now go on their
merry way.


In the game of tennis, two players hit a ball back and forth to each other. The players
are always in one of two states: either waiting to receive the ball, or sending the ball
back to the opposing player. You can simulate a game of tennis using two goroutines
and an unbuffered channel to simulate the exchange of the ball.

```go
// This sample program demonstrates how to use an unbuffered
// channel to simulate a game of tennis between two goroutines.
package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

// wg is used to wait for the program to finish.
var wg sync.WaitGroup

func init() {
    rand.Seed(time.Now().UnixNano())
}

// main is the entry point for all Go programs.
func main() {
    // Create an unbuffered channel
    // type int is created to synchronize the exchange of the ball being hit by both goroutines.
    court := make(chan int)
    // Add a count of two, one for each goroutine.
    wg.Add(2)
    // Launch two players.
    go player("Nadal", court)
    go player("Djokovic", court)

    // at this point, both goroutines are locked waiting to receive the ball

    // Start the set.
    // a ball is sent into the channel, and the game is played until one of the goroutines lose.
    court <- 1
    // Wait for the game to finish.
    wg.Wait()
}

// player simulates a person playing the game of tennis.
func player(name string, court chan int) {
    // Eventually a goroutine misses the ball and the channel is closed
    //  Then both goroutines return, the call to Done via the defer statement is performed, and the program terminates.
    // Schedule the call to Done to tell main we are done.
    defer wg.Done()

    // an endless for loop, Within the loop, the game is played
    for {
        // Wait for the ball to be hit back to us.
        // the goroutine performs a receive on the channel, waiting to receive the ball
        // This locks the goroutine until a send is performed on the
        // channel. Once the receive on the channel returns, the ok flag is checked on "false"
        // "false" value indicate the channel was closed, game is over
        ball, ok := <-court
        if !ok {
            // If the channel was closed we won.
            fmt.Printf("Player %s Won\n", name)
            return
        }

        // a random number is generated to determine if the goroutine hits or misses the ball.
        // Pick a random number and see if we miss the ball.
        n := rand.Intn(100)
        if n%13 == 0 {
            fmt.Printf("Player %s Missed\n", name)
            // Close the channel to signal we lost.
            close(court)
            return
        }
        // Display and then increment the hit count by one.
        fmt.Printf("Player %s Hit %d\n", name, ball)
        ball++
        // Hit the ball back to the opposing player.
        court <- ball
    }
}
```

```bash
# output
Player Nadal Hit 1
Player Djokovic Hit 2
Player Nadal Hit 3
Player Djokovic Missed
Player Nadal Won
```

#### Buffered channels

A buffered channel is a channel with capacity to hold one or more values before they’re
received. These types of channels don’t force goroutines to be ready at the same
instant to perform sends and receives. There are also different conditions for when a
send or receive does block. A receive will block only if there’s no value in the channel
to receive. A send will block only if there’s no available buffer to place the value being
sent. This leads to the one big difference between unbuffered and buffered channels:
An unbuffered channel provides a guarantee that an exchange between two goroutines
is performed at the instant the send and receive take place. A buffered channel
has no such guarantee.

Ex: goroutine 1 send a new value into the channel, goroutine 2 is in the process of receiving a value from the channel. goroutine 1 is sending a new value into the channel while the goroutine 2 is receiving a different value. Neither of
these two operations are in sync with each other or blocking. Finally,
all the sends and receives are complete and we have a channel with several values and
room for more.

```go
// This sample program demonstrates how to use a buffered
// channel to work on multiple tasks with a predefined number
// of goroutines.
const (
    numberGoroutines = 4  // Number of goroutines to use.
    taskLoad         = 10 // Amount of work to process.
)

// wg is used to wait for the program to finish.
var wg sync.WaitGroup

// init is called to initialize the package by the
// Go runtime prior to any other code being executed.
func init() {
    // Seed the random number generator.
    rand.Seed(time.Now().Unix())
}

// main is the entry point for all Go programs.
func main() {
    // Create a buffered channel to manage the task load.
    tasks := make(chan string, taskLoad)
    // Launch goroutines to handle the work.
    // one for each goroutine that’s going to be created.
    wg.Add(numberGoroutines)
    for gr := 1; gr <= numberGoroutines; gr++ {
        go worker(tasks, gr)
    }
    // Add a bunch of work to get done.
    // 10 strings are sent into the channel to simulate work for the goroutines.
    for post := 1; post <= taskLoad; post++ {
        tasks <- fmt.Sprintf("Task : %d", post)
    }
    // Close the channel so the goroutines will quit
    // when all the work is done.
    // Once the last string is sent into the channel, the channel is closed and the main function
    // waits for all the work to be completed
    // Closing the channel is an important piece of code. When a channel is
    // closed, goroutines can still perform receives on the channel but can no longer send
    // on the channel.
    close(tasks)

    // Once the channel is closed, the receive on the channel
    // returns immediately and the goroutine terminates itself.
    // Wait for all the work to get done.
    wg.Wait()
}

// worker is launched as a goroutine to process work from
// the buffered channel.
func worker(tasks chan string, worker int) {
    // Report that we just returned.
    defer wg.Done()
    for {
        // Wait for work to be assigned.
        task, ok := <-tasks
        // ok flag is checked to see if the channel is both empty and closed.
        // If the value of ok is false, the goroutine terminates,
        // which causes the defer statement on line 56 to call Done and report back to main.
        if !ok {
            // This means the channel is empty and closed.
            fmt.Printf("Worker: %d : Shutting Down\n", worker)
            return
        }
        // Display we are starting the work.
        fmt.Printf("Worker: %d : Started %s\n", worker, task)
        // Randomly wait to simulate work time.
        sleep := rand.Int63n(100)
        time.Sleep(time.Duration(sleep) * time.Millisecond)
        // Display we finished the work.
        fmt.Printf("Worker: %d : Completed %s\n", worker, task)
    }
}
```

```bash
# output
Worker: 1 : Started Task : 1
Worker: 2 : Started Task : 2
Worker: 3 : Started Task : 3
Worker: 4 : Started Task : 4
Worker: 1 : Completed Task : 1
Worker: 1 : Started Task : 5
Worker: 4 : Completed Task : 4
Worker: 4 : Started Task : 6
Worker: 1 : Completed Task : 5
...
```

Being able to receive on a closed channel is important because it
allows the channel to be emptied of all its values with future receives, so nothing in
the channel is ever lost. A receive on a closed and empty channel always returns immediately
and provides the zero value for the type the channel is declared with. If you
also request the optional flag on the channel receive, you can get information about
the state of the channel.


#### Summary

Concurrency is the independent execution of goroutines.
 Functions are created as goroutines with the keyword go.
 Goroutines are executed within the scope of a logical processor that owns a single
operating system thread and run queue.
 A race condition is when two or more goroutines attempt to access the same
resource.
 Atomic functions and mutexes provide a way to protect against race conditions.
 Channels provide an intrinsic way to safely share data between two goroutines.
 Unbuffered channels provide a guarantee between an exchange of data. Buffered
channels do not.

You can use channels to control the lifetime of programs.
 A select statement with a default case can be used to attempt a nonblocking
send or receive on a channel.
 Buffered channels can be used to manage a pool of resources that can be
reused.
 The coordination and synchronization of channels is taken care of by the
runtime.
 Create a pool of goroutines to perform work using unbuffered channels.
 Any time an unbuffered channel can be used to exchange data between two
goroutines, you have guarantees you can count on.


## Concurrency pattern

#### Runner

The purpose of the runner package is to show how channels can be used to monitor
the amount of time a program is running and terminate the program if it runs
too long. This pattern is useful when developing a program that will be scheduled
to run as a background task process. This could be a program that runs as a cron
job, or in a worker-based cloud environment like Iron.io.

`os.Signal`

This interface
abstracts specific implementations for trapping and reporting events from different
operating systems.

```go
// golang.org/pkg/os/#Signal
// A Signal represents an operating system signal. The usual underlying
// implementation is operating system-dependent: on Unix it is
// syscall.Signal.
type Signal interface {
String() string
Signal() // to distinguish from other Stringers
}
```


shows a classic use of the select statement
with a default case.

the code attempts to receive on the interrupt channel.
Normally that would block if there was nothing to receive,
The default case turns the attempt to receive on the interrupt channel
into a nonblocking call. If there’s an interrupt to receive, then it’s received and
processed. If there’s nothing to receive, the default case is then executed.

```go
select {
// Signaled when an interrupt event is sent.
case <-r.interrupt:
    // Stop receiving any further signals.
    signal.Stop(r.interrupt)
    return true
// Continue running as normal.
default:
    return false
 }
```


Since the work channel is an unbuffered channel, the caller must wait
for a goroutine from the pool to receive it. This is what we want, because the caller
needs the guarantee that the work being submitted is being worked on once the call
to Run returns.



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
