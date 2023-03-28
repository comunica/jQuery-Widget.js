# Comunica SPARQL jQuery Widget
[<img src="https://comunica.dev/img/comunica_red.svg" width="200" align="right" alt="" />](https://comunica.dev/)

[![npm version](https://badge.fury.io/js/%40comunica%2Fweb-client-generator.svg)](https://www.npmjs.com/package/@comunica/web-client-generator)
[![Build status](https://github.com/comunica/jQuery-Widget.js/workflows/CI/badge.svg)](https://github.com/comunica/jQuery-Widget.js/actions?query=workflow%3ACI)
[![Docker Automated Build](https://img.shields.io/docker/automated/comunica/jquery-widget.js.svg)](https://hub.docker.com/r/comunica/jquery-widget.js/)

**[Try the _Comunica SPARQL jQuery Widget_ online.](http://query.linkeddatafragments.org/)**

This jQuery widget is a browser-based user interface to the [Comunica SPARQL client](https://github.com/comunica/comunica/tree/master/engines/query-sparql).
It allows users to execute SPARQL queries over one or multiple heterogeneous interfaces, such as [Triple Pattern Fragments interfaces](http://www.hydra-cg.com/spec/latest/triple-pattern-fragments/).

The `@comunica/web-client-generator` allows this widget to be generated for any Comunica configuration.

## Installation

This tool requires [Node.JS](http://nodejs.org/) 10.0 or higher and is tested on OSX and Linux.

The easiest way to use this tool is by installing it from NPM as follows:

```bash
$ npm install -g @comunica/web-client-generator
```

Alternatively, you can install from the latest GitHub sources:

```bash
$ git clone git@github.com:comunica/jQuery-Widget.js.git
```

## Generate jQuery widget

After installation, the `comunica-web-client-generator` CLI tool allows you to generate a new widget.

_If installed from the GitHub sources, use `./bin/generate.js` instead of `comunica-web-client-generator`._

Generating the widget for the default [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/engines/query-sparql) config can be done as follows:

```bash
$ comunica-web-client-generator
```

The output will be available in the `build/` directory.

### Provide a custom config

In order to override the [default config](https://github.com/comunica/jQuery-Widget.js/blob/master/config/config-default.json), you can pass one as argument.

```bash
$ comunica-web-client-generator config/config-default.json
```

This assumes that your engine's dependencies are available in your working directory.
If this is not the case, provide a path to your engine's directory via the `-c` option:

```bash
$ comunica-web-client-generator path/to/engine/config/config-default.json -c path/to/engine/
```

### Change settings and queries

The default datasources and queries can be changed as follows:

```bash
$ comunica-web-client-generator -s settings.json -q queries
```

Examples for the [`settings.json`](https://github.com/comunica/jQuery-Widget.js/blob/master/settings.json) file
and the [`queries`](https://github.com/comunica/jQuery-Widget.js/tree/master/queries) directory.

### Show all available options

All available options for this command are:

```bash
$ comunica-web-client-generator -h
comunica-web-client-generator generates Comunica Web clients
  Usage:
    comunica-web-client-generator config/config-default.json
    comunica-web-client-generator config/config-default.json -d my-build/ -s my-settings.json
    comunica-web-client-generator config/config-default.json -q my-queries/
    comunica-web-client-generator config/config-default.json -w my-webpack.config.js

  Options:
    -b            The base URL at which the Web Client will be deployed [default: https://query.linkeddatafragments.org/]
    -d            Destination of the built output (defaults to build)
    -m            The compilation mode (defaults to production, can also be development)
    -c            Path to the main Comunica module (defaults to cwd)
    -q            Path to custom queries directory
    -s            Path to custom settings file
    -w            Path to custom Webpack config
    --help        Print this help message
```

## Running in a Docker container

### Run the pre-built container

```bash
docker run -p 3000:80 -it --rm comunica/jquery-widget.js
```

### Run from git sources

Configure your widget by editing the [settings.json](https://github.com/comunica/jQuery-Widget.js/blob/master/settings.json) file.

Next, edit the [queries directory](https://github.com/comunica/jQuery-Widget.js/tree/master/queries) in which you should insert the queries that will be present by default in the widget.

Build the [Docker](https://www.docker.com/) container as follows:

```bash
docker build -t comunica-sparql-widget .
```

After that, you can run your newly created container by mounting your current folder to the Docker container:
```bash
docker run -p 3000:80 -it --rm comunica-sparql-widget
```

Settings and queries can be passed at runtime by mounting your custom `queries.json` to the Docker container:

```bash
# Compile queries.json from settings.json and the files in the queries folder
./bin/queries-to-json.js

# Provide the compiled queries.json at runtime
docker run -v $(pwd)/queries.json:/usr/share/nginx/html/queries.json -p 3000:80 -it --rm comunica-sparql-widget
```

> Access on http://localhost:3000

## For developers of this package

The following is only relevant for developers that contribute to this package.

### Using the code

- Run `yarn install` to fetch dependencies and build the browser version of the client code.
- Run `yarn run dev` to run a local Web server (`yarn run dev-prod` for minified production output).
- Edit datasources in `settings.json` and queries in the `queries` folder, and run `queries-to-json` to compile both of them in a single JSON file.
- Run `yarn run build` to generate a production version in the `build` folder.

### How the browser client works

The original _Comunica SPARQL_ engine is written for the Node.js environment. The [Webpack](https://webpack.js.org/) library makes it compatible with browsers.

The query engine itself runs in a background thread using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The user interface (`ldf-client-ui.js`) instructs the worker (`ldf-client-worker.js`) to evaluate queries by sending messages, and the worker sends results back.

## License

The Linked Data Fragments jQuery Widget was originally written by [Ruben Verborgh](https://ruben.verborgh.org/)
and ported for Comunica SPARQL by [Ruben Taelman](http://rubensworks.net/).

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/)
and released under the [MIT license](http://opensource.org/licenses/MIT).
