## Plugins

1. [Plugin manager](http://alcatraz.io/)

2. [XToDo](https://github.com/trawor/XToDo)

`ctrl + t`  // trigger a list of the TODO, FIXME items

3. [XcodeColors](https://github.com/robbiehanson/XcodeColors)

XcodeColors allows you to use colors in the Xcode debugging console.

4. [BackLight](https://github.com/limejelly/Backlight-for-XCode)

5. [dash](https://github.com/omz/Dash-Plugin-for-Xcode)

6. [GitDiff](https://github.com/johnno1962/GitDiff)

No keyboard shortcut or anything to do necessary

7. [KSImageNamed-Xcode](https://github.com/ksuther/KSImageNamed-Xcode)

autocomplete your imageNamed: calls like you'd expect. Just type in [NSImage imageNamed: or [UIImage imageNamed: and all the images in your project will conveniently appear in the autocomplete menu.

8. [Peckham](https://github.com/markohlebar/Peckham)

`cmd + ctrl + p` start typing the keyword of your import
adding #import-s. a great addition to Xcode's autocomplete functionality.

9. [FuzzyAutocompletePlugin](https://github.com/FuzzyAutocomplete/FuzzyAutocompletePlugin)

more flexible autocompletion rather than just prefix-matching. work the same way the Open Quickly works. It performs very well, and the fuzzy matching actually uses Xcode's own IDEOpenQuicklyPattern.

6. [CocoaPods](https://github.com/kattrali/cocoapods-xcode-plugin)

To ease the development, have not installed and tried yet.
http://cocoapods.org/
http://code.tutsplus.com/tutorials/streamlining-cocoa-development-with-cocoapods--mobile-15938

`Option-Click` // opens Dash instead of Xcode's documentation browser
Install via the source code, cannot go from package manager

change the color of selection by choosing Edit->Backlight->Edit line backlight color

### Workspace window

                         toolbar             Assitant Editor

Navigation         Editing             Utility

                          Debugging


### Definition of concept

- Workspaces

Collections of files and projects with state.

What is in a workspaces?

Contains references to projects and other files
save state like open windows, breakpoints, etc.
provides a unique location for build products
provides a symbox index

Why use a workspace?

Groups together projects you want to use together
Finds implicit dependencies between targets
Opening a project gives you an implicit workspace. (init open state)


- Projects

Collections of files, targets, schemes, and build configurations

What is in a project?

references to source files
target which build products
schemes which build targets and perform actions
build configurations which select variants of target build settings
    - build setting can have per-configuration variants
    - debug and release are the default configurations
    - most settings do not need variants; a few do like minifier
    - create addional configurations

- Targets

Instructions for building one product

What is in a project?

references some or all source files in the project
contains build phases - the high level sequence of steps
build rules determine how to handle each file type
build settings control how it is done
can depend on one or more other targets

Why use build phases?

to set per-file compiler flags
to add resources to your product
to make a target depend on another target
to run a script while building

- Build settings

Values that control how a product is built

Why use build settings?

to change how a product is built - product name, SDK, perprocessor defines, warning flags, etc

- Schemes

Instructions for building targets and performing actions. Find scheme button right next to run button, stop button, click on the project name dropdown list -> edit schemes. Or  Product -> Scheme

Scheme is stored at per project based location. Click *manage scheme*, you should see container with its location, that is where it is stored. Look at the folder of `Shared Data` which shared by the whole team, `User Data` which only belong to you. `Scheme management Property List` which scheme is show or hide, which order they show up in the list.

What's in a Scheme?

Building is not an action. It is a step that happens before each of the scheme actions. When you perform an action, you build your target for that action, then perform that action.

There are 5 actions: running, testing, profiling, analyzing, and archiving products
A specification of targets to build for each action

When are Schemes created?

Automatically: per user
    when creating a new target or project
    when opening a project or workspace for the first time

Manually by the user:  edit a scheme
    The build configuration to use for each action
    the unit tests to run
    the arguments and environment for your app
    diagnostics enabled in the debugger
    other options

- Run Destinations

Devices on which you can perform scheme actions

The device you want to build for and run on - choose among plugged-in iOS devices configured for development, available simulators, and the local Mac.
Only devices compatible with your targets' Base SDK and deployment Target


### Interface Builder variable

1. @IBOutlet

Mostly used for creating variable. Connect visual object so that we could manipulate with the code

Important:

```swift
    @IBOutlet weak var label: UITexfField?
```
- weak & strong is for memory management, to define the ownership and responsibility of an element.

weak:    this var means it belongs to user interface
strong:  this var means it belongs to this code file

Sub view element of the window like label and button is strong, own by the swift file. So that in our variables, we need to define them weak when we make a connection to them

- UITexfField!  (explicitly unwrapped optional)

`!` means value could be `nil` at some point. In swift, any data type could have a `nil` value (means no value)

`?` is simply an optional. optional variable could be `nil` or having a value, however, when use optional, the value is wrapped up in a package. in order to access the value, you need to unwrapped the value with `!`. In example above, to access `label` value, use `label!.stringValue`. The value you know that it is not going to be `nil`, no need to be bothered to write `!` every time, simply just use define it as `UITextField!`

2. @IBAction

Mostly used for creating functions or methods.

#### xCode 6 new features

- Canvas Size

Size Classes(near the layout toolbar at the bottom of the Interface Builder canvas) identifies a relative amount of display space for the height (vertical dimension) and width (horizontal dimension). There are currently two size classes, compact and regular. For example, an iPhone in portrait will have a compact width and regular height. An iPad will have a regular width and height in both portrait and landscape orientations. But you should note that a size class doesn't necessarily map to one device in one orientation.

You will notice that the bar you click on to access the grid changed from white to blue. This is basically just warning you: "Hey you're not in the base configuration anymore! Some changes you make here will only show when your app is running with these specific size classes. So now this bar is blue!" I say 'some' changes because there are specifically 4 things you can change between size classes in interface builder: 1) constraint constants 2) fonts 3) turning constraints on/off 4)turning subviews on/off.

- Adaptive Segue Types

present views differently according to the environment they are run in.

- Live Rendering

select custom fonts from the Interface Builder font picker, create custom objects and have them render (adding your custom class to that target, and marking that class with the @IBDesignable flag), mark properties with the @IBInspectable flag so they can be edited just like any other properties on your views, and have them show up in the Interface Builder canvas

specify design time only code. for example, to pre-populate the view with example data to get a more accurate feel for the interface. You do this by overriding the prepareForInterfaceBuilder method. Other than that, you can use #if TARGET_INTERFACE_BUILDER to opt code in or out of being run in the final Interface Builder rendering.

- Preview Editor

view multiple previews of different simulated devices side by side,  set each of the devices to be in either portrait or landscape mode without first running it.

- Storyboards

set up your view layouts and wire views together with different segue animations.

- Gesture Recognizers

view the available gestures in the Object Library in Interface Builder.

- Localization

export all of your localizable content into XLIFF, which is the industry standard that's understood by a lot of translation services.  When you get the translations back, you import them and Xcode will merge the new content into your project. You should have one XLIFF file for each language you support in your app. You can now preview localized content without changing your device's or simulator's locale in Settings. To do this, select Product > Scheme > Edit Scheme, then select Run and click on the Options tab. You can select your language of choice from the Application Language menu. Xcode comes with the Double Length Pseudolanguage that you can test with if you haven't added any other language. When you run the app, you should see the localized content.

You can also view localized content without running your app. To do this, you use the Preview Editor to switch between the different languages that your app supports. The default language will display in the bottom-right corner of the editor and when you click on it, you are presented with a list of the available languages. To test it out without adding a language, you can use the Double Length Pseudolanguage.

- Launch Images

To set a XIB or storyboard as your app's launch image, select the project in the Project Navigator and choose a target from the list of targets. Under the General tab, locate the section App Icons and Launch Images and select the correct file from the menu labeled Launch Screen File.


### TIPS

1. Cmd + ,

2. Ctrl + i

use `Cmd + a` to select everything, then use `ctrl + i` to reformat the current selection

Open the preferences

#### Navigation

1. Cmd + 1 ~ 8

Naviagte in the panes of navigation panel.

2. Cmd + 0

Show and Hide the navigation panel

3. Cmd + 9

Show/hide document outline. This is a custom add. from *key binding* search *outline* in preference.

3. Cmd + click ( on any source file )

On a symbol or method or function, will Jump to the definition in focused editor

4. Option + click ( on method, symbol )

instead of jump to the definition, get documentation right in the cursor
or just click on the method to get the help on the Help panel on right top

5. Option + click ( on any source file )

Instead of open the source file in the primary editor, will open in Assistant editor
Will work with any navigation task, will end up at Assistant editor

6. Cmd + Opt + click ( on any source file )

Jump to definition in assistant editor

7. Cmd + Opt + Shift + ,   or   Cmd + Opt + Shift + click ( on any source file )

Navigate -> Open in...  the navigation chooser. use arrow key and return key to navigate

8. Cmd + Shift + O

open quickly file or symbol, like fuzzy search. Can combine with `cmd` and `opt` to open in primary or assistant editor.

#### Editing

1. Ctrl + 1

Editor Jump Bar section, first pane would drop down with list of command for the source editor

2. Ctrl + 2 ~ 3

Editor Jump Bar section, source file back and forth button

3. Ctrl + 4

4. Ctrl + 5

Menu to show just the files, files that you want to quick go to

5. Ctrl + 6

Symbol menu to show all the classes, methods


#### Source Editor

1. Cmd + Ctrl + e

Rename all the localVariable. Edit all in scope


#### Assistant Editor

Secondary or tertiary editor, tracks contents of main editor, flexible editor orientation, excellent for auxiliary content

1. Cmd + Return

Standard Editor - Single editor shortcut

2. Cmd + Opt + Return

Assistant Editor - Dual editor shortcut

3. Cmd + Opt + Shift + Return

Version Editor - editor next to assistant shortcut


### Interface  Builder

1. shift + right click ( on Interface Builder )

Show menu of list of elements everything under the mouse on the canvas


### Debugging

1. Cmd + Shift + y

Show and hide debugging area

2. Cmd + Shift + c

Show and hide debugging area, and activate console panel


### Utility

1. Cmd + Opt + o

Show and hide utility panel

**2 ~ 5 would the items at bottom of the Utility area**

2. Cmd + Ctrl + Opt + 1

Show/hide file template libaray

3. Cmd + Ctrl + Opt + 2

Show/hide code snippet libaray

4. Cmd + Ctrl + Opt + 3

Show/hide object libaray

5. Cmd + Ctrl + Opt + 4

Show/hide media libaray

**6 ~ 11 would the items at top of the Utility area**

6. Cmd + Opt + 1

Show/hide file inspector

7. Cmd + Opt + 2

Show/hide quick help inspector

8. Cmd + Opt + 3

Show/hide identity inspector

9. Cmd + Opt + 4

Show/hide attribute inspector

10. Cmd + Opt + 5

Show/hide size inspector

11. Cmd + Opt + 6

Show/hide connection inspector




### Other tips

1. Snippet

Create Custom Code snippets by highlight block of code, then drag and drop them in the right bottom code snippet panel. Then edit the content, you could choose platform, language.

Then use `<# #>` syntax to wrap any text to be tokenized. so that it would be replaced with your own code in the future.

To create an completion shortcut with a sub string, then code completion will include this snippet, when you start to type the shortcut name, it will show up under the cursor

2. Find and replace

You find some items, then you want to replace with those instance with the new one. You could select one of the find instace, then delete this instance, so it won't be replaced with the replace method. Not touch that one case.

3. Symbol menu to find methods

Ctrl + 6, it will bring up the symbol menu, you could start typing to do type ahead to filter the return list

4. Custom documentation for your own code

add some custom documentation yourself, then xCode could parse that, show up in the documentation help with **option + click**

```swift
    // Find how to syntax from here.    `www.doxygen.org`

    /*! some documentation here..... <=Those will show in the *Description*

        @param layer the layer content ...  <=Those will show in the *Parameters*
        @return return value .....  <=Those will show in the *Returns*
     */
     func matt(layer: String) -> Bool { }
```

5. Update preference behavior

Behaviors -> Search -> Starts ->   check Show tab named <Search Results> in <Separate window>

Behaviors -> ( + add ) Custom -> Run Script -> Run <Choose Script> for power user

6. If have Questions

Dave Delong: app frameworks and developer tools evangelist    delong@apple.com

[Github Swift Repo](https://github.com/search?l=Swift&q=extension%3Aswift&ref=advsearch&type=Repositories)

[WeHeartSwift Blog](http://www.weheartswift.com/)

[Iphone Dev web sites](http://iphonedevsdk.com/)

http://www.plaidworld.com/iphonefaq.txt

Simulator:

    How do I simulate multi-touch?

        Hold down option

        If you hold option in the simulator,
        you can pinch, as always,
        but if you hold shift,
        you can change the center point of the pinch.


    How much free RAM do I really have to use?
        Apple told me about 40 MBs.

    What is the fastest way to draw on the iphone?
        OpenGL.


### Cocoa Touch

Cocoa Touch is the programming framework Built upon the Model-View-Controller paradigm driving user interaction on iOS. Using technology derived from Cocoa, Buttons, table lists, page transitions, and gestures on the iPhone are unique for the pocketable form factor, and all this UI power is available to developers through the Cocoa Touch frameworks.

When combined with the Interface Builder developer tool, it is both easy and fun to use drag-and-drop to design the next great iOS application.

UIKit provides the basic tools you need to implement graphical, event-driven applications in iOS. UIKit builds on the same Foundation framework infrastructure found on the OS X, including file handling, networking, string building, and more. Using UIKit you have access to the special GUI controls, buttons, and full-screen views on iOS. You also get to control your application with the accelerometer and the multi-touch gesture.


