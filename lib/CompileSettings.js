/*! @license MIT ©2014–2016 Ruben Verborgh, Ghent University – imec */
/* Merges the queries from the 'queries' folder into 'settings.json'. */
var fs = require('fs'),
    path = require('path');

function compileSettings(queryDir, settingsFile, outputFile) {
    // Write the settings with queries to the output file
    var settings = JSON.parse(fs.readFileSync(settingsFile, { encoding: 'utf8' }));
    settings.queries = readQueryDirectory(queryDir, settings)
        // Sort by ascending priority and name
        .sort(function (a, b) {
            return (a.priority - b.priority) ||
                (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        })
        // Remove priority numbers in output
        .map(function (d) { return delete d.priority, d; });
    fs.writeFileSync(outputFile, JSON.stringify(settings));
}

// Recursively reads queries in the given directory
function readQueryDirectory(directory, settings) {
    return [].concat.apply([], fs.readdirSync(directory).map(function (filename) {
        filename = path.join(directory, filename);
        if (fs.statSync(filename).isDirectory())
            return readQueryDirectory(filename, settings);
        else if (/\.(sparql)|(graphql)$/.test(filename))
            return readQuery(filename, settings);
        else
            return [];
    }));
}

// Creates a query from the file
function readQuery(queryFile, settings) {
    // Construct the initial query
    var query = {
        name: queryFile.replace(/^.+\/|\.\w+$/g, ''),
        priority: 1000, datasources: []
    };

    // Parse query comments for metadata
    var inputLines = fs.readFileSync(queryFile, {encoding: 'utf8'}).split('\n'), outputLines = [];
    inputLines.forEach(function (line, index) {
        // The line might be a key/value pair
        var keyValue = line.match(/^#\s*(\w+)\s*:\s*(.*)\s*/);
        if (keyValue) {
            var key = keyValue[1].toLowerCase(), value = keyValue[2];
            switch (key) {
                case 'datasource':
                case 'datasources':
                    value.split(/\s+/)
                        .forEach(function (d) {
                            if (d.length) query.datasources.push(d);
                        });
                    return;
            }
        }
        // The first line might contain a name
        if (index === 0 && line[0] === '#') {
            query.name = line.replace(/#\s*/, '');
            // A number preceding the name indicates the priority
            if (/^\d/.test(query.name)) {
                query.priority = parseInt(query.name, 10);
                query.name = query.name.replace(/^\d+\W\s*/, '');
            }
        }
        // Any other line is part of the query
        else {
            outputLines.push(line);
        }
    });

    // Depending on the file name, assume a different query format
    if (queryFile.endsWith('graphql')) {
        var emptyLineIndex = outputLines.indexOf('');
        if (emptyLineIndex < 0)
            throw new Error(queryFile + ' does not have an empty line between GraphQL query and JSON-LD context');
        query.queryFormat = 'graphql';
        query.query = outputLines.slice(0, emptyLineIndex).join('\n').trim();
        query.context = outputLines.slice(emptyLineIndex + 1).join('\n').trim();
    }
    else {
        query.queryFormat = 'sparql';
        query.query = outputLines.join('\n').trim();
    }

    // Skip disabled query formats
    if (!settings.queryFormats[query.queryFormat]) {
        return [];
    }

    return query;
}

module.exports = {
    compileSettings: compileSettings,
    readQueryDirectory: readQueryDirectory,
    readQuery: readQuery
}
