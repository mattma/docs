## Tips

1. Sync settings: symlink your Dropbox directories backup the setting locally

Note: ST3 has three other directories under **~/.config.sublime-text-3/** *Cache*, *Index* and *Local*.
Do not sync these, each computer should manage their own local copies.

```bash
ln -s ~/Dropbox/sublime-text-3/Packages/
ln -s ~/Dropbox/sublime-text-3/Installed\ Packages/
```

## Keyboard Shortcut

#### Navigation

- Files

```bash
# Open any file, Fuzzy search, Quick open file
cmd + p
```

```bash
# [GotoRecent] package
# Go to symbol, Go to CSS selectors, Go to Javascript functions
cmd + r
```

```bash
# Open the most recent files
cmd + shift + r
```

```bash
# Jump back
ctrl + -
```

```bash
# [Git Gutter](https://github.com/jisaacks/GitGutter)
# Jumping Between Changes, modified field
cmd + opt + shift + k  # Previous
cmd + opt + shift + j   # Next
```

```bash
# [tern](http://ternjs.net)
# In JavaScript files, the package will handle autocompletion.

# Jump to the definition of the thing that the cursor is pointing at
alt + .

# Jump back to where you were when executing the previous `alt+.`
alt + ,

# When on a variable, select all references to that variable in the current file.
alt + space
```

- Cursors

```bash
# Move the cursor by one word
ctrl|opt + left|right
```

```bash
# Move the cursor by one caret from current position
shift + left|right

# Move the cursor by one word from current position
shift + opt + left|right

# Move the cursor to start or end of the line from current position
shift + cmd + left|right
```

```bash
# delete one word
ctrl + w
```

```bash
# Multiple carets or cursors
cmd + opt + drag

# Multiple carets or cursors
opt + drag
```

- file

```bash
# Advanced New file:create a new file
ctrl + alt + n
```

- Folding

```bash
# Folding the selection
cmd + opt + [

# Unfolding the selection
cmd + opt + ]

# Unfolding everything in files
cmd + opt + ctrl + ]
```

```bash
# Fold level #NUMBER
opt + ctrl + 1~9
```

- Utilities

```bash
# Detect indentation. paste and indent, stop re-indenting after pastes.
cmd + shift + v
```

#### Languages

- html

```bash
# Wrap selection in tag. Combime with multiple cursors for multiple tag
ctrl + shift + w

# Open emmet wrap abbreviation for html, css. [emmet plugin]
ctrl + w
```

- javascript

```bash
# jshint or linting code in normal mode.
# via [plugins](https://sublime.wbond.net/packages/JSHint%20Gutter)
cmd + shift + j
```

## Packages

#### [DashDoc](https://github.com/farcaller/DashDoc)

```bash
# search on Dash documentation on selection
ctrl + h

# flip syntax sensitive. Search MDN network
ctrl + opt + h
```

#### [Glue](http://gluedocs.readthedocs.org/en/latest/)

```bash
# Launch terminal `terminal.glue` for terminal bash script
ctrl + opt + g

# Open files in the Sublime Text editor by file path
glue open <filepath> [filepath2] [...]

# Open files by wildcard pattern
glue wco <wildcard>

# create new files
glue new
```

1. [DocBlockr](https://github.com/spadgos/sublime-jsdocs)

- Docblock completion

yield a new line and will close the comment.

    /**       # follow with *enter* or *tab*

Single-asterisk comment blocks behave similarly above

    /*        # follow with *enter* or *tab*

- Function documentation.

if the line directly afterwards contains a function definition, then its name and parameters are parsed and some documentation is automatically added. Note: Use `tab` to move between the different fields

    function foobar(baz, bo) { }     # then go to the previous line do `/**` follow with *enter* or *tab*

press *shift+enter* after the opening /** then the docblock will be inserted inline.

Pressing enter inside a docblock will automatically insert a leading asterisk and maintain your indentation.

- Comment decoration

write a double-slash comment and then press Ctrl+Enter, DocBlockr will 'decorate' that line for you.

    //        # follow `ctrl + enter`

- Reformatting paragraphs

Inside a comment block, hit `Alt+Q` to wrap the lines to make them fit within your rulers

3. Emmet

- opt + up/down

add/substract value by 0.1. Work in all syntax

- ctrl + up/down

add/substract value by 1. Work in all syntax

- cmd + opt + up/down

add/substract value by 10. Work in all syntax

4. [AutoFileName](https://sublime.wbond.net/packages/AutoFileName)

Need to fully test it. this package is in top 100

5. [Origami](https://github.com/SublimeText/Origami)

- ctrl + a, ctrl + up/down/right/left

create_pane_with_file the file into the pane in that direction

- ctrl + a, up/down/right/left

travel to the pane in direction

- ctrl + a, cmd + up/down/right/left

create a new pane in direction

- ctrl + a, opt + up/down/right/left

carry the file into the pane in that direction

- ctrl + a, shift + up/down/right/left

destory the pane in that direction

6. [AdvancedNewFile](https://github.com/skuroda/Sublime-AdvancedNewFile)

- super + opt + n

General keymap to create new files.

- cmd + opt + shift + n

In addition to creating the folders specified, new folders will also contain an __init__.py file.

7. [TabsExtra](https://github.com/facelessuser/TabsExtra)

#### VIM

```bash
# Select the whole line [Vintageous](https://github.com/guillermooo/Vintageous)
shift + v
```

#### Go development

```bash
# go to definition
ctrl + a, ctrl + g
```

```bash
# show documentation
ctrl + a, ctrl + h
```

```bash
# show errors on the current page
ctrl + a, ctrl + e
```

```bash
# Run `gofmt` format the file without saving it
ctrl + a, ctrl + f
```

- Commands

```bash
# modify the environment variable GOPATH and PATH
vi ~/Dropbox/Sublime_Text_3/Packages/User/golang.sublime-settings
```

```bash
# go build -v
ctrl + a, ctrl + b

# go run -v
ctrl + a, ctrl + r

# go test -v
ctrl + a, ctrl + t

# go install -v
ctrl + a, ctrl + i

# go clean -v
ctrl + a, ctrl + c

# Cancel a build
ctrl + a, ctrl + x
```

```bash
super + shift + p

`Go: Get`:  executes go get after prompting for a URL
`Go: Open Terminal`, which opens a terminal and sets relevant Go environment variables
```
