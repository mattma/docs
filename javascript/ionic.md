## Ionic CLI

```bash
# ionic working solution CLI
ionic start newApp
cd newApp

ionic platform remove iOS
ionic hooks add
ionic platform add iOS
ionic build ios
```

```bash
# installing ionic CLI tool
npm install -g ionic

# start a new ionic project. created a folder called myIonic
ionic start myIonic

#Setup this project to use Sass
ionic setup sass

# develop in the broser with live reload
ionic serve

# Add a platform (ios or Android)
ionic platform add ios [android]

# Build your app
ionic build <PLATFORM>

# Simulate your app
ionic emulate <PLATFORM>

# Run your app on a device
ionic run <PLATFORM>

# Package an app using Ionic package service
ionic package <MODE> <PLATFORM>

# For more help use
ionic --help
ionic docs
```

- Andriod platform guide:

See the Android Platform Guide for full Android installation instructions:
https://cordova.apache.org/docs/en/edge/guide_platforms_android_index.md.html

## Cool Ionic

1. [Ionic Playground](http://play.ionic.io/)
2. [ionicons](http://ionicons.com/)
