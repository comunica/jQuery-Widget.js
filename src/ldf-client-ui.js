/*! @license MIT ©2014–2016 Ruben Verborgh, Ghent University – imec */
// jQuery widget for Triple Pattern Fragments query execution

// This exports the webpacked jQuery.
window.jQuery = require('../deps/jquery-2.1.0.js');
var N3 = require('n3');
var RdfString = require('rdf-string');
var resolve = require('relative-to-absolute-iri').resolve;
var solidAuth = require('@rubensworks/solid-client-authn-browser');

// This exports map-related dependencies
var L = require('leaflet');
var turf = require('@turf/centroid');
var Wkt = require('wicket/wicket-leaflet');
var join = require('url-join');

// Comment out the following two lines if you want to disable YASQE
var YASQE = require('yasgui-yasqe/src/main.js');
require('yasgui-yasqe/dist/yasqe.css'); // Make webpack import the css as well

// Import leaflet styles
require('leaflet/dist/leaflet.css');
require('leaflet/dist/images/layers.png');
require('leaflet/dist/images/layers-2x.png');
require('leaflet/dist/images/marker-icon.png');
require('leaflet/dist/images/marker-icon-2x.png');
require('leaflet/dist/images/marker-shadow.png');

// Polyfill process for readable-stream when it is not defined
if (typeof global.process === 'undefined')
  global.process = require('process');

