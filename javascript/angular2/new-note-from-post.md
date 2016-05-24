Angular 2 is not an MVC framework, but rather a component-based framework. In Angular 2 an application is a tree of loosely coupled components. You app is a tree of self-describing components. Components have lifecycles, state, routable.  state is immutable, functions apply predictable transformations to data to produce new data.

Components can be further categorized as well. A common way to think about components is to separate them into two categories, components that organize and orchestrate application logic and components that present user interface with inputs and outputs. This distinction is sometimes called “smart” and “dumb” components.

Container components coordinate the presentation components, application logic, and service interactions that make up your application. Presentation components can be reused and don’t know anything about the overall application. They take input data and generate output data through events, which are handled by the container components.

Immutable Data
If your model data is an object or an array, changes can occur anywhere within the model data. Therefore, you are not sure whether the model itself has changed unless you check for changes throughout the model’s data, such as object properties, child objects, or array entities.

With immutable data objects, change detection becomes very easy. An immutable data object means that the reference to the object and all of the object’s properties and children will not change. Once they are set they cannot be changed unless a new object is created that merges the original object properties with the changes. But at this point, it is a new object and this object has a different reference. So the test for whether an immutable object has changed simply boils down to an equality test.

The fundamental premise of redux is that the entire state of the application is represented in a single JavaScript object called a store, or application store, that can be acted upon using special functions called reducers. Equally important is that state is immutable and reducers are the only part of the application that can change them.

```
// state management
        (event Binding)
   ---->   Parent   ----->
   |                     |
   | @Output()           |  @Input()
   ^----   Child   ------^
      [property binding]
```

```js
// Components LifeCycle
class Application {
  ngOnInit() {}
  ngOnDestroy() {}
  ngDoCheck() {}
  ngOnChanges(changes) {}
  ngAfterContentInit() {}
  ngAfterContentChecked() {}
  ngAfterViewInit() {}
  ngAfterViewChecked() {}
}
```

Bind example

```html
<!-- properties binding -->
<input [value]="firstName">
<div [class.extra-sparkle]="isDelightful">
<div [style.width.px]="mySize">
<label [attr.for]="someName"></label>

<!-- event binding -->
<button (click)="readRainbow($event)">

<!-- two way binding -->
<my-cmp [(title)]="name">

<!-- builtin directives -->
<section *ngIf="showSection">
<li *ngFor="#item of list">
```

COMPONENT ROUTER

```js
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';

@Component({
  selector: 'app',
  template: `
  <h1>Component Router</h1>
  <nav>
    <a [routerLink]="['Customers']">Customers</a>
    <a [routerLink]="['Orders', {id: order.id}]">Orders</a>
  </nav>
  <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
{ path: '/', name: 'Customers', component: CustomersComponent, useAsDefault: true },
{ path: '/orders/:id', name: 'Orders', component: OrdersComponent },
{ path: '/details/...', name: 'OrderDetails', component: DetailsComponent }
])

export class AppComponent {
    constructor(private params: RouteParams) {
        let id = this.params.get('id');
    }
}
```

ATTRIBUTE DIRECTIVE

```js
import {
  Directive,
  ElementRef,
  Renderer,
} from 'angular2/core';

@Directive({
  selector: '[myHighlight]'
})
export class MyHighlightDirective {
  constructor(el: ElementRef, renderer: Renderer) {
    renderer
        .setElementStyle(
            el.nativeElement,
            'backgroundColor',
            'yellow'
        );
  }
}
// usage
// <span myHighlight>Highlight me!</span>
```

Custom Pipe

```js
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return '';
    }
    return value.trim();
  }
}
```

Output events

```js
import {Component, Output, EventEmitter} from 'angular2/core';
@Component({
    selector: 'child-cmp'
    /* configuration */
})
export class ChildCmp {

  @Output('onChildEvent') outputEvent: EventEmitter<string>;

