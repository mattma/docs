# [spy-js](https://github.com/spy-js/spy-js)

In a nutshell, spy-js is a tool for JavaScript developers that allows to simply debug/trace/profile JavaScript on running on different platforms/browsers/devices. It fills gaps that existing browser development tools have and tackles common development tasks from a different angle.

SpyJs allows tracing our code without resorting to console.log, debugging it without breakpoints and profiling it without breakpoints or any specialized tools, and profile it without JavaScript execution engine specific tools. When running our application with spy-js, it gathers intelligence which we can use to see exactly what was going on in our code, even if it’s no longer running.

### Spy-js

work with [VM](https://github.com/spy-js/spy-js#virtual-machine-configuration)
work with PhantomJs
work with Karma Runner
work with Development proxy (like Fiddler or Charles proxy) configiration
work with HTTPS tracing configuration example
work with Mobile device proxy configuration

### Configuration

Spy-js can work with zero configuration or be configured with *.conf.js ( valid js file )

Configuration file sample

```js
    module.exports = function($) {

      // URL of the page/website to trace (optional)
      // $.root = 'http://todomvc.com/architecture-examples/knockoutjs/';

      // in mapper function you can configure whether to trace certain scripts and how
      // by returning configuration object for the script(s) URL
      $.mapper = function(url) {

        // no tracing for files that contain jquery in their names (jquery and plugins)
        if (url.indexOf('jquery') >= 0)
          return {
            instrument: false
          };

        // Add more rules for scripts as required

        // To achieve best tracing performance and more accurate profiling figures:
        //    instrument only scripts you'll be looking into (set instrument: false for those you're not interested in)
        //    do not prettify scripts that already looked ok (not minified, formatted nicely)
        //    set objectDump property to false for scripts where you don't need to trace function params and return values
        //    set minimum necessary limits inside objectDump property for scripts where need to trace function params and return values

        // Following configuration means that the rest of scripts are traced,
        // prettified,
        // function params and return values collected
        // (object depth: 1 level, maximum 3 properties or array elements, strings are truncated if more than 50 chars)
        return {
          instrument: {
            prettify: true,
            objectDump: {
              depth: 1,
              propertyNumber: 3,
              arrayLength: 3,
              stringLength: 50
            }
          }
        };
      };

      // with event filter you specify what you want and don't want to see in events list,
      // five properties in the event filter object that you can set: globalScope, timeout, interval, events and noEvents.
      // for example with the following event filter
      // spy-js will show program execution scope(s), intervals, will not show timeouts,
      // will only show all events except blacklisted DOMContentLoaded and keyup (use events: [...] to whitelist events to show)
      $.eventFilter = {
        globalScope: true,
        timeout: false,
        interval: true,
        noEvents: ['DOMContentLoaded', 'keyup']
      };
    };
```

### Running Spy-js in WebStorm

When a spy-js run configuration starts, it also starts a spy-js trace server that is implemented using node.js. The trace server acts a proxy server, captures your browser traffic and changes JavaScript files on the fly. The change does not affect the logic of your application; spy-js just inserts additional code instructions to collect runtime information as the code executes and sends the information back to the IDE via the trace server. By default, spy-js will instrument all JavaScript files, prettify minified files, collect runtime information for all events, record function parameters, and return values.

Basically, this means that spy-js can trace any JavaScript code that it can proxy. With spy-js, you can trace any Internet website or locally hosted website, as long as it’s not a HTTPS resource.

By default, when capturing object runtime values, spy-js does it by traversing no deeper than 1 level into the objects, capturing no more than 3 properties of each traversed level, no more than 3 elements if the object is an array, and no more than 50 characters of each string captured property.

If you’d like to change some of the above mentioned parameters of the default configuration, and to have granular control over capturing settings down to how individual files of your application are traced, you can create and use a [custom configuration file](https://github.com/spy-js/spy-js#configuration).  The name of the file should follow the pattern *.conf.js. You can have multiple configuration files for different run configurations.

spy-js tool window and its three panes. 1. Events, 2. Event Stack, 3.Trace File

Trace files are a read-only representation of the executed code. If you’d like to edit the actual source code, open the context menu of the selected stack node and click Jump to Trace.

Step:

* create a new **Run Configuration** of the Spy-js for Node.js type. If front end, need a separated config

The parameters we have to specify are very similar to a regular Node.js Run Configuration:
the Node interpreter,
the working directory, the path to the JavaScript file we want to execute and so on. Optionally, we can provide a [spy-js configuration](https://github.com/spy-js/spy-js#configuration) file and decide which TCP port it will use to do its work.

With spy-js for Node.js, we can now trace, debug and profile our server-side code. It’s worth mentioning that two spy-js sessions can be launched at the same time: one for the browser and one for Node.js. This gives us a nice end-to-end view of what’s happening in our application. The spy-js tool window will show both sessions in a different tab.

* launch our app using the newly created Run config. `ctrl + r`

* Spy-js Tool Window would open in which we can see the various types of information spy-js collects.

showing the stack tree along with a short file and function name. For npm packages, the name of the module is displayed as well. We can also see the execution time of the function. Some nodes may have their execution time rendered in blue, meaning the function is responsible for more than 50% of the execution time of the expanded stack level. A perfect candidate to look into for performance optimization! Nodes rendered in red have had an unhandled exception occur.

Press enter or use the Jump to Trace context menu of the selected node. Spy-js will show us the code with executed statements highlighted, and we can hover over variables to see their values, or over functions to see their return values. Note that we can also enable Autoscroll to Trace from the toolbar to automatically open the trace file when selecting a node.

* Mute Files and Modules

By using the **Mute this node module** context menu on any of the Express functions, the tree will contain everything except the muted module on subsequent requests.

* Code completion

Before using these new features, make sure to select “Enable spy-js autocomplete and magnifier” in the Events toolbar menu. By doing so, you will allow spy-js to perform some additional ‘dark magic’ during its code instrumentation phase, to make possible what you’re about to see.

Spy-js completion is different as it uses runtime data to complement WebStorm standard completion and to provide very precise suggestions that reflect the reality of the executed code. Due to the dynamic nature of JavaScript, static analysis cannot reach many corners of your codebase. Spy-js comes to rescue in these cases, as it doesn’t have to guess what to suggest for an autocompletion list—it knows it exactly.

Being powered by runtime data has its price. There are two major things you have to remember when working with spy-js completion assistance. First, the code where you’re expecting completion suggestions from spy-js has to be executed first. Second, when you change your code, some previously valid runtime data may become obsolete until you re-run your code. it works best if you re-run your code periodically to keep the runtime data up-to-date.

Just start spy-js Run Configuration and hover the mouse over any expression in any executed context/scope (or press Cmd-Alt-F8) to get the latest value for the expression.

* work best with named function so that you could search it.

