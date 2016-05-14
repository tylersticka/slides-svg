/**
 * Execute actions on slide events
 */

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['reveal.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('reveal.js'));
  } else {
    root.RevealHooks = factory(root.Reveal);
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

  var RevealHooks;
  var cache = {};
  var defaults = {
    hookAttr: 'data-hook',
    optionsAttr: 'data-hook-options'
  };
  var options = assign({}, defaults, Reveal.getConfig().hooks);

  function getElementHooks (element) {
    if (isNil(element)) {
      return;
    }

    var name = element.getAttribute(options.hookAttr);
    var hooks;

    if (!isNil(name) && has(cache, name)) {
      hooks = cache[name];
    }

    return hooks;
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

  function triggerHooks (element, events, event) {
    var hooks = getElementHooks(element);
    var opts = getElementOptions(element);
    var index, index2, hook;

    if (isNil(hooks) || !events.length) {
      return;
    }

    for (index = 0; index < hooks.length; index++) {
      hook = hooks[index];

      for (index2 = 0; index2 < hook.events.length; index2++) {
        if (events.indexOf(hook.events[index2]) !== -1) {
          hook.action(element, event, opts);
        }
      }
    }
  }

  function addHook (name, events, action) {
    if (!has(cache, name)) {
      cache[name] = [];
    }

    cache[name].push({
      events: events,
      action: action
    });
  }

  function addHooks (name, hooks) {
    for (var key in hooks) {
      if (has(hooks, key)) {
        addHook(name, key.split(' '), hooks[key]);
      }
    }
  }

  function mapHooks (name, hooks, map) {
    var mapped = {};
    var func, key;

    for (key in map) {
      if (has(map, key) && has(hooks, map[key])) {
        mapped[key] = hooks[map[key]];
      }
    }

    addHooks(name, mapped);
  }

  function curryMapHooks (map) {
    return function (name, hooks) {
      return mapHooks(name, hooks, map);
    }
  }

  /**
   * Event listeners
   */

  Reveal.addEventListener('slidechanged', function (event) {
    triggerHooks(event.currentSlide, ['slidechanged', 'slideshown'], event);
    triggerHooks(event.previousSlide, ['slidechanged', 'slidehidden'], event);
  });

  Reveal.addEventListener('fragmentshown', function (event) {
    triggerHooks(event.fragment, ['fragmentshown'], event);
  });

  Reveal.addEventListener('fragmenthidden', function (event) {
    triggerHooks(event.fragment, ['fragmenthidden'], event);
  });

  Reveal.addEventListener('ready', function (event) {
    triggerHooks(event.currentSlide, ['ready'], event);
  });

  RevealHooks = {
    add: addHooks,
    map: curryMapHooks
  };

  return RevealHooks;

}));

RevealHooks.map({
  'ready slideshown': 'restart',
  'slidehidden': 'kill'
})('test', {
  restart: function (element, event, options) { console.log('restart', options); },
  kill: function (element, event, options) { console.log('kill', options); }
});

// RevealHooks.map('test', (function () {
//   return {
//     restart: function () { console.log('restart'); },
//     reverse: function () { console.log('reverse'); }
//   };
// }()), {
//   'ready slideshown': 'restart',
//   'slidehidden': 'reverse'
// });

// RevealHooks.add('test', {
//   'ready slideshown': function (element, event, options) {
//     console.log('test shown', options);
//   },
//   'slidehidden': function (element, event, options) {
//     console.log('test hidden', options);
//   }
// });
