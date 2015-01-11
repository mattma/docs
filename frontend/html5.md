## Shadow DOM

Problem: There is a fundamental problem that makes widgets built out of HTML and JavaScript hard to use: The DOM tree inside a widget isn’t encapsulated from the rest of the page. This lack of encapsulation means your document stylesheet might accidentally apply to parts inside the widget; your JavaScript might accidentally modify parts inside the widget; your IDs might overlap with IDs inside the widget; and so on.

Web Components is comprised of four parts: Templates, Shadow DOM, Custom Elements, Packaging

Shadow DOM addresses the DOM tree encapsulation problem. The four parts of Web Components are designed to work together, but you can also pick and choose which parts of Web Components to use.

- Core concept

With Shadow DOM, elements can get a new kind of node associated with them. This new kind of node is called a shadow root. An element that has a shadow root associated with it is called a shadow host. The content of a shadow host isn’t rendered; the content of the shadow root is rendered instead.

```html
<button>Hello, world!</button>
<script>
    var host = document.querySelector('button');
    var root = host.createShadowRoot();
    root.textContent = 'こんにちは、影の世界!';
</script>

<!-- HTML output
because the DOM subtree under the shadow root is encapsulated. -->
<button>こんにちは、影の世界!</button>
```
