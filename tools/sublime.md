## Tips

1. Sync settings

```bash
    # Then symlink your Dropbox directories back locally
    ln -s ~/Dropbox/sublime-text-3/Packages/
    ln -s ~/Dropbox/sublime-text-3/Installed\ Packages/

    # Note that ST3 has three other directories under ~/.config.sublime-text-3/:
    # Cache, Index and Local. Do not sync these, each computer should manage their own local copies.
```

2. Pro tips

- cmd + p

open any file or fuzzy search or quick open file

- cmd + r

go to symbol. go to CSS selectors or Javascript functions

- cmd + shift + r

open the most recent files

- ctrl + left/right  or  opt + left/right

move the cursor by one word

- shift + left/right  or  shift + opt + left/right

move the cursor with the selection of one caret, plus opt with one word

- cmd + click  or  cmd + opt + drag

multiple carets or cursors

- ctrl + shift + w

Wrap selection in tag. Combime with multiple cursors for multiple tag

- ctrl + w

open emmet wrap abbreviation for html, css. same above, but with emmet plugin

- cmd + shift + v

paste and indent, stop re-indenting after pastes. Detect indentation.

- cmd + shift + j

jshint to lint your code, via [plugins](https://sublime.wbond.net/packages/JSHint%20Gutter)


## Plugins

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

2. [Git Gutter](https://github.com/jisaacks/GitGutter)

Jumping Between Changes

Prev:  cmd + opt + shift + k
Next: cmd +opt + shift + j

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

create a new pane in direction

- ctrl + a, up/down/right/left

travel to the pane in direction

- ctrl + a, cmd + up/down/right/left

create_pane_with_file the file into the pane in that direction

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
