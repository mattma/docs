#### func

When you pass an array into a function, you acutally pass a copy of the array. and if you modify in the function, it will not change the value that has been passed in.

- defer

It always run `defer` method at the end of the function, commonly use for function clean up. `defer` method will get queue up when the function exits.

The keyword defer is used to schedule a function call to be executed right after a
function returns. guarantee that the
method will be called. This will happen even if the function panics and terminates
unexpectedly. The keyword defer lets us write this statement close to where the
opening of the file occurs, which helps with readability and reducing bugs

-  variable arguments in func

a variadic function that accepts any number
of values

Can only have one `...`, always at the end of the parameters

Varadic parameters can accept any number of values that are passed in.

```go
// Add attaches tasks to the Runner. A task is a function that
// takes an int ID.
func (r *Runner) Add(tasks ...func(int)) {
r.tasks = append(r.tasks, tasks...)
}
```
