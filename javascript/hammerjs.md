# [Hammer](http://hammerjs.github.io/)

## Usage. include the library and create a new instance.

```js
var hammertime = new Hammer(myElement, myOptions);
hammertime.on('pan', function(ev) {
    console.log(ev);
});
```

## Event type

default:  tap, doubletap, press
horizontal:  pan, swipe
multi-touch:  pinch, rotate

The pinch and rotate recognizers are disabled by default because they would make the element blocking, but you can enable them by calling:

```js
hammertime.get('pinch').set({ enable: true });
hammertime.get('rotate').set({ enable: true });
```

Enabling vertical or all directions for the pan and swipe recognizers:

```js
hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
```

Also the viewport meta tag is recommended, it gives more control back to the webpage by disabling the doubletap/pinch zoom. More recent browsers that support the touch-action property don't require this.

```html
<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
```

## Customization

You can setup your own set of recognizers for your instance. This requires a bit more code, but it gives you more control about the gestures that are being recognized.

```js
var mc = new Hammer.Manager(myElement, myOptions);
// creates an instance containing a pan and a quadrupletap gesture
mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
mc.add( new Hammer.Tap({ event: 'quadrupletap', taps: 4 }) );
// being executed in the order they are added, and only one can be recognized at the time.
mc.on("pan", handlePan);
mc.on("quadrupletap", handleTaps);
```

## Tips and Tricks

1. Event delegation and DOM events

Hammer is able to trigger DOM events with the option `domEvents: true`. This will give your methods like `stopPropagation()`, so you can use event delgation. Hammer will not unbind the bound events.

2. Try to avoid vertical pan/swipe

Vertical panning is used to scroll your page, and some (older) browsers don't send events so Hammer isn't able to recognize these gestures. An option would be to provide an alternative way to do the same action.

3. Remove tap highlight on Windows Phone

IE10 and IE11 on Windows Phone have a small tap highlight when you tap an element. Adding this meta tag removes this.
<meta name="msapplication-tap-highlight" content="no" />

4. "I can't select my text anymore!"

Hammer is setting a property to improve the UX of the panning on desktop. Regularly, the desktop browser would select the text while you drag over the page. The `user-select` css property disables this.

If you care about the text-selection and not so much about the desktop experience, you can simply remove this option from the defaults. Make sure you do this before creating an instance.

`delete Hammer.defaults.cssProps.userSelect;`

5. "After a tap, also a click is being triggered, I don't want that!"

That click event is also being called a 'ghost click'. I've created a small function to prevent clicks after a touchend. It is heavily inspired from this article from Ryan Fioravanti.

https://gist.github.com/jtangelder/361052976f044200ea17