  constructor() {
    this.outputEvent = new EventEmitter<string>();
    this.outputEvent.emit('foo');
  }

}
```

- Dependency Injection: Components use services for implementing business logic. Services are just classes that Angular instantiates and then injects into components. Angular’s dependency injection module is flexible, and it is easy to use because the objects can be injected only via constructors. Injectors form a hierarchy (each component has an injector)

- Architechture: Render engine

The rendering engine in a separate module allows third-party vendors to replace the default DOM renderer with one that targets non browser-based platforms. For example, this allows reusing the application code across devices, with the UI renderers for mobile devices that use native components. The code of the TypeScript class remains the same, but the content of the @Component annotation will contain XML or another language for rendering native components. Ex: NativeScript, React Native

Angular 2’s architecture makes it possible to render an application with various renderers including React Native. One of the fundamental architectural decisions made for Angular 2 was the separation of the framework in two layers: the core, dealing with components, directives, filters, services, router, change detection, DI, I18n –, and the renderer, dealing with DOM, CSS, animation, templates, web components, custom events, etc. The core can be executed in a separate process, decoupling it from the interface and making the later more responsive when the core has lots of processing to do. More about this decision can be found in the [Angular 2 Rendering Architecture document](https://docs.google.com/document/d/1M9FmT05Q6qpsjgvH1XvCm840yn2eWEg0PMskSQz7k4E/edit#heading=h.nhg64961z5gu).

The DOM Renderer in Angular2 is built in such a way that it allows it to be extended and overridden with rendering code that can render the application in another environment besides the DOM. The first thing to understand is that the internal bits of Angular2 are split into two areas: the worker (core) area and the UI area. The worker (core) area is responsible for building out the components, directives, filters, services and bootstrap code; The UI area is responible for rendering out the application in the DOM. Another way to think of this is that the worker area is the CPU/memory of the application and the UI area is the graphics card.

When an Angular2 application is doing its thing, the worker area sends instructions over to the UI area describing what elements to insert/remove into/from the DOM and what other DOM-related properties to update. The UI area then listens on the set event listeners and then tells the worker area what user-driven activities have occurred.

    Core (App Code)     ---- Instructions ---->    UI (Dom | Server)
                        <--- Events/Message ---
      Web Worker                                      UI Thread

This separation of rendering from the main app has multiple benefits. An Angular 2 application can run on Node.js, run on the desktop via Angular Electron or on Microsoft’s UWP, run on mobile devices, some of the options for Angular 2 are Ionic 2, NativeScript or React Native.


```js
// Making our own Renderer. https://github.com/matsko/angular2-canvas-renderer-experiment (custom code)https://github.com/matsko/angular2-multi-client (Electron)
// Most of these imports are burried deep in the framework...
import {DomRenderer, DomRootRenderer} from 'angular2/src/platform/dom/dom_renderer';
import {provide, Renderer, RenderComponentType, RootRenderer} from 'angular2/core';
import {ChangeDetectorGenConfig} from 'angular2/src/core/change_detection/interfaces';

// When Angular attempts to render out the application it will execute the various function calls present on the active renderer. by default DomRenderer however in this case CanvasRenderer
class CanvasRootRenderer extends DomRootRenderer {
  constructor(_eventManager: EventManager, sharedStylesHost: DomSharedStylesHost, animate: AnimationBuilder) {
    super(document, _eventManager, sharedStylesHost, animate);
  }

  renderComponent(componentProto: RenderComponentType): Renderer {
    // create a new canvas renderer
    return new CanvasRenderer(this, componentProto);
  }
}

class CanvasRenderer extends DomRenderer {
  constructor(_rootRenderer: CanvasRootRenderer, componentProto: RenderComponentType) {
    super(_rootRenderer, componentProto);
  }

  createElement(parent: Element, name: string): Node {
    // this is called for every HTML element in the template
  }

  createViewRoot(hostElement: any): any {
    // this is called for the component root
  }

  createText(parentElement: any, value: string): any {
    // this is called for every text node in the template
  }

  setText(renderNode: any, text: string): void {
    // this is called when a binding sets its text value
  }

  attachViewAfter(node: any, viewRootNodes: any[]) {
    // this is called when nodes are inserted dynamically (ngFor, ngIf, etc...)
  }
}

// this your actual application
import {MyApp} from './my-app/my-app';
bootstrap(MyApp, [
  // bind the renderer to the application
  provide(RootRenderer, { useClass: CanvasRootRenderer }),

  // this is only here to not have Angular2 do code generation (which is something
  // that may get in the way when creating a custom component since we won't
  // creating our own code generation per renderer)
  provide(ChangeDetectorGenConfig, {
    useValue: new ChangeDetectorGenConfig(true, false, false)
  })
]);
```

* React Native

Read [React native scheduling](https://www.facebook.com/notes/andy-street/react-native-scheduling/10153916310914590/)

Technically, a React Native application runs 3 threads. The main one is a JS thread where any JS code can be executed; it controls the full application. The other two run the native part of the application: the standard main UI thread, and a “shadow” thread where measuring and layout occur.

The native and JS sides communicate in both directions through a bridge. This means that there are Bridge JS APIs to access native features (network, geolocation, clipboard, etc) and  manipulate native elements, and that native events are sent back to the JS side.


- Angular2 VS React

It’s important to note from the get-go that in many ways comparing React to Angular (any version) is comparing apples to oranges. Angular is designed as a front-end framework, providing a full architecture for the client side of your application and allowing you to treat your client code as a robust suite of functionality. React is a library, and much less intrusive in terms of the features offered – it’s intended to be used as a part of a whole, rather than dictating your code’s structure

Good read: http://blog.backand.com/angular-2-vs-react/