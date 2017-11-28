# Config Editor
> POC: Polymer Base - Kwantu Configuration Editor

![Alt text](Home_Screenshot.png?raw=true "Optional Title")

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Installation Process

You would first need to clone the repo then run:

```
$ npm i && bower i
```

## Build Process

```
$ npm run build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `npm start` a folder to serve
from:

```
$ npm start:build
```

## Running / Serving Locally (For Development)

```
$ npm start
```
> PLEASE NOTE:: This projet uses the private bower to install private dependancies sored at - http://kwantu10.kwantu.net:5678/