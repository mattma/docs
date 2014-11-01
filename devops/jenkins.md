

## Continuous Deployment of Node.js Applications

#### Continuous integration

It is the process of merging development work with the master several times a day / constantly.

Benefits: 1. Catch issues early  2. prevent "integration hell"

#### Continuous delivery

It is the practice of delivery of code to an environment, whether it is a QA team or customers, so they can review it. After the changes get approved, they can land in production.

#### Continuous deployment

when each change that passes the automated tests are deployed to production automatically. Continuous deployment heavily relies on an infrastructure that automates and instruments the process of testing, integration and deployment of new features.


Steps

1. Every commit to the master should trigger a new build with tests

A build can have a lot of steps, some of them can run in parallel. Speaking of Node.js applications, the following steps can occur:

* installing dependencies from NPM (public or private)
* run unit tests
* build assets, like css and javascript

Note: Feature toggles

They are alternatives to feature branches and allows developers to release a version of a product that has unfinished features. These unfinished features are hidden by the toggles in production environment. When the feature is ready, the feature toggle can be removed.

        // https://www.npmjs.org/package/feature-toggles
        var featureToggles = require('feature-toggles');
        var toggles = {  foo: true, bar: false };  // define toggles

        featureToggles.load(toggles);  // load them into the module

        // check if a feature is enabled
        if (featureToggles.isFeatureEnabled('foo')) {
            // do something
        }

* run integration/end-to-end tests

Note: Automated tests

Your modules must be covered by unit tests, and to check if everything works together you should have integration tests in place too. ( Mocha and an expectation library like Chai)

Note: end to end testing

If your application does not have a frontend, but is an API, you can use [hippie](https://github.com/vesln/hippie) or [supertest](https://github.com/visionmedia/supertest) for end-to-end tests.

When developing an application with frontend involved, you still have options to test the user interface as well. Nightwatch](http://nightwatchjs.org/). To make sure it works in every browser you support, run your end-to-end tests on a Selenium cluster. Or you can use services like [Sauce Labs](https://saucelabs.com/) or [Browserstack](http://www.browserstack.com/).

* creating artifacts (bundle the node_modules directory to it as well, so during deployment, you won't depend on NPM)

If all the tests pass then it is time to create an artifact from the build. An artifact should contain every single file that is necessary to run your application, so your production servers won't have to deal with building it again.

A simple tar filename.tar * can do the trick. Then make sure to place this file in a location where it is accessible for your production servers, so they can get it, like Amazon's S3, or any other storage.

2. Deploy

As we just created an artifact containing every assets that our application needs, we only need to do the following things:

* download the latest artifact
* unpack it to a new directory
* update the symlink, so it will point to the directory just created -
* restart the node application

Note: It goes without saying: this process must be automated, and no manual steps should be involved. Tools like Docker, Ansible, Chef or Puppet can help.

3. Rollbacks

If things can go wrong, they will. Make sure to have a rollback script in place. The fastest and easiest way to do this is to set the symlink to a previous build and restart the node application.
