```go
threads, err := data.Threads(); if err == nil {
    templates.ExecuteTemplate(writer, "layout", threads)
}
```

We take the set of templates we parsed earlier on, and execute the layout template using the ExecuteTemplate function. Executing the template means we take the content from the template files, combine it with data from another source and generate the final HTML content.

the dot (.) represents the data that is passed into the template. template that starts with a dot (.), for example, {{ .User.Name }} and {{ .CreatedAtDate }}.
