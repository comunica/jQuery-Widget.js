#!/usr/bin/env node
const path = require('path');
const { compileSettings } = require('../lib/CompileSettings');

var queryDir = path.join(__dirname, '..', 'queries'),
    settingsFile = path.join(__dirname, '..', 'settings.json'),
    outputFile = path.join(__dirname, '..', 'queries.json');

compileSettings(queryDir, settingsFile, outputFile);
