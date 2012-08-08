# Mojito Application - Hybrid Example

## See it in Action

Here is an example of a News Headline Application for either a [Phone](http://capecodehq.github.com/mojito_app_hybrid_example/phone) or a [Tablet](http://capecodehq.github.com/mojito_app_hybrid_example/tablet). Both are built with [Mojito](https://github.com/yahoo/mojito/) , run 100% in the browser and are served via Github Pages.

## Getting Up and Running

First clone this repo.

> git clone git://github.com/capecodehq/mojito_app_hybrid_example.git

Then install Mojito.

> npm install mojito -g

Now run the example.

> cd ./mojito_app_hybrid_example/mojito/app
>
> mojito start

Now go to [http://localhost:8666/](http://localhost:8666/)

You can view the URL from a desktop web browser, an iPad and an iPhone or Android phone.
Each one will provide you with a slightly different experience that fits the device.

## Patches

_Note:_ The following depend on as yet un-applied Mojito patchs [https://github.com/yahoo/mojito/pull/284](https://github.com/yahoo/mojito/pull/284), [https://github.com/yahoo/mojito/pull/287](https://github.com/yahoo/mojito/pull/287), [https://github.com/yahoo/mojito/pull/363/files](https://github.com/yahoo/mojito/pull/363/files) and [https://github.com/yahoo/mojito/pull/358](https://github.com/yahoo/mojito/pull/358).

## Building Web Applications

To build webapps for both "phone" and "tablet" run the following script.

> ./scripts/webapp-build

This creates two directories "./builds/webapp/phone" and "./builds/webapp/tablet".
Each directory contains all the files required to run the application 100% in a browser, no server side processing is required.

You can test the applications by running either;

> ./scripts/webapp-run/phone.js

or;

> ./scripts/webapp-run/tablet.js

And then going to [http://localhost:3000/index.html](http://localhost:3000/index.html) in a browser.
_Note:_ Depending on the browser you are using you may have to force a reload of the URL to clear the cache.

## Building for Phonegap

To build a "phone" application for Phonegap run the following script.

> ./scripts/phonegap-android-build

or;

> ./scripts/phonegap-ios-build

The results can be found at "./builds/phonegap/[os]/phone".
