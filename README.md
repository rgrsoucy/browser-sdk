The relayr JavaScript SDK
=========================

Welcome to the relayr JavaScript SDK. This easy to use JavaScript implementation will allow you to quickly create relayr browser side web applications, start receiving data from your sensors and display the data received in your browser.


## Implementing the SDK

In order to start using the SDK all you would need to do is to include the `relayr-browser-sdk.min.js` file in your project:

	<script src="https://developer.relayr.io/relayr-browser-sdk.min.js"></script>

## Using the SDK

For a list of the basic available functionalities in the SDK please refer to our [Web Development Documentation](https://developer.relayr.io/documents/WebDev/WebDevelopers)


### Usage

```
npm install
npm start
open http://localhost:3000
```

Maybe you need to add .babelrc per hand if it is not copied correctly.

### Tests

```
npm test
npm run test:watch
```
[assertion library](https://github.com/mjackson/expect)

### Gulp Tasks

Use gulp for bundling

install the gulp cli globally (as root)

```
$ npm install gulp -g
```

Run gulp to build the bundle.js amd base.css on file save

```
$ gulp
```

Run gulp deploy to build and minify the bundle.js and base.css to /dist/min/bundle.js and base.css

```
$ gulp deploy
```

Run gulp webpack to build the uncompressed bundle to /dist/bundle.js

```
$ gulp webpack
```

Run gulp sass to build the uncompressed base.css to /dist/css/base.css

```
$ gulp sass
```
