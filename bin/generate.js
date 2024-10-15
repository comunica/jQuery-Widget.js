#!/usr/bin/env node
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const { compileConfig } = require('componentsjs');
const { compileSettings } = require('../lib/CompileSettings');
const webpack = require('webpack');

const args = minimist(process.argv.slice(2));
if (args.h || args.help || args._.length > 1) {
    process.stderr.write(`comunica-web-client-generator generates Comunica Web clients
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
`);
    process.exit(1);
}

(async function () {
    // Compile JS version of engine to temporary file
    const comunicaConfig = args._[0] ? path.resolve(process.cwd(), args._[0]) : path.resolve(__dirname, '..', 'config/config-default.json');
    const mainModulePath = args.c || (args._[0] ? process.cwd() : path.resolve(__dirname, '..'));
    const configResourceUri = 'urn:comunica:default:Runner';
    const exportVariableName = 'urn:comunica:default:init/actors#query';
    await compileConfig(mainModulePath, comunicaConfig, configResourceUri, exportVariableName, undefined, true)
        .then(out => {
            // This instantiation is unneeded (MUST be done for excluding Components.js in browser environnments)
            out = out.replace('new (require(\'@comunica/runner\').Runner)', '');
            fs.writeFileSync('.tmp-comunica-engine.js', `${out}\n`);
        })
        .catch(error => {
            process.stderr.write(`${error.stack}\n`);
            process.exit(1);
        });

    // Compile queries and settings
    const queryDir = args.q || path.join(__dirname, '..', 'queries');
    const settingsFile = args.s || path.join(__dirname, '..', 'settings.json');
    const outputFile = 'queries.json';
    compileSettings(queryDir, settingsFile, outputFile);

    // Compile Web version
    const destinationPath = args.d || 'build';
    const mode = args.m || 'production';
    const baseURL = args.b || 'https://query.linkeddatafragments.org/';
    const webpackConfig = require(args.w ? path.resolve(process.cwd(), args.w) : '../webpack.config.js');

    // Override the baseURL in the webpack config
    webpackConfig.baseURL.replace = baseURL;

    for (const entry of webpackConfig) {
        entry.mode = mode;
        if (entry.output) {
            entry.output.path = path.resolve(process.cwd(), destinationPath);
        }
    }
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            process.exit(1);
        }

        console.error(stats.toString({ colors: true }));
        if (stats.hasErrors()) {
            process.exit(1);
        }

        fs.unlinkSync('.tmp-comunica-engine.js');
    });
})();
