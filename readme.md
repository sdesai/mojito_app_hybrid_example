# Mojito Application - Hybrid Example

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

## Building Web Applications

To build webapps for both "phone" and "tablet" run the following script.
_Note:_ This command depends on an as yet un-applied Mojito patch [https://github.com/yahoo/mojito/pull/216](https://github.com/yahoo/mojito/pull/216).

> ./scripts/webapp-build

This creates two directories "./builds/webapp/phone" and "./builds/webapp/tablet".
Each directory contains all the files required to run the application 100% in a browser, no server side processing is required.

You can test the applications by running either;

> ./scripts/webapp-run/phone.js

or;

> ./scripts/webapp-run/tablet.js

And then going to [http://localhost:3000/index.html](http://localhost:3000/index.html) in a browser.
_Note:_ Depending on the browser you are using you may have to force a reload of the URL to clear the cache.