(function ($) {
  // Query UI main entry point, which mimics the jQuery UI widget interface:
  // - $(element).queryui(options) initializes the widget
  // - $(element).queryui('option', [key], [value]) gets or sets one or all options
  $.fn.queryui = function (operation, option, value) {
    // Shift parameters if no operation given
    if (typeof operation !== 'string')
      value = option, option = operation, operation = 'init';

    // Apply the operation to all elements;
    // if one element yields a value, stop and return it
    var result = this;
    for (var i = 0; i < this.length && result === this; i++) {
      var $element = $(this[i]), queryui = $element.data('queryui');
      switch (operation) {
      // initialize the element as a Query UI
      case 'init':
        if (!queryui) {
          $element.data('queryui', queryui = new LdfQueryUI($element, option));
          queryui._create();
        }
        break;
      // set an option of a Query UI
      case 'option':
        if (!queryui) throw new Error('Query UI not activated on this element');
        // retrieve all options
        if (option === undefined)     result = queryui.options;
        // retrieve a specific option
        else if (value === undefined) result = queryui.options[value];
        // set a specific option
        else queryui._setOption(option, value);
        break;
      }
    }
    return result;
  };

  // Creates a new Query UI interface for the given element
  function LdfQueryUI($element, options) {
    this.element = $element;
    this.options = $.extend({}, this.options, options);

    // Create the query execution Web Worker
    this._createQueryWorker();

    // Initialize the query text tabs
    this._initQueryTabs();
  }

  LdfQueryUI.prototype = {
    // Default widget options
    options: {
      datasources: [],
      queries: [],
      prefixes: [],
    },

    // Initializes the widget
    _create: function () {
      var self = this,
          options = this.options,
          $element = this.element,
          $stop = this.$stop = $('.stop', $element),
          $start = this.$start = $('.start', $element),
          $queryTexts = $('.querytext'),
          $queryContexts = $('.querycontext'),
          $queryResultsToTrees = $('.results-to-tree'),
          $queryTextsIndexed = this.$queryTextsIndexed = {},
          $queryContextsIndexed = this.$queryContextsIndexed = {},
          $queryResultsToTreesIndexed = this.$queryResultsToTreesIndexed = {},
          $queries = this.$queries = $('.query', $element),
          $log = $('.log', $element),
          $results = $('.results', $element),
          $resultsText = $('<div>', { class: 'text' }),
          $datasources = this.$datasources = $('.datasources', $element),
          $datetime = this.$datetime = $('.datetime', $element),
          $httpProxy = this.$httpProxy = $('.httpProxy', $element),
          $bypassCache = this.$bypassCache = $('.bypassCache', $element),
          $solidIdp = this.$solidIdp = $('.solid-auth .idp', $element),
          $showDetails = this.$showDetails = $('.details-toggle', $element),
          $proxyDefault = $('.proxy-default', $element);
      this.$details = $('.details', $element);

      // Replace non-existing elements by an empty text box
      if (!$datasources.length) $datasources = this.$datasources = $('<select>');
      if (!$results.length) $results = $('<div>');
      if (!$log.length) $log = $('<div>');

      // When a datasource is selected, load the corresponding query set
      $datasources.chosen({
        create_option: function (url) {
          if (options.datasources.map(function (datasource) { return datasource.url; }).indexOf(url) >= 0) {
            // If the URL exists, select it
            options.selectedDatasources[url] = 'persistent';
            self._setOption('selectedDatasources', Object.assign({}, options.selectedDatasources));
            return false;
          }
          else {
            // If the URL does not exist, create it
            return this.select_append_option({
              value: url,
              text: url,
            });
          }
        },
        persistent_create_option: true,
        skip_no_results: true,
        search_contains: true,
        display_selected_options: false,
        placeholder_text: ' ',
        create_option_text: 'Add datasource',
      });
      $datasources.change(function () {
        // Inherit the transience of the previous selected datasources
        var newSelection = toHash($datasources.val(), 'persistent');
        Object.keys(options.selectedDatasources).forEach(function (lastValue) {
          if (lastValue in newSelection)
            newSelection[lastValue] = options.selectedDatasources[lastValue];
        });
        self._setOption('selectedDatasources', newSelection);
      });

      // When a query is selected, load it into the editor
      $queryTexts.each(function () {
        var $query = $(this);
        var type = $query.parent().attr('id').substr(4);
        $queryTextsIndexed[type] = $query;
        $query.edited = $query.val() !== '';
        $query.change(function () {
          options.query = $query.val();
          $query.edited = true;
        });

        $queryTextsIndexed[type].sync = function () {
          // Update YASQE editor if applicable
          if ($query.yasqe && $query.yasqe.getValue() !== options.query)
            $query.yasqe.setValue(options.query);

          // Load the transient datasources for the current query
          self._setSelectedDataSourcesForQuery();
        };

        // Prettify SPARQL editors with YASQE
        if (YASQE && $query.hasClass('yasqe')) {
          $query.yasqe = YASQE.fromTextArea($query[0], {
            createShareLink: null,
            persistent: null,
          });
          $query.yasqe.on('change', function () {
            $query.val($query.yasqe.getValue());
            $query.change();
          });
        }
      });
      $queryContexts.each(function () {
        var $queryContext = $(this);
        var type = $queryContext.parent().attr('id').substr(4);
        $queryContextsIndexed[type] = $queryContext;
        $queryContext.edited = $queryContext.val() !== '';
        $queryContext.change(function () {
          options.queryContext = $queryContext.val();
          $queryContext.edited = true;
        });
      });
      $queryResultsToTrees.each(function () {
        var $queryResultsToTree = $(this);
        var type = $queryResultsToTree.parent().attr('id').substr(4);
        $queryResultsToTreesIndexed[type] = $queryResultsToTree;
        $queryResultsToTree.edited = $queryResultsToTree.val() !== '';
        $queryResultsToTree.change(function () {
          options.resultsToTree = $queryResultsToTree.is(':checked');
          $queryResultsToTree.edited = true;
        });
      });
      $queries.chosen({ skip_no_results: true, placeholder_text: ' ' });
      $queries.change(function (query) {
        if ((options.query !== $queries.val()) && (query = $queries.val())) {
          // Set the query text
          self._setOption('queryFormat', $queries.find(':selected').attr('queryFormat'));
          var queryContext = $queries.find(':selected').attr('queryContext');
          if ($queryContextsIndexed[options.queryFormat])
            $queryContextsIndexed[options.queryFormat].val(options.queryContext = queryContext).edited = false;
          $queryTextsIndexed[options.queryFormat].val(options.query = query).edited = false;
          $queryTextsIndexed[options.queryFormat].sync();

          // Set the new selected datasources
          var newDatasources = self._getHashedQueryDatasources(self._getSelectedQueryId());
          self._setOption('selectedDatasources', newDatasources);
        }
      });

      // Update datetime on change
      $datetime.change(function () { self._setOption('datetime', $datetime.val()); });

      // Update http proxy on change
      $httpProxy.change(function () { self._setOption('httpProxy', $httpProxy.val()); });

      // Update bypass cache on change
      $bypassCache.change(function () { self._setOption('bypassCache', $bypassCache.is(':checked')); });

      // Update IDP on change
      $solidIdp.change(function () { self._setOption('solidIdp', $solidIdp.val()); });

      // Set up starting and stopping
      $start.click(this._startExecution.bind(this));
      $stop.click(this._stopExecutionForcefully.bind(this));

      // Set up details toggling
      $showDetails.click(function () {
        self.$details.is(':visible') ? self._hideDetails() : self._showDetails();
      });

      // Set up results
      $results.append($resultsText);
      this._resultsScroller = new FastScroller($results, renderResult);
      this._resultAppender = appenderFor($resultsText);
      this._logAppender = appenderFor($log);
      this.$timing = $('.timing', $element);

      // Set the default proxy
      $proxyDefault.on('click', function () {
        $httpProxy.val(document.location.protocol + '//proxy.linkeddatafragments.org/').change();
        return false;
      });

      // Apply all options
      for (var key in options)
        this._setOption(key, options[key], true);
    },

    // Sets a specific widget option
    _setOption: function (key, value, initialize) {
      var options = this.options;
      if (!initialize && options[key] === value) return;
      options[key] = value;

      // Apply the chosen option
      var self = this, $datasources = this.$datasources, $queries = this.$queries;
      switch (key) {
      // Initialize map
      case 'map':
        const $map = this.$map = $('.results-map', this.element);
        const $mapWrapper = this.$mapWrapper = $('.results-map-wrapper', this.element);

        this.map = L.map($map.get(0)).setView([52.517987721, 6.116665362], 8);
        this.mapLayer = L.layerGroup().addTo(this.map);
        L.tileLayer(value.url, {
          maxZoom: 18,
          attribution: value.attribution,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
        }).addTo(this.map);
        $mapWrapper.hide();
        break;
      // Initialize Solid auth
      case 'solidAuth':
        if (value) {
          if (!value.settingsOnly) {
            $('.solid-auth', this.element)
              .removeClass('details')
              .show();
            this.$details = $('.details', this.$element); // Refresh selector
          }
          if (value.defaultIdp)
            self._setOption('solidIdp', value.defaultIdp);
          const $idp = $('.idp', this.element);
          const $login = $('.login', this.element);
          const $webid = $('.webid', this.element);
          const $solidSession = this.$solidSession = new solidAuth.Session();

          $solidSession.onSessionRestore((url) => {
            history.pushState(null, null, url);
            self.element.trigger('loadStateFromUrl');
          });
          this._createQueryWorkerSessionHandler();
          $solidSession
            .handleIncomingRedirect({
              url: window.location.href,
              restorePreviousSession: true,
            })
            .then(() => {
              self.element.trigger('loadStateFromUrl');
              $login.removeAttr('disabled');
              if ($solidSession.info.isLoggedIn) {
                $login.text('Log out');
                $idp.hide();
                self._setWebIdName();
                $webid.show();

                // Add profile to datasources
                self._setOption('datasources', [
                  {
                    name: 'My Solid Profile',
                    url: $solidSession.info.webId,
                  },
                  ...self.options.datasources,
                ]);

                // Request the user's name from the worker
                this._queryWorker.postMessage({
                  type: 'getWebIdName',
                  webId: $solidSession.info.webId,
                  context: self._getQueryContext(),
                });
              }
              else {
                $login.text('Log in');
                $webid.hide();
                $idp.show();
              }

              // Handle login
              $login.on('click', function () {
                if ($solidSession.info.isLoggedIn) {
                  $solidSession.logout();
                  $login.text('Log in');
                  $webid.hide();
                  $idp.show();
                }
                else {
                  const href = window.location.href.replace('#', '?');
                  $solidSession.login({
                    oidcIssuer: $idp.val(),
                    redirectUrl: href, // OIDC does not allow hash fragments, so we encode it as query param
                    clientName: 'Comunica Web Client',
                    clientId: join(href, 'solid-client-id.json'),
                  });
                }
                return false;
              });
            });
        }
        break;
      // Initialize Solid IDP
      case 'solidIdp':
        this.$solidIdp.val(value).change();
        break;
      // Disable unused query formats
      case 'queryFormats':
        var firstActiveFormat = null;
        var hasMultipleActiveQueryFormats = false;
        for (var queryFormat in value) {
          if (!value[queryFormat])
            $('#' + queryFormat).hide();
          else if (!firstActiveFormat)
            firstActiveFormat = queryFormat;
          else
            hasMultipleActiveQueryFormats = true;
        }

        if (firstActiveFormat)
          this._setOption('queryFormat', firstActiveFormat);
        if (!hasMultipleActiveQueryFormats)
          this.element.find('.query-texts').hide();
        break;
      // Set the datasources available for querying
      case 'datasources':
        // Validate datasources object, each URL can only occur once
        var datasourceDict = {};
        value.forEach(function (datasource, index) {
          if (!datasource.name)
            throw new Error('Invalid datasource configuration: No "name" entry was found for datasource ' + index);
          if (!datasource.url) {
            throw new Error('Invalid datasource configuration: No "url" entry was found for datasource "' +
              datasource.name + '"');
          }
          if (datasourceDict[datasource.url]) {
            throw new Error('Invalid datasource configuration: Each URL can only occur once in the datasource list, ' +
              'but found "' + datasource.url + '" in datasources "' + datasourceDict[datasource.url] +
              '" and "' + datasource.name + '"');
          }
          datasourceDict[datasource.url] = datasource.name;
        });

        // Clear existing options
        $datasources.find('option:not(.extra-information)').remove();

        // Create options for each datasource
        $datasources.append((value || []).map(function (datasource, index) {
          return $('<option>', { text: datasource.name, value: datasource.url });
        }));
        // Restore selected datasources
        this._setOption('selectedDatasources', options.selectedDatasources, true);
        break;
      // Set the datasources to query
      case 'selectedDatasources':
        // If initializing, choose the first available datasource if none was chosen
        var $options = $datasources.children();
        if (initialize && !(value && Object.keys(value).length) && $options.length > 1) {
          options[key] = value = {};
          value[$options[1].value] = 'transient';
        }
        var valueKeys = value ? Object.keys(value) : [];
        // Select chosen datasources that were already in the list
        var selected = toHash(valueKeys, 'persistent');
        $options.each(function (index) {
          if (index > 0) {
            var $option = $(this), url = $(this).val();
            $option.prop('selected', url in selected);
            $option.toggleClass('search-choice-transient', !!(url in selected && value[url] === 'transient'));
            selected[url] = 'default';
          }
        });
        // Add and select chosen datasources that were not in the list yet
        $datasources.append($.map(selected, function (exists, url) {
          return exists === 'default' ? null :
            $('<option>', { text: url, value: url, selected: true });
        })).trigger('chosen:updated');
        // Update the query set
        this._loadQueries(value);
        break;
      // Set the query
      case 'query':
        // First clear all query text fields
        for (var f1 in this.$queryTextsIndexed)
          this.$queryTextsIndexed[f1].val('');

        this.$queryTextsIndexed[options.queryFormat].val(value).change();
        this.$queryTextsIndexed[options.queryFormat].sync();
        this._refreshQueries($queries);
        break;
      case 'context':
        this.$contextDefault = value;
        break;
      case 'queryContext':
        // First clear all query context text fields
        for (var f2 in this.$queryContextsIndexed)
          this.$queryContextsIndexed[f2].val('');

        if (this.$queryContextsIndexed[options.queryFormat])
          this.$queryContextsIndexed[options.queryFormat].val(value).change();
        break;
      case 'resultsToTree':
        // First reset all query results to tree checkboxes
        for (var f3 in this.$queryResultsToTreesIndexed)
          this.$queryResultsToTreesIndexed[f3][0].checked = false;

        if (this.$queryResultsToTreesIndexed[options.queryFormat]) {
          this.$queryResultsToTreesIndexed[options.queryFormat][0].checked = value;
          this.$queryResultsToTreesIndexed[options.queryFormat].change();
        }
        break;
      case 'queryFormat':
        // Update visual state
        var targetNode = $('#' + value);
        if (targetNode.hasClass('inactive')) {
          this.element.find('.query-texts').find('li a').addClass('inactive');
          targetNode.removeClass('inactive');

          self.element.find('.query-text-container').hide();
          $('#tab-' + value).show();
        }

        // Set the internal query value
        this.options.query = this.$queryTextsIndexed[options.queryFormat].val();
        this.options.queryContext = this.$queryContextsIndexed[options.queryFormat] ?
          this.$queryContextsIndexed[options.queryFormat].val() : '';
        this.options.resultsToTree = this.$queryResultsToTreesIndexed[options.queryFormat] ?
          this.$queryResultsToTreesIndexed[options.queryFormat][0].checked : false;

        // Trigger URL state saving
        this.element.change();

        break;
      // Set the list of all possible queries
      case 'queries':
        // Load the transient datasources for the current query
        this._setSelectedDataSourcesForQuery();

        // Set the queries applicable to the set datasources
        value.forEach(function (query) {
          // Create a regex that only matches relevant datasources for this query
          query.datasourceMatcher =
            new RegExp('^(?:' + (
              // Datasource specifications can use '*' to indicate a wildcard,
              // and specifying no datasources means all datasources match
              query.datasources.map(toRegExp).join('|').replace(/\\\*|^$/g, '.*')
            ) + ')$');
        });
        this._loadQueries(options.selectedDatasources);
        break;
      case 'datetime':
        if (value)
          this._showDetails();
        this.$datetime.val(value).change();
        break;
      case 'httpProxy':
        if (value)
          this._showDetails();
        this.$httpProxy.val(value).change();
        break;
      case 'bypassCache':
        this.$bypassCache.prop('checked', value).change();
        break;
      // Set the list of selectable queries
      case 'relevantQueries':
        value = value || [];
        // If the current query was not edited and not in the list,
        // load the first selectable query
        if (!this.$queryTextsIndexed[options.queryFormat].edited &&
            !value.some(function (v) { return v.query === options.query; }) && value[0]) {
          this._setOption('queryFormat', value[0].queryFormat);
          this._setOption('query', value[0].query);
          this._setOption('queryContext', value[0].context);

          // Special-case: if the first query has more than 2 sources, and we were initialized with 1 transient datasource, update the list of datasources
          if (value[0].datasources.length > 1 &&
            Object.keys(options.selectedDatasources).length === 1 &&
            options.selectedDatasources[Object.keys(options.selectedDatasources)[0]] === 'transient')
            self._setOption('selectedDatasources', this._getHashedQueryDatasources(this._getSelectedQueryId()));
        }
        this._refreshQueries($queries);
        break;
      // Set branding settings
      case 'branding':
        if (value.title)
          $('body header h1 a').text(value.title);
        if (value.title_href)
          $('body header h1 a').attr('href', value.title_href);
        if (value.title)
          $('body header p a').text(value.subtitle);
        if (value.subtitle_href)
          $('body header p a').attr('href', value.subtitle_href);
        if (value.page_title)
          $('head title').text(value.page_title);
        break;
      case 'allowNoSources':
        this.$allowNoSources = value;
        break;
      // Load settings from a JSON resource
      case 'settings':
        $.getJSON(value, function (settings) {
          for (var key in settings)
            self._setOption(key, settings[key]);
          self.element.trigger('settingsUpdated');
        });
        break;
      }
    },

    // Get the hashed query datasources.
    // This will map transient datasources to 'transient',
    // and persistent datasources to 'persistent'.
    _getHashedQueryDatasources: function (queryId) {
      var persistedDatasources = this._getPersistedDatasources();
      var requiredDatasources = this._getQueryDatasources(queryId, persistedDatasources);

      var newDatasources;
      // Only add transient datasources if the persistent datasources
      // are a subset of the query's required datasources
      // Otherwise, keep only the persistent datasources
      var addTransientDatasources = !Object.keys(persistedDatasources)
        .some(function (i) { return requiredDatasources.indexOf(persistedDatasources[i]) < 0; });
      if (addTransientDatasources) {
        newDatasources = toHash(requiredDatasources, 'transient');
        for (var i in persistedDatasources)
          newDatasources[persistedDatasources[i]] = 'persistent';
      }
      else
        newDatasources = toHash(persistedDatasources, 'persistent');
      return newDatasources;
    },

    // Get the selected datasources that are persistent (i.e., are not transient)
    _getPersistedDatasources: function () {
      var persistedDatasources = [];
      Object.keys(this.options.selectedDatasources).forEach(function (url) {
        if (this.options.selectedDatasources[url] === 'persistent')
          persistedDatasources.push(url);
      }, this);
      return persistedDatasources;
    },

    // Set the default datasources based on the currently selected query
    _setSelectedDataSourcesForQuery: function () {
      var queryId = this._getSelectedQueryId();
      if (queryId >= 0) {
        var newDatasources = this._getHashedQueryDatasources(this._getSelectedQueryId());
        this._setOption('selectedDatasources', newDatasources);
      }
    },

    // Get the query id of the given query
    _getSelectedQueryId: function () {
      var queryId = -1;
      this.options.queries.forEach(function (predefinedQuery, id) {
        if (predefinedQuery.query === this.options.query)
          queryId = id;
      }, this);
      return queryId;
    },

    // Find the (first matching) datasources that match with the query's datasource pattern
    // Always first give a preference for persistent datasources if applicable.
    _getQueryDatasources: function (queryId, persistentDatasources) {
      persistentDatasources = persistentDatasources || [];
      var queryDatasourcePatterns = this.options.queries[queryId].datasources;
      if (!queryDatasourcePatterns.length)
        queryDatasourcePatterns = ['*'];
      var datasources = [];
      queryDatasourcePatterns.forEach(function (pattern) {
        var regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        if (!addFirstMatchingDatasourceOf(persistentDatasources, regex)) {
          addFirstMatchingDatasourceOf(this.options.datasources
            .map(function (datasource) { return datasource.url; }), regex);
        }
      }, this);
      return datasources;

      function addFirstMatchingDatasourceOf(matchingDatasources, regex) {
        return Object.keys(matchingDatasources).some(function (i) {
          return regex.test(matchingDatasources[i]) && datasources.push(matchingDatasources[i]);
        });
      }
    },

    // Update the selectable query list
    _refreshQueries: function (queries) {
      var options = this.options;
      queries.empty().append($('<option>'), options.queries.map(function (query) {
        return $('<option>', { text: query.name, value: query.query,
          selected: options.query === query.query })
          .attr('queryFormat', query.queryFormat)
          .attr('queryContext', query.context)
          .addClass('query-type-' + query.queryFormat)
          .addClass('query')
          .toggleClass('query-relevant', options.relevantQueries.indexOf(query) >= 0);
      })).trigger('chosen:updated').change();
    },

    // Load queries relevant for the given datasources
    _loadQueries: function (datasources) {
      var queries = (this.options.queries || []).filter(function (query, index) {
        query.id = index;
        var manuallyAddedDatasources = Object.keys(datasources)
          .filter(function (url) { return datasources[url] === 'persistent'; });
        // Include the query if it is relevant for at least one datasource
        return !datasources || !manuallyAddedDatasources.length || manuallyAddedDatasources
          .some(function (d) { return !query.datasourceMatcher || query.datasourceMatcher.test(d); });
      });

      // Load the set of queries if it is different from the current set
      var querySetId = queries.map(function (q) { return q.id; }).join();
      if (this._querySetId !== querySetId) {
        this._querySetId = querySetId;
        this._setOption('relevantQueries', queries);
      }
    },

    // Starts query execution
    _startExecution: function () {
      var datasources = this.$datasources.val() || [];
      if (!datasources.length && !this.$allowNoSources)
        return alert('Please choose a datasource to execute the query.');

      // Hide and clear map
      if (this.$mapWrapper) {
        this.$mapWrapper.hide();
        this.mapLayer.clearLayers();
        this.markerArray = [];
      }

      // Clear results and log
      this.$stop.show();
      this.$start.hide();
      this._resultsScroller.removeAll();
      this._resultAppender.clear();
      this._logAppender.clear();

      // Reset worker if we want to bypass the cache
      if (this.options.bypassCache)
        this._stopExecutionForcefully();

      // Scroll page to the results
      $('html,body').animate({ scrollTop: this.$stop.offset().top });

      // Start the timer
      this._resultCount = 0;
      this._startTimer();

      // Let the worker execute the query
      var context = {
        ...this._getQueryContext(),
        sources: datasources.map(function (datasource) {
          var type;
          var posAt = datasource.indexOf('@');
          if (posAt > 0) {
            type = datasource.substr(0, posAt);
            datasource = datasource.substr(posAt + 1, datasource.length);
          }
          datasource = resolve(datasource, window.location.href);
          return { type: type, value: datasource };
        }),
      };
      var prefixesString = '';
      if (this.options.queryFormat === 'sparql') {
        for (var prefix in this.options.prefixes)
          prefixesString += 'PREFIX ' + prefix + ': <' + this.options.prefixes[prefix] + '>\n';
      }
      var query = prefixesString + this.$queryTextsIndexed[this.options.queryFormat].val();
      this._queryWorker.postMessage({
        type: 'query',
        query: query,
        context: context,
        resultsToTree: this.options.resultsToTree,
      });
    },

    _getQueryContext: function () {
      var context = {
        ...(this.$contextDefault || {}),
        datetime: parseDate(this.options.datetime),
        queryFormat: this.options.queryFormat,
        httpProxy: this.options.httpProxy,
        workerSolidAuth: !!this.$solidSession,
      };
      if (this.options.queryContext) {
        try {
          var queryContextObject = JSON.parse(this.options.queryContext);
          Object.assign(context, queryContextObject);
        }
        catch (e) {
          this._resultAppender(e.message + '\n');
        }
      }
      return context;
    },

    _stopExecutionBase: function (error) {
      // Stop the timer
      this._stopTimer();

      // Reset the UI
      this.$stop.hide();
      this.$start.show();

      if (error && error.message)
        this._resultAppender('# ' + error.message);
      this._resultAppender.flush();
      this._logAppender.flush();
      this._writeResult = this._writeEnd = null;
    },

    // Stops query execution
    _stopExecution: function (error) {
      // Stop the worker
      this._queryWorker.postMessage({ type: 'stop' });

      this._stopExecutionBase(error);
    },

    // Stops query execution forcefully
    _stopExecutionForcefully: function (error) {
      // Kill the worker and restart
      this._queryWorker.terminate();
      this._createQueryWorker();
      this._createQueryWorkerSessionHandler();

      this._stopExecutionBase(error);
    },

    // Initializes the result display, depending on the query type
    _initResults: function (queryType) {
      var resultAppender = this._resultAppender;
      switch (queryType) {
      // For SELECT queries, add the rows to the result
      case 'bindings':
        this._writeResult = function (row) {
          this._resultsScroller.addContent([row]);
        };
        this._writeEnd = function () {
          if (!this._resultCount)
            resultAppender('This query has no results.');
        };
        break;
      // For CONSTRUCT and DESCRIBE queries,
      // write a Turtle representation of the triples
      case 'quads':
        var streamWriter = new N3.StreamWriter(this.options)
          .on('data', resultAppender)
          .on('error', (err) => { throw err; });
        this._writeResult = function (triple) { streamWriter.write(RdfString.stringQuadToQuad(triple)); };
        this._writeEnd = function () { streamWriter.end(); };
        break;
      // For ASK queries, write whether an answer exists
      case 'boolean':
        this._writeResult = function (exists) { resultAppender(exists); };
        this._writeEnd = $.noop;
        break;
      // Other queries cannot be displayed
      default:
        resultAppender(queryType + ' queries are unsupported.');
      }
    },

    // Adds a result to the display
    _addResult: function (result) {
      if (this._writeResult) {
        this._resultCount++;
        this._writeResult(result);

        if (this.map)
          this._handleGeospatialResult(result);
      }
    },

    // If the given result contains geospatial data, show it on the map
    _handleGeospatialResult: function (bindings) {
      var self = this;
      for (const variableName in bindings) {
        // Check if the value has a geospatial datatype
        const value = bindings[variableName];
        if (value.endsWith('^^http://www.openlinksw.com/schemas/virtrdf#Geometry') ||
            value.endsWith('^^http://www.opengis.net/ont/geosparql#wktLiteral')) {
          // Look for a corresponding variable with the 'Label' suffix.
          const variableNameLabel = `${variableName}Label`;
          const valueLabel = bindings[variableNameLabel];

          // Interpret geometry value as WKT string
          const geometry = /^"(.*)"\^\^[^\^]*$/.exec(value)[1];
          const wkt = new Wkt.Wkt();
          wkt.read(geometry);

          // Construct geo feature for WKT string
          const geoFeature = { type: 'Feature', properties: {}, geometry: wkt.toJson() };
          if (valueLabel)
            geoFeature.properties.name = valueLabel.split('@', 1)[0].replace(/['"]+/g, '');

          // Add feature to map
          let newMapLayer = L.geoJSON(geoFeature, {
            onEachFeature: function (feature) {
              // Determine marker position for different geometry types
              let lon;
              let lat;
              if (feature.geometry.type === 'Polygon') {
                const centroid = turf.centroid(feature);
                lon = centroid.geometry.coordinates[0];
                lat = centroid.geometry.coordinates[1];
              }
              // Handle points
              if (feature.geometry.type === 'Point') {
                lon = feature.geometry.coordinates[0];
                lat = feature.geometry.coordinates[1];
              }
              if (lon && lat) {
                let marker = L.circleMarker([lat, lon]);
                self.mapLayer.addLayer(marker).addTo(self.map);
                self.markerArray.push(marker);
                if (valueLabel)
                  marker.bindPopup(feature.properties.name);
              }
            },
          });
          self.mapLayer.addLayer(newMapLayer).addTo(self.map);

          // Possibly rescale map view
          self.map.fitBounds(L.featureGroup(self.markerArray).getBounds());

          // Show map if it's not visible yet
          if (!self.$mapWrapper.is(':visible'))
            self.$mapWrapper.show();
        }
      }
    },

    // Finalizes the display after all results have been added
    _endResults: function () {
      if (this._writeEnd) {
        this._writeEnd();
        this._stopExecution();
      }
    },

    // Starts the results timer
    _startTimer: function () {
      this._startTime = new Date();
      this._stopTimer();
      this._updateTimer();
      this._updateTimerHandle = setInterval(this._updateTimer.bind(this), 100);
    },

    // Updates the result timer
    _updateTimer: function () {
      this.$timing.text(this._resultCount.toLocaleString() + ' result' +
                        (this._resultCount === 1 ? '' : 's') + ' in ' +
                        ((new Date() - this._startTime) / 1000).toFixed(1) + 's');
    },

    // Stops the result timer
    _stopTimer: function () {
      if (this._updateTimerHandle) {
        this._updateTimer();
        clearInterval(this._updateTimerHandle);
        this._updateTimerHandle = 0;
      }
    },

    // Shows the details panel
    _showDetails: function () {
      this.$details.slideDown(150);
      this.$showDetails.addClass('enabled');
    },

    // Hides the details panel
    _hideDetails: function () {
      this._setOption('datetime', '');
      this.$details.slideUp(150);
      this.$showDetails.removeClass('enabled');
    },

    // Initialize the query text tabs
    _initQueryTabs: function () {
      var $queryTexts = this.element.find('.query-texts');
      $queryTexts.find('li a:not(:first)').addClass('inactive');

      this.element.find('.query-text-container').hide();
      this.element.find('.query-text-container:first').show();
      this.options.queryFormat = $queryTexts.find('li a:first').attr('id');

      var self = this;
      $queryTexts.find('li a').click(function () {
        var id = $(this).attr('id');
        self._setOption('queryFormat', id);
      });
    },

    // Create the query execution Web Worker
    _createQueryWorker: function () {
      var self = this;
      this._queryWorker = new Worker('scripts/ldf-client-worker.min.js');
      this._queryWorkerSessionHandler = undefined;
      this._queryWorker.onmessage = function (message) {
        if (self._queryWorkerSessionHandler && self._queryWorkerSessionHandler.onmessage(message))
          return;

        var data = message.data;
        switch (data.type) {
        case 'queryInfo': return self._initResults(data.queryType);
        case 'result':    return self._addResult(data.result);
        case 'end':       return self._endResults();
        case 'log':       return self._logAppender(data.log);
        case 'error':     return this.onerror(data.error);
        case 'webIdName': return self._setWebIdName(data.name);
        }
      };
      this._queryWorker.onerror = function (error) {
        self._stopExecution(error);
      };
    },

    // Bind the handler that takes care of fetch header authentication for the worker
    _createQueryWorkerSessionHandler: function () {
      if (this.$solidSession)
        this._queryWorkerSessionHandler = new solidAuth.WindowToWorkerHandler(this, this._queryWorker, this.$solidSession);
    },

    // Set the name inside the WebID field, or a shortened version of the WebID URL if name is undefined
    _setWebIdName: function (name) {
      const $webid = $('.webid', this.element);
      $webid.html(`Logged in as <a href="${this.$solidSession.info.webId}" target="_blank">${name || shortenUrl(this.$solidSession.info.webId, 35)}</\a>`);
    },
  };

  // Creates a function that appends text to the given element in a throttled way
  function appenderFor($element) {
    var buffer, allowedAppends, timeout, delay = 1000;
    // Resets the element
    function clear() {
      buffer = '';
      $element.empty();
      allowedAppends = 50;
      clearTimeout(timeout);
    }
    clear();
    // Appends the text to the element, or queues it for appending
    function append(text) {
      // Append directly if still allowed
      if (allowedAppends > 0) {
        $element.append(escape(text));
        // When no longer allowed, re-enable appending after a delay
        if (--allowedAppends === 0)
          timeout = setTimeout(flush, delay);
      }
      // Otherwise, queue for appending
      else
        buffer += text;
    }
    // Writes buffered text and re-enables appending
    function flush() {
      // Clear timeout in case flush was explicitly triggered
      clearTimeout(timeout);
      timeout = null;
      // Re-enable appending right away if no text was queued
      if (!buffer)
        allowedAppends = 1;
      // Otherwise, append queued text and wait to re-enable
      else {
        $element.append(escape(buffer));
        buffer = '';
        timeout = setTimeout(flush, delay);
      }
    }
    // Export the append function
    append.clear = clear;
    append.flush = flush;
    return append;
  }

  // Escapes special HTML characters and convert URLs into links
  function escape(text) {
    return (text + '').split('\n').map(function (line) {
      return line
        .replace(/(<)|(>)|(&)/g, escapeMatch)
        .replace(/([\s"])(https?:\/\/[^\s<>"]+)/g, escapeMatchUrl);
    }).join('<br/>');
  }
  function escapeMatch(match, lt, gt, amp) {
    return lt && '&lt;' || gt && '&gt;' || amp && '&amp;';
  }
  function escapeMatchUrl(match, preUrl, url) {
    url = escape(url);
    return preUrl + '<a href="' + url + '" target=_blank>' + url + '</a>';
  }

  // Escapes the string for usage as a regular expression
  function toRegExp(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  // Converts the array to a hash with the elements as keys
  function toHash(array, val) {
    var hash = {}, length = array ? array.length : 0;
    for (var i = 0; i < length; i++)
      hash[array[i]] = val;
    return hash;
  }

  // Parses a yyyy-mm-dd date string into a Date
  function parseDate(date) {
    if (date) {
      try { return new Date(Date.parse(date)); }
      catch (e) { /* ignore invalid dates */ }
    }
  }

  // Transforms a result row into an HTML element
  function renderResult(row, container) {
    container = container || $('<div>', { class: 'result' }).append($('<dl>'))[0];
    $(container.firstChild).empty().append($.map(row, function (value, variable) {
      return [$('<dt>', { text: variable }), $('<dd>', { html: escape(value) })];
    }));
    return container;
  }

  // Shortens an URL to the given length
  function shortenUrl(url, length) {
    if (url.length > length)
      return '&hellip;' + url.slice(url.length - length, url.length);
    return url;
  }

  // TODO: Dynamically expose the version in ActorInitSparql so that we can retrieve it from there instead of relying on package.json reading.
  document.getElementById('comunica-version').innerHTML = 'Comunica version: ' +
  require('comunica-packagejson').version;
})(jQuery);
