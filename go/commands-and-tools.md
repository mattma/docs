## Go building binaries for different system

1. it has to have a GOROOT variable setup

2. make sure that your username is owning the GOROOT directory

`sudo chown -R mma $GOROOT`

```bash
cd $GOROOT/src

# 386 arch works both window and linux
export GOARCH=386

# build this for window.
export GOOS=windows

# build this for linux
export GOOS=linux
```

To build any app in windows

```bash
# build this app for window.
GOOS=windows GOARCH=386 go build -o hello.exe

# build this app for linux
GOOS=linux GOARCH=386 go build -o hello-linux

# build this app for mac
go build -o hello-mac
```

## Go commands

```go
// To run the program, print the output in the console
go run hello.go

// To build the program into binary in the same folder
go build hello.go

// To build the program into binary, put it inside $GOPATH/bin
go install
```

#### godoc

Generate documentation. It reads documentation directly from Go source files. Keep docs and code in sync when they live together in the same place.

```bash
# dodoc packageName funcName, show the description of that function
godoc cmd/fmt Println
godoc cmd/time Now
```

#### go get

It fetches the github source code and put it into `$GOPATH`, then build the binary.
Note: Repo name must be the same of the folder name and binary name.

```bash
go get github.com/mattma/reddit
```

#### go build

compile it once and save the compiled result for later use, so creates an executable binary file.

- look at some compiler’s optimizations

```bash
# Build your file (here called t.go) passing some gcflags
go build -gcflags=-m t.go
```

- Set the build id using git's SHA

```bash
# get the short version of SHA1 of your latest commit
git rev-parse --short HEAD
```

```go
// example.go
package main

import "fmt"

// compile passing -ldflags "-X main.Build <build sha1>"
var Build string

func main() {
  fmt.Printf("Using build: %s\n", Build)
}
```

```bash
go build -ldflags "-X main.Build a1064bc" example.go

./example  # Using build: a1064bc
```

#### go install

To run current go program to bin directory

#### go list

list packages

```bash
# To see what packages my app imports without standard packages
go list -f '{{join .Deps "\n"}}' | xargs go list -f '{{if not .Standard}}{{.ImportPath}}{{end}}'

# the list to also contain standard packages
go list -f '{{join .Deps "\n"}}' |  xargs go list -f '{{.ImportPath}}'
```


## Popular tools

`Goimports` is a tool that updates your Go import lines, adding missing ones and removing unreferenced ones.
It acts the same as `gofmt` (drop-in replacement) but in addition to code formatting, also fixes imports.
