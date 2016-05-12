/**
 * Execute actions on slide events
 */

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['reveal.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('reveal.js'));
  } else {
    root.RevealHandlers = factory(root.Reveal);
  }

}(this, function (Reveal) {

  /**
   * Returns whether an object has its own property.
   */
  function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  /**
   * Is value undefined or null?
   */

  function isNil (value) {
    return (value === undefined || value === null);
  }

  /**
   * Merge one or more objects into the first object (and return it).
   *
   * See: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   */

  function assign (target) {
    if (typeof Object.assign != 'function') {
      return Object.assign.apply(null, arguments);
    }

    if (isNil(target)) {
      throw new Error('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    var index, source, nextKey;

    for (index = 1; index < arguments.length; index++) {
      source = arguments[index];
      if (!isNil(source)) {
        for (nextKey in source) {
          if (has(source, nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }

    return output;
  }

  /**
   * Attempt to parse JSON w/o going crazy.
   *
   * See: https://github.com/rajgoel/reveal.js-plugins/blob/master/anything/anything.js
   */

  function parseJSON (str) {
    var json;

    try {
      str = str.replace(/(\r\n|\n|\r|\t)/gm, '');
      json = JSON.parse(str);
    } catch (e) {
      return null;
    }

    return json;
  }

  /**
   * Plugin
   */

  var RevealHandlers;
  var cache = {};
  var defaults = {
    handlerAttr: 'data-handler',
    optionsAttr: 'data-handler-options'
  };
  var options = assign({}, defaults, Reveal.getConfig().handlers);

  function getElementHandlers (element) {
    if (isNil(element)) {
      return;
    }

    var name = element.getAttribute(options.handlerAttr);
    var handlers;

    if (!isNil(name) && has(cache, name)) {
      handlers = cache[name];
    }

    return handlers;
  }

  function getElementOptions (element) {
    if (isNil(element)) {
      return;
    }

    var opts = element.getAttribute(options.optionsAttr);

    if (typeof opts === 'string') {
      opts = parseJSON(opts);
    }

    return opts;
  }

  function triggerHandlers (element, events, event) {
    var handlers = getElementHandlers(element);
    var opts = getElementOptions(element);
    var index, index2, handler;

    if (isNil(handlers) || !events.length) {
      return;
    }

    for (index = 0; index < handlers.length; index++) {
      handler = handlers[index];

      for (index2 = 0; index2 < handler.events.length; index2++) {
        if (events.indexOf(handler.events[index2]) !== -1) {
          handler.action(element, event, opts);
        }
      }
    }
  }

  function addHandler (name, events, action) {
    if (!has(cache, name)) {
      cache[name] = [];
    }

    cache[name].push({
      events: events,
      action: action
    });
  }

  function addHandlers (name, handlers) {
    for (var key in handlers) {
      if (has(handlers, key)) {
        addHandler(name, key.split(' '), handlers[key]);
      }
    }
  }

  /**
   * Event listeners
   */

  Reveal.addEventListener('slidechanged', function (event) {
    triggerHandlers(event.currentSlide, ['slidechanged', 'slideshown'], event);
    triggerHandlers(event.previousSlide, ['slidechanged', 'slidehidden'], event);
  });

  Reveal.addEventListener('fragmentshown', function (event) {
    triggerHandlers(event.fragment, ['fragmentshown'], event);
  });

  Reveal.addEventListener('fragmenthidden', function (event) {
    triggerHandlers(event.fragment, ['fragmenthidden'], event);
  });

  Reveal.addEventListener('ready', function (event) {
    triggerHandlers(event.currentSlide, ['ready'], event);
  });

  RevealHandlers = {
    add: addHandlers
  };

  return RevealHandlers;

}));

RevealHandlers.add('test', {
  'ready slideshown': function (element, event, options) {
    console.log('test shown', options);
  },
  'slidehidden': function (element, event, options) {
    console.log('test hidden', options);
  }
});
