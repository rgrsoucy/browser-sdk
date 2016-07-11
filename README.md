The relayr JavaScript SDK
=========================

Welcome to the relayr JavaScript SDK. This easy to use JavaScript implementation will allow you to quickly create relayr client-side web applications, start receiving data from your sensors, and display the data received in your application.


##Requirements

For this implementation of the SDK, we are assuming that you will be transpiling using Babel and packaging using Webpack. Future updates will include the option to just include the SDK in a script tag.

## Implementing the SDK

The easiest way to start using the SDK is to install it via npm:

```
npm install relayr-browser-sdk

```

This will include the minified file of the SDK in the node-modules folder of your project, which you can then import in your javascript code, using

```
import relayrSDK from 'relayr-browser-sdk';
```
If you wish to work with the entire repository, you can find the latest version at `https://github.com/relayr/browser-sdk` .



## Using the SDK

For a list of the basic available functionalities in the SDK please refer to our [Web Development Documentation](http://docs.relayr.io/Browser/)


### Usage

The basic functionalities of the SDK are behind authentication, so to get that far, initalize the project with the project ID and redirect URI provided to the relayr dashboard:

```
const RELAYR = relayrSDK;

RELAYR.init({
    id: "yourIdHere",
    redirectURI: "http://your.uri"
});
```
Then you can authorize your app to access the data provided by your devices, as well as other functionalities of the relayr cloud platform.

```
RELAYR.authorize().then((currentUser) => {...}).catch((err) => {...});
```
Because this version of the SDK is based on ES6 Promises, we recommend that you include a .catch statement in your code, so that errors will not fall through unheard.

### Available Methods




### Build

In the event that you would prefer to work with the entire repository rather than the minified version on npm, you will need to build the package before use:

```
npm run build:js
npm run build:min:js
```

### Tests
Tests are available for the SDK, using Mocha, Chai, and the expect assertion library

```
npm test
npm run test:watch
```
See here for further details on the [assertion library](https://github.com/mjackson/expect).
