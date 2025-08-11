/*! @license MIT ©2014–2016 Ruben Verborgh, Ghent University – imec */
/** Loads and stores state of the Triple Pattern Fragments widget using the URL. */

jQuery(function ($) {
  var $queryui = $('.ldf-client').one('settingsUpdated', function () {
    // Restore the UI state upon entering and when the URL changes
    loadStateFromUrl();
    $(window).on('popstate', loadStateFromUrl);
    // Store the UI state in the URL when the UI changes
    if (history.replaceState)
      $queryui.on('change', saveStateToUrl);
  });
  $('.ldf-client').on('loadStateFromUrl', loadStateFromUrl);

  // Loads the UI state from the URL
  function loadStateFromUrl() {
    // Special handling because OIDC does not allow hash fragments, so we decode it from query param
    var hash = location.hash;
    if (!location.hash && location.search && location.search.indexOf('&state') < 0) {
      hash = location.search.replace(/\+/g, '%20');
      history.replaceState(null, null, window.location.href
        .replace('?', '#')
        .replace(/\+/g, '%20'));
    }

    var uiState = hash.substr(1).split('&').reduce(function (uiState, item) {
      var keyvalue = item.match(/^([^=]+)=(.*)/);
      if (keyvalue) uiState[decodeURIComponent(keyvalue[1])] = decodeURIComponent(keyvalue[2]);
      return uiState;
    }, {});
    if ((uiState.datasources = uiState.datasources || uiState.startFragment) || uiState.transientDatasources) { // backwards compatibility
      var datasources = {};
      if (uiState.datasources) {
        uiState.datasources.split(/[ ,;]+/).forEach(function (url) {
          datasources[url] = 'persistent';
        });
      }
      if (uiState.transientDatasources) {
        uiState.transientDatasources.split(/[ ,;]+/).forEach(function (url) {
          datasources[url] = 'transient';
        });
      }
      $queryui.queryui('option', 'selectedDatasources', datasources);
    }
    if (uiState.queryFormat)
      $queryui.queryui('option', 'queryFormat', uiState.queryFormat);
    if (uiState.query)
      $queryui.queryui('option', 'query', uiState.query);
    if (uiState.queryContext)
      $queryui.queryui('option', 'queryContext', uiState.queryContext);
    if (uiState.resultsToTree)
      $queryui.queryui('option', 'resultsToTree', uiState.resultsToTree !== 'false');
    if (uiState.datetime)
      $queryui.queryui('option', 'datetime', uiState.datetime);
    if (uiState.httpProxy)
      $queryui.queryui('option', 'httpProxy', uiState.httpProxy);
    if (uiState.bypassCache)
      $queryui.queryui('option', 'bypassCache', uiState.bypassCache);
    if (uiState.executeOnLoad)
      $queryui.queryui('option', 'executeOnLoad', uiState.executeOnLoad);
    if (uiState.solidIdp)
      $queryui.queryui('option', 'solidIdp', uiState.solidIdp);
  }

  // Stores the current UI state in the URL
  function saveStateToUrl() {
    var queryString = [],
        options = $queryui.queryui('option'),
        datasources = { persistent: [], transient: [] },
        hasDefaultQuery = options.query === (options.queries[0] || {}).query;
    Object.keys(options.selectedDatasources || {}).forEach(function (url) {
      datasources[options.selectedDatasources[url]].push(url);
    });
    // Set query string options
    if (datasources.persistent.length !== 0)
      queryString.push('datasources=' + datasources.persistent.map(encodeURIComponent).join(';'));
    if (datasources.transient.length !== 0)
      queryString.push('transientDatasources=' + datasources.transient.map(encodeURIComponent).join(';'));
    if (!hasDefaultQuery)
      queryString.push('query=' + encodeURIComponent(options.query || ''));
    if (!hasDefaultQuery && options.queryContext)
      queryString.push('queryContext=' + encodeURIComponent(options.queryContext || ''));
    if (!hasDefaultQuery && options.queryFormat !== 'sparql')
      queryString.push('resultsToTree=' + encodeURIComponent(options.resultsToTree));
    if (options.queryFormat !== 'sparql')
      queryString.push('queryFormat=' + encodeURIComponent(options.queryFormat || ''));
    if (options.datetime)
      queryString.push('datetime=' + encodeURIComponent(options.datetime));
    if (options.httpProxy)
      queryString.push('httpProxy=' + encodeURIComponent(options.httpProxy));
    if (options.bypassCache)
      queryString.push('bypassCache=' + encodeURIComponent(options.bypassCache));
    if (options.executeOnLoad)
      queryString.push('executeOnLoad=' + encodeURIComponent(options.executeOnLoad));
    if (options.solidIdp && options.solidAuth.defaultIdp !== options.solidIdp)
      queryString.push('solidIdp=' + encodeURIComponent(options.solidIdp));

    // Compose new URL with query string
    queryString = queryString.length ? '#' + queryString.join('&') : '';
    history.replaceState(null, null, location.href.replace(/(?:#.*)?$/, queryString));
  }
});
