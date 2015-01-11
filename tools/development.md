## NPM

1. [juice2](https://www.npmjs.org/package/juice2)

Inlines css into html source, what ghost used to compile raw html into email-template

https://github.com/TryGhost/Ghost/wiki/HTML-email-template-generation

In your terminal, change directories to /path/to/Ghost/core/server/email-templates
To generate in in-lined CSS version, run juice2 raw/input.html output.html
where raw/input.html is the file you originally edited and out.html is the file you want to generate

2. [Pageres](https://github.com/sindresorhus/pageres)

For generating responsive screenshots from the command-line

ex: pageres [todomvc.com 1200x1000] [yeoman.io 800x1000 1200x100-] --crop
// successfully genearted 3 screenshots from 2 urls and 2 resolutions

3. [Too many images](https://github.com/addyosmani/tmi)

Discover your image weight on the web. Find out the image weight in your pages, compare to the BigQuery quantiles and discover what images you can optimize further.

4. [WebPageTest CLI](https://github.com/marcelduran/webpagetest-api)

ex: webpagetest test <url>
ex: webpagetest test <url> --wait 8000

## Beautify and Fix issues in your source

- jsfmt

format, search, and rewrite js.  ex: jsfmt -w=true source.js

- jsinspect

detect structural similarities in code   ex:  jsinspect -t 30 -i ./scripts

- fixmyjs

Non-destructively fix linting errors   ex: fixmyjs source.js



## Debugging Experience

#### Chrome DevTool

- React DevTools
- Angular Batarang
- ES6 REPL
- Gradient Inspector
- Tamper (Modify requests before serving). (add `proxy` tab)

- Sip color picker
- Chrome DevTools Eye dropper
