There are a LOT of components out there. You can have an overview on [Custom Elements](https://customelements.io/).

## Custom elements

Note that the name must contain a dash, so that the browser knows it is a custom element.

custom element can have properties and methods, and it also has lifecycle callbacks, to be able to execute code when the component is inserted or removed, or when one of its attributes changes.

Usage: `<pony-cmp><pony-cmp>`.

```js
// let's extend HTMLElement
var PonyCmpProto = Object.create(HTMLElement.prototype);
// and add some template using a lifecycle
PonyCmpProto.createdCallback = function() {
  this.innerHTML = '<h1>General Soda</h1>';
};

// new element
var PonyCmp = document.registerElement('pony-cmp', {prototype: PonyCmpProto});
// insert in current body
document.body.appendChild(new PonyCmp());
```

Output the code below: `<pony-cmp><h1>General Soda</h1></pony-cmp>.` But that means the CSS and JavaScript logic of your app can have undesired effects on your component. So, usually, the template is hidden and encapsulated in something called Shadow DOM, and you’ll only see <ponycmp></ponycmp>. if you inspect the DOM, despite the fact that the browser displays the pony’s name.

## Shadow DOM

Shadow DOM is a way to encapsulate the DOM of our component. This encapsulation means that the stylesheet and JavaScript logic of your app will not apply on the component and ruin it inadvertently. It gives us the perfect tool to hide the internals of a component, and be sure that nothing leaks from the component to the app, or vice-versa.

```js
var PonyCmpProto = Object.create(HTMLElement.prototype);
// add some template in the Shadow DOM
PonyCmpProto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = '<h1>General Soda</h1>';
};

var PonyCmp = document.registerElement('pony-cmp', {prototype: PonyCmpProto});
document.body.appendChild(new PonyCmp());
```

if you try to add some style to the h1 elements, the visual aspect of the component won’t change at all: that’s because the Shadow DOM acts like a barrier.

'<h1>General Soda</h1>' as a template of our web component is not good, the best practice is to use the <template> element.

## Template

A template specified in a <template> element is not displayed in your browser. Its main goal is to be cloned in an element at some point. What you declare inside will be inert: scripts don’t run, images don’t load, etc… Its content can’t be queried by the rest of the page using usual method like `getElementById()` and it can be safely placed anywhere in your page.

```js
<template id="pony-tpl">
  <style>
  h1 { color: orange; }
  </style>
  <h1>General Soda</h1>
</template>

var PonyCmpProto = Object.create(HTMLElement.prototype);
// add some template using the template tag
PonyCmpProto.createdCallback = function() {
  var template = document.querySelector('#pony-tpl');
  var clone = document.importNode(template.content, true);
  this.createShadowRoot().appendChild(clone);
};

var PonyCmp = document.registerElement('pony-cmp', {prototype: PonyCmpProto});
document.body.appendChild(new PonyCmp());
```

Maybe we could declare this in a single file, and we would have a perfectly encapsulated component via HTML imports!

## HTML imports

HTML imports allow to import HTML into HTML. Something like `<link
rel="import" href="pony-cmp.html">`. This file, `pony-cmp.html`, would contain everything needed: the template, the scripts, the styles, etc
