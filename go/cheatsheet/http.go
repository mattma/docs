package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

/*
`http.Get` makes an HTTP request and, if there is no error, returns the result in the response struct resp. The Body field of resp contains the server response as a readable stream.
`ioutil.ReadAll` reads the entire response; the result is stored in b.
The Body stream is closed to avoid leaking resources, and `Printf` writes the response to the standard output.
*/
func main() {
	for _, url := range os.Args[1:] {
		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: %v\n", err)
			os.Exit(1)
		}
		b, err := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: reading %s: %v\n", url, err)
			os.Exit(1)
		}
		fmt.Printf("%s", b)
	}
}
