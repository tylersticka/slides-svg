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
   * Plugin
   */

  var RevealHandlers;
  var cache = {};
  var defaults = { attrName: 'data-handler' };
  var options = assign({}, defaults, Reveal.getConfig().handlers);

  function elementToHandlers (element) {
    if (isNil(element)) {
      return;
    }

    var name = element.getAttribute(options.attrName);
    var handler;

    if (!isNil(name) && has(cache, name)) {
      handler = cache[name];
    }

    return handler;
  }

  function triggerHandlers (element, events, event) {
    var handlers = elementToHandlers(element);
    var index, index2, handler;

    if (isNil(handlers) || !events.length) {
      return;
    }

    for (index = 0; index < handlers.length; index++) {
      handler = handlers[index];

      for (index2 = 0; index2 < handler.events.length; index2++) {
        if (events.indexOf(handler.events[index2]) !== -1) {
          handler.action(element, event);
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

RevealHandlers.add('mpaa', {
  'ready slideshown': function () {
    console.log('mpaa on');
  },
  'slidehidden': function () {
    console.log('mpaa off');
  }
});
