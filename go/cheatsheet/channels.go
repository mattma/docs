package main

import (
	"fmt"
	"strconv"
	"time"
)

// CHANNELS: allow us to pass data between go routines
var (
	pizzaNum  = 0
	pizzaName = ""
)

func makeDough(stringChan chan string) {
	pizzaNum++

	// Convert int into a string
	pizzaName = "Pizza #" + strconv.Itoa(pizzaNum)
	fmt.Printf("%s: Make Dough and Send for Sauce\n", pizzaName)

	// Send the pizzaName onto the channel for the next
	stringChan <- pizzaName

	time.Sleep(time.Millisecond * 10)
}

func addSauce(stringChan chan string) {
	// Receive the value passed on the channel
	pizza := <-stringChan
	fmt.Printf("%s: Add Sauce and Send for Toppings\n", pizza)

	// Send the pizzaName onto the channel for the next
	stringChan <- pizzaName

	time.Sleep(time.Millisecond * 10)
}

func addToppings(stringChan chan string) {
	// Receive the value passed on the channel
	pizza := <-stringChan

	fmt.Printf("%s: Add Toppings to and Ship\n", pizza)

	time.Sleep(time.Millisecond * 10)
}

func main() {
	// Make creates a channel, here is string channel
	stringChan := make(chan string)

	// Cycle through and make 3 pizzas
	for i := 0; i < 3; i++ {
		go makeDough(stringChan)
		go addSauce(stringChan)
		go addToppings(stringChan)

		time.Sleep(time.Millisecond * 5000)
	}
}
