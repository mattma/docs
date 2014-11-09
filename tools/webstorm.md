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

- Configuration

    ~/Library/Preferences/<PRODUCT><VERSION>

- Caches

    ~/Library/Caches/<PRODUCT><VERSION>

- Plugins

    ~/Library/Application Support/<PRODUCT><VERSION>

- Logs

    ~/Library/Logs/<PRODUCT><VERSION>



cmd + shift + d    // open dash doc

cmd + shift + a  ||  cmd +shift + p  // find actions, search for commands of the IDE

ctrl + alt + L   // format your code based on preferred style

Holding down CTRL when hovering over variables or methods will give you their full names or locations of declaration, while CTRL+Clicking on a variable or method, or pressing CTRL+B when on a method’s call or on a variable will take you directly to where it’s defined:

CTRL+Space   // code hinting dialog

detects some problems, it will underline the problematic area and summon a lightblub on top of it when you hover your mouse or keyboard cursor in that area. Clicking this light bulb or pressing ALT+Enter will suggest solutions – in any language.

CTRL+N and CTRL+SHIFT+N will let you instantly move to any part of any class or file in your entire project:

The search is fuzzy, and also supports line numbers – you can use abbreviations followed by :XX where XX is the line number:

PhpStorm remembers multiple clipboard contents – you can press CTRL+SHIFT+V to summon a popup which lets you paste clipboard content that’s less recent than the latest.

Context-aware editing will allow you to edit a string that’s written in another language in a dedicated editor, complete with code hinting and autocompletion. For example, you if you have an HTML snippet written in a PHP string, you can ALT+ENTER in the string’s content and select Edit HTML content. This happens:

cmd + t     //search everywhere. find anything from IDE commands to files, classes, function, actions, preferences, declarations and more.

cmd + r    // search methods in file
