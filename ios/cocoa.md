### Delegation

Used throughout cocoa development. One object act on behalf of another object. Used for event handling, callbacks, or similar to inheritance, etc. It has been writen by default when the project is created. in simple term, Delegation handle a list of declared methods which declared somewhere else in the codebase. handle on behave of another object.

We could support the delegate method that we want to support, or ignore the methods that you do not. A whole bunch of optional delegation method, support them as needed.

ex: AppDelegate class, it uses NSApplicationDelegate protocol. It will behave some task on behalf of `NSApplication` (main loop). For example, app finished launching, app became active, will inform the `AppDelegate` class. It can handle it accordingly.

ex: Any UI element (on the IB), click on element, then go to `connection inspector`, in the `outlet` section, you could check if this element has delegate method or not. if delegate, you could connect from IB with swift file, with supported delegate protocol. If it has the delegate property, go to *quick help* section, you could check it in the doc. at tasks find *setDelegate* section.

- Workflow for delegation

define the protocol, or use existing protocol
declare protocol adoption.
set instance as a delegate if nessessary
handle required methods
handle optional methods as needed

### User Interface

.storyboard: it is a XML file format. Right click on it, then select `open as` -> `source code`. XML store the elements on the Interface builder, the location, properties and all the information based on how I create the IB. Behind the scene, there is no Swift code written, just a XML to controlling the IB elements.

First Responder:  it is not always the same. It is the first object to handle the event. Ex: multiple textfield, the active textfield is the first responder. Click another textfield, that textfield become first responder. They are the one to receive events.

