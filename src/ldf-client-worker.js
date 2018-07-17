var Comunica = require('@comunica/actor-init-sparql');
var engine = null;
var RdfString = require('rdf-string');

// The active fragments client and the current results
var resultsIterator;

// Set up logging
// TODO

// Handlers of incoming messages
var handlers = {
  // Execute the given query with the given options
  query: function (config) {
    // Create an engine lazily
    if (!engine)
      engine = Comunica.newEngine();

    // Create a client to fetch the fragments through HTTP
    engine.query(config.query, config.context)
      .then(function (result) {
        // Post query metadata
        postMessage({ type: 'queryInfo', queryType: result.type });

        var bindings = result.type === 'bindings';
        switch (result.type) {
        case 'quads':
          resultsIterator = result.quadStream;
          break;
        case 'bindings':
          resultsIterator = result.bindingsStream;
          break;
        case 'boolean':
          result.booleanResult.then(function (exists) {
            postMessage({ type: 'result', result: exists });
            postMessage({ type: 'end' });
          }).catch(postError);
          break;
        }

        if (resultsIterator) {
          resultsIterator.on('data', function (result) {
            if (bindings)
              result = result.map(RdfString.termToString).toObject();
            else
              result = RdfString.quadToStringQuad(result);
            postMessage({ type: 'result', result: result });
          });
          resultsIterator.on('end', function () {
            postMessage({ type: 'end' });
          });
          resultsIterator.on('error', postError);
        }
      }).catch(postError);
  },

  // Stop the execution of the current query
  stop: function () {
    if (resultsIterator) {
      resultsIterator.destroy();
      resultsIterator = null;
    }
  },
};

function postError(error) {
  error = { message: error.message || error.toString() };
  postMessage({ type: 'error', error: error });
}

// Send incoming message to the appropriate handler
self.onmessage = function (m) { handlers[m.data.type](m.data); };
