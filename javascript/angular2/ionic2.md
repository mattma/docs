# Ionic2

## Resources

[Ionic Marketplace](https://market.ionic.io/themes)
[Ionic Themes](https://ionicthemes.com/)

## Andriod Emulator: Genymotion, [Andriod SDK](http://developer.android.com/sdk/index.html#Other)

The default Android Emulator is very slow so instead of using that, we can install the [Genymotion](https://www.genymotion.com/) emulator. Besides being fast, it also has more than 3000 Android configurations to test with. You'll have to create an account (free for personal use) to be able to download it.

## Installation

```bash
npm install -g cordova ionic@beta
```

## Quick start

```bash
# blank: based on the blank Ionic template
# --ts:  use the TypeScript template
# --v2:  create an Ionic 2 project
ionic start PROJECT_NAME blank --v2 --ts
cd PROJECT_NAME

# start an HTTP server to host the files in the www folder and launch your default browser. Support live-reload
ionic serve
```

**Build app in device**

1. view the iOS and Android versions of your app next to each other in the browser. Also support live-reload

```bash
ionic serve --lab
```

2. iOS or Android Emulator

```bash
# Add iOS and Android Platforms:  creates an ios and an android folder and these contain the actual XCode and Android projects for the app. These projects will eventually be built into the packages that will be deployed to the App Stores.
ionic platform ios
ionic platform android

# Test in an Emulator
ionic emulate ios

# First start an emulator in Genymotion and then run
# `ionic emulate android` which would fire up the default Android Emulator. The Genymotion Emulator is seen by the Ionic CLI as a real device
ionic run android
```

3. Test iOS or Android device

```bash
ionic run ios
ionic run android
```

## Ionic CLI

With the Ionic 2 CLI you can automatically generate `pages`, `providers`, `tabs`, `pipes`, `components` and `directives` and it will set up all the files you need and some boiler plate code.

```bash
ionic plugin add cordova-plugin-x-socialsharing
```

## Ionic Folder structure

all of your coding will be done inside of the app folder, which is completely separate to the www folder which contains the code that is actually served to the browser. When you run an Ionic 2 application, the code in the app folder is automatically transpiled and bundled into a single Javascript file which is copied into the www folder and served. For the most part, you don’t have to touch your index.html file at all.

app:  This folder will contain all the code you're going to write for the app, ie. the pages and services.

hooks:  This folder contains scripts that can be executed as part of the Cordova build process. This is useful if you need to customize anything when you're building the app packages.

resources:  This folder contains the icon and splash images for the different mobile platforms.

www:  This folder contains the index.html, remember all the app code should be in the app folder, not in the www folder.

config.xml:  This file contains the configuration for Cordova to use when creating the app packages.

ionic.config.js:  Configuration used by the Ionic CLI when excuting commands.

## [Ionic Docs](http://ionicframework.com/docs/v2/components/#overview)

- platform.ready

the plugin uses native code it needs to be wrapped in the `platform.ready` otherwise you could face errors.  When the device is ready we check to see if the plugin is installed and exists and if it does, show the share menu.

- Nav

`@App` decorator to declare this component as the root component of the application.

```js
@App({
  // ion-nav: This is a navigation controller and we'll use it later on to navigate between the pages
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}
})
export class MyApp {
  // rootPage is set to HomePage, so the navigation controller knows which page to load when the app is launched.
  rootPage: Type = HomePage;
  constructor(app: IonicApp, platform: Platform) { }
}
```

The `NavController` already has the first page loaded: HomePage and to navigate to DetailsPage, we `push` it onto the navigation stack and the framework will take care of loading the page and displaying the view transitions that are unique to the mobile platform.

We can use the `pop` function to take DetailsPage out of the navigation stack, the navigation controller will then go back to HomePage.

We don't need to explicitly use the `pop` function if DetailsPage has an <ion-navbar> because the framework will put a Back button in the navigation bar. When the user taps this button, the pop will be automatically executed.

```js
import {Page, NavController} from 'ionic-framework/ionic';
import {DetailsPage} from '../details/details';

class ... {
  goToDetails(repo) {
    this.nav.push(DetailsPage, { repo: repo });
  }
}
````

- Page

Ionic uses it's own decorator `@Page` instead of the default Angular 2 `@Component` decorator

```js
import {Page} from 'ionic-framework/ionic';
import {GitHubService} from '../../services/github';

@Page({
  template: `
  <ion-navbar *navbar>
    <ion-title>GitHub</ion-title>
  </ion-navbar>

  <ion-content class="home">
    <ion-list inset>
      <ion-item>
        <ion-label>Username</ion-label>
        <ion-input [(ngModel)]="username" type="text"></ion-input>
      </ion-item>
    </ion-list>
    <div padding>
      <button block (click)="getRepos()">Search</button>
    </div>
    <ion-card *ngFor="#repo of foundRepos">
      <ion-card-header>
        {{ repo.name }}
      </ion-card-header>
      <ion-card-content>
        {{ repo.description }}
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
  providers: [GitHubService]
})
export class HomePage {
  public foundRepos;
  public username;

  constructor(private github: GitHubService) {}

  getRepos() {
    this.github.getRepos(this.username).subscribe(
      data => this.foundRepos = data.json(),
      err => console.error(err),
      () => console.log('getRepos completed')
    );
  }
}
```

## Tutorials

[Ionic Blog](http://blog.ionic.io/)
[gonehybrid](http://gonehybrid.com/build-your-first-mobile-app-with-ionic-2-angular-2-part-6/)(https://github.com/ashteya/ionic2-tutorial-github)
[pointdeveloper](http://pointdeveloper.com/category/ionic-framework/ionic-2/)
[polyglotdeveloper](https://www.thepolyglotdeveloper.com/category/apache-cordova-2/ionic-2/)
[joshmorony](http://www.joshmorony.com/category/ionic-tutorials/)
[coenraets](http://coenraets.org/blog/category/ionic/)

[Ionic2 Book](https://www.joshmorony.com/building-mobile-apps-with-ionic-2/)

## Builder

[AppBuilder](http://www.telerik.com/platform/appbuilder)
