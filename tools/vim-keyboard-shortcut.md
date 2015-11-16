## Navigation

**words** `w` are anything delimited by non-identifier characters
**paragraph** `p` in Vim are anything delimited by empty line (not blank lines)
**sentence** `s`

- ctrl + d    go down
- ctrl + u    go up

- w     Move forward to the start of the next word. delimited by spaces, tabs, or punctuation.

- W     Move the cursor to start of the next word. delimited by spaces, tabs.

- b     Move backwards to the start of the previous word. delimited by spaces, tabs, or punctuation.

- B     Move the cursor to the beginning of the previous word. delimited by spaces, or tabs

- e     Move forward to the end of the next word

- ge    Move backwards to the end of the previous word

- 0     Move to the start of the current line

- ^

move to the start of the first world of the current line

- $

move to the end of the current line

- return

move to the start of the next line

- -

move to the start of the previous line

- {

move to the start of the current paragraph

- }

move to the end of the current paragraph

- gg

move to the top of the buffer (Top of the file)

- G

move to the end of the buffer (bottom of the file)

- ctrl + f

Page ahead, one page at a time

- ctrl + b

Page back, one page at a time

- ctrl + d

Page ahead one half page at a time

- ctrl + u

Page back one half page at a time

- <N>G | <N>gg

move to the line N. ex: 35G

- <p>%

move to the point P percent through the buffer
ex: 50%  move the center of the page (any number + %)

- H

Moves the cursor to the first line of the upper-left corner of the screen

- M

Moves the cursor to the first character of the middle line on the screen

- L

Move the cursor to the last line of the lower-left corner of the screen

#### Plugin

1. NERDTree

:NERDTree   to trigger the NerdTree plugins
in NerdTree, hit ? for any help

`,k` toggle the view of nerd tree


## Text

#### Insert text

- a

Add command. Input text that starts to the right of the cursor

- A

Add at end command. Input text that start at the end of the current line

- i

Insert command. Input text that starts to the left of the cursor

- I

Insert at beginning command. Input text that starts to the left of the cursor

- o

Open below command. Opens a line below the current line and puts you in insert mode

- O

Open above command. Opens a line above the current line and put you in insert mode


- viw    inside a word, and visually select the whole word
- vaw    inside a word, and visually select the whole word, follow empty space
- daw    delete a word, and remove an follow empty space

#### Delete, copy, change text

- x

Delete the character under the cursor

- X

Delete the character directly before the cursor

- d<?>

Delete some text

- D

Delete from the current cursor to the end of the line
- c<?>

Change some text

- y<?>

Yank(copy) some text

**Note** <?> after each letter identifies the place where you use a movement command to choose what you are deleting, changing, or yanking. for example:

- dw    Deletes(d) a word(w) after the current cursor position
- db    Deletes(d) a word(b) before the current cursor position
- dd    Deletes(d) the entire current line(d)
- d$    Deletes(d) to the end of the line
- dG    Deletes(d) to the end of the file
- d}    Deletes(d) to the end of the paragraph
- c$    Changes(c) the characters(acutally erase) from the current cursor to end of line($),then input mode
- c0    Changes(c) from previous character to the beginning of the current line(0) then input mode
- cl    Erase(c) the current letter(l), then input mode
- cc    Erase(c) the line(c), then input mode
- yy    Copy(y) the current line(y) into the buffer
- y)    Copy(y) the current sentence ()) to the right of the cursor into the buffer
- y}    COpy(y) the current paragrah(}) to the right of the cursor into the buffer

- 3dd   Deletes(d) three(3) lines(d) beginning at the current line
- 3dw   Deletes(d) the next three(3) words(w)
- 5cl   Change(c) the next five(5) letters(l)
- 12j   Move down(j) 12 lines(12)
- 5cs   Erases(c) the next five(5) words(w), then input mode
- 4y)   Copy(y) the next four(4) sentences())


- P

puts the copied text to the left of the cursor

- p

puts the buffered text to the right of the cursor

#### Search

- f

ex: `fs` find the first "s", and jump there

- vf

ex: `vfs` find the first "s", and visual select till "s"


## System

- /

Search for forward occurrence of the text in the file.
ex: /The.*foot  Search forward for a line has word "The", after at some pont, the word "foot"

- ?

Search for backward occurrence of the text in the file.
ex: ?[pP]rint  Search backward for either "print" or "Print"

**Note**:

-`n` or `N` to search in the same direction(n) or opposite direction(N) for the term
- :g/Local    Search for word "Local", prints every occurence of the line from the file
- :s/Local/Remote   Substitute "Remote" fro the first occurence of the word "Local" on the current line
- :g/Local/s//Remote    Substitute the first occurence of the word "Local" on every line of the firle with the word "Remote"
- :g/Local/s//Remote/g  Substitute every occurence of the word "Local" with the word "Remote" in the entire file
- :g/Local/s//Remote/gp   Substitute every occurence of the word "Local" with the word "Remote" in the entire file, then prints each line so you can see the changes.

- :noh

Remove the searched highlight word


- .

Repeat command. Ex: / to search sth. use `n` find next one, use `.` to repeat operation

- u

Undo the previous change.

- ctrl + R

Redo. did not want to undo the previous undo command

- :!Command

Run a shell command. When command completes, press Enter, you are back to editing the file.
Launch a shell (:!zsh) run a few commands, then type `exit` to return to `vi`

- ctrl + g

Find out where you are in a file. Display the name of the file, current line, %, column number, userful info.

- < | >

increase or decrease the indentation

## Exit vim

- ZZ

Saves the current changes to the file and exits from vi

- :w

Save the current file but does not exit from vi

- :wq

Works the same as ZZ

- :q

Quits the current file. It works only if you do not have any unsaved changes

- :q!

Quits the current file and does not save the changes you just made to the file.


## MacVim

- ctrl + w (h/j/k/l) | ctrl + w (ctrl + w)

Switch between windows

