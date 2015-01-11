# WebStorm

### File Location

@Usage: Plugins
    rm ~/Library/Application\ Support/WebStorm9
    ln -s ~/Dropbox/WebStorm/plugins ~/Library/Application\ Support/WebStorm9

@Usage: Configs. Repeat for the rest
    rm ~/Library/WebStorm9/codestyles
    ln -s ~/Dropbox/WebStorm/preferences/codestyles ~/Library/Preferences/WebStorm9/codestyles
    ln -s ~/Dropbox/WebStorm/preferences/colors ~/Library/Preferences/WebStorm9/colors
    ln -s ~/Dropbox/WebStorm/preferences/keymaps ~/Library/Preferences/WebStorm9/keymaps
    ln -s ~/Dropbox/WebStorm/preferences/options ~/Library/Preferences/WebStorm9/options
    ln -s ~/Dropbox/WebStorm/preferences/templates ~/Library/Preferences/WebStorm9/templates
    ln -s ~/Dropbox/WebStorm/preferences/tools ~/Library/Preferences/WebStorm9/tools

    ln -s ~/Dropbox/WebStorm/.ideavimrc ~/.ideavimrc

- Configuration

    ~/Library/Preferences/<PRODUCT><VERSION>

- Caches

    ~/Library/Caches/<PRODUCT><VERSION>

- Plugins

    ~/Library/Application Support/<PRODUCT><VERSION>

- Logs

    ~/Library/Logs/<PRODUCT><VERSION>

### Keyboard Shortcut

#### Popular

- cmd + shift + p  ||  cmd +shift + a

find actions, search for commands of the IDE

- cmd + shift + d

open dash doc

- cmd + alt + L

format your code based on preferred style

- cmd + t

search everywhere. find anything from IDE commands to files, classes, function, actions, preferences, declarations and more.

- ctrl + shift + up/down

move the line up and down by one line

- cmd + shift + n

create a scatch file with preferred file type, won't be saved

- cmd + n

create a new file type

- cmd + space  ||  F1

quick documentation

- alt + F1

Switch between views ( Project, Structure, etc. )

- alt + space

quick method lookup

- ctrl + space

code hinting dialog

- escape

always return back to the editor

- cmd + alt + left/right

go back and forth where previous file location

- alt + enter

Show the list of available **Intention actions**
* Applying Intention Actions
* Configuring Intention Actions
* Disabling Intention Actions

language injection, quickly edit preferred language code in assistant editor
check regular expression.
several other cool features embedded into this command
in `if`, `switch`, it will trigger a context sensitive menu

- ctrl + t

refactor this command menu popup

- cmd + alt + t

surround with predefined block

- cmd + / && cmd + alt + /

Comment or uncomment a line or fragment of code with the line or block comment.

- ctrl + alt + /

collapse all comment blocks

- cmd + ctrl + /

expand all comment blocks

- ctrl + tab

Switch between the tool windows and files opened in the editor.

- alt + up|down

incremental expression selection, highlight select text

- cmd + shift + F7

quick view the usages of the selected symbol

- ctrl + space

invoke code completion

#### Navigation

- cmd + o

Go to class. Work for CoffeeScript, TypeScript, etc.

- cmd + shift + o

Go to file. Junction with `cmd + y` will preview the content of the file

- cmd + alt + o

Go to symbol. Find any symbol in the project

- ctrl + tab

go to last edited file

- cmd + e

Recent file popup

- cmd + shift + e

Recent edited file

- cmd + L

go to line number

- cmd + shift + delete

go to last edit location

- cmd + b

Jump to the defination

- cmd + ctrl + b

Show usage

- cmd + up

Jump to navigation bar

- cmd + j

insert/browse the list of live template

- cmd + alt +j

surround with a live template

- cmd + alt + [|]

navigate to the code block start|end

#### Search/Replace

- cmd + f

find

- cmd + shift + f

replace

- cmd + g

Find next

- cmd + shift + g

Find previous

- cmd + alt + ctrl + f

find in path

- cmd + alt + shift + f

replace in path


#### Refactor

- cmd + alt + m

extract the current methods into its own function

- cmd + alt + v

extract the current variable into its different location

- cmd + alt + p

extract the current parameter into its different location

Holding down CTRL when hovering over variables or methods will give you their full names or locations of declaration, while CTRL+Clicking on a variable or method, or pressing CTRL+B when on a method’s call or on a variable will take you directly to where it’s defined:



detects some problems, it will underline the problematic area and summon a lightblub on top of it when you hover your mouse or keyboard cursor in that area. Clicking this light bulb or pressing ALT+Enter will suggest solutions – in any language.

CTRL+N and CTRL+SHIFT+N will let you instantly move to any part of any class or file in your entire project:

The search is fuzzy, and also supports line numbers – you can use abbreviations followed by :XX where XX is the line number:

PhpStorm remembers multiple clipboard contents – you can press CTRL+SHIFT+V to summon a popup which lets you paste clipboard content that’s less recent than the latest.

Context-aware editing will allow you to edit a string that’s written in another language in a dedicated editor, complete with code hinting and autocompletion. For example, you if you have an HTML snippet written in a PHP string, you can ALT+ENTER in the string’s content and select Edit HTML content. This happens:

### VIM

- /    will type search and highlight any matching search query

to disable the highlight matching field, type `\` again to open the prompt, then type `:noh`, hit enter.

### JSDoc

Support JSDoc syntax,

- /** + enter

create a comment block with type. `@param {Boolean} parameterName`, got intelligent on wrong type parameter when calling

- alt + enter

When adding more parameters, it will update the jsDoc comment block
Or, it could convert all parameters into an Object, auto update the codehe

### Plugins

- [Mongo Plugin](https://github.com/dboissier/mongo4idea)

- [Emmet CheatSheet](http://docs.emmet.io/cheat-sheet/)


Delete the word start:  ctrl + delete
Delete the lin:  cmd + delete

cmd + j   insert the live template
complete the "script:src" tab, complete the file name by
enter `react`, then hit `ctrl + space` completion->basic return `no suggestion`, hit `ctrl+space` again, will go through all the directionary try to find it for you.

shrink selection:  ctrl+down

when file is open, could auto completion, type a couple of letters, cyclic expand word via  `ctrl+ /` from current file and then other open files

search anywhere, could run the gulp task by enter the gulp task name
There are several ways to organise your workflow with Gulp: first, you can assign a keyboard shortcut to Show Gulp tasks action in Preferences | Appearance and Behaviour | Keymap and then select the task you’d like to run with the keyboard and hit Enter to start a task. Secondly, since a new run configuration is created for every task, you can run (Ctrl-Alt-R on Mac or Alt+Shift+F10 on Windows and Linux) or debug it with the familiar shortcuts.

editorConfig is happened automatically, could override the IDE preference, can be disabled at code style section


PostFix completion, inside preference->editor->general->Postfix complete
"hello".log  tab
10.if  tab

PostFix completion

pretty similar to Live Templates, except that you’re invoking them after having written some code.
