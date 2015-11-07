package tips

import (
	"encoding/json"
	"os"
)

// Tips 1: used to make an individual item by making an slice
// empty interface type, which means it can take in any type. Provide the flexibility of accepting different types, using interfaces
func (s *Storage) SetAll(machines ...Machine) error {
	var ins []interface{}
	for _, m := range machines {
		ins = append(ins, m)
	}
	c := s.session.DB(defaultDatabaseName).C(machinesCollectionName)
	return c.Insert(ins...)
}

// Tip2, Reads and unmarshall json
// Feed contains information we need to process a feed.
type Feed struct {
	Name string `json:"site"`
	URI  string `json:"link"`
	Type string `json:"type"`
}

// RetrieveFeeds reads and unmarshals the feed data file.
func RetrieveFeeds() ([]*Feed, error) {
	// Open the file.
	file, err := os.Open(dataFile)
	if err != nil {
		return nil, err
	}

	// Schedule the file to be closed once
	// the function returns.
	defer file.Close()

	// Decode the file into a slice of pointers
	// to Feed values.
	var feeds []*Feed
	err = json.NewDecoder(file).Decode(&feeds)

	// We don't need to check for errors, the caller can do this.
	return feeds, err
}
