/**
 * Variables
 */

var timelines = {};

/**
 * Timelines
 */

timelines.interests = (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  var interest1 = document.getElementById('interests-art');
  var interest2 = document.getElementById('interests-tech');
  var ease = Back.easeInOut.config(1.7);
  var duration = 0.5;

  timeline.to(interest1, duration, {
    attr: {
      cx: '33.333%',
      r: '33.333%'
    },
    ease: ease
  });

  timeline.to(interest2, duration, {
    attr: {
      cx: '66.666%',
      r: '33.333%'
    },
    ease: ease
  }, 0);

  return timeline;
})();

timelines.supportChart = (function () {
  var timeline = {};
  var pie = document.getElementById('pie-support');
  var total = 158;
  var perc = 0.9463;
  var target = 158 * perc;

  timeline.play = function () {
    pie.style.strokeDasharray = [target, total].join(', ');
  };

  timeline.reverse = function () {
    pie.style.strokeDasharray = '';
  };

  return timeline;
})();

timelines.blackBox = (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  var bases = document.querySelectorAll('.blackBox-base');
  var folds = document.querySelectorAll('.blackBox-fold');
  var basesAndFolds = document.querySelectorAll('.blackBox-base, .blackBox-fold');
  var labels = document.querySelectorAll('.blackBox-label');

  timeline.to(basesAndFolds, 0.5, {
    fill: '#000000',
    ease: Sine.easeIn
  });

  timeline.to(labels, 0.5, {
    fill: '#FFFFFF',
    ease: Sine.easeIn
  }, 0);

  timeline.to(folds, 0, {
    opacity: 0
  });

  timeline.to(labels, 1, {
    scale: 0,
    opacity: 0,
    ease: Sine.easeOut,
    transformOrigin: '50% 0'
  });

  timeline.to(bases, 1, {
    attr: {
      points: '0,125 150,25 300,125 300,275 150,375 0,275'
    },
    ease: Sine.easeInOut
  }, '-=1');

  return timeline;
})();

timelines.search3d = (function () {
  var timeline = {};
  var container = document.getElementById('search-3d');

  timeline.play = function () {
    container.classList.add('is-active');
  };

  timeline.reverse = function () {
    container.classList.remove('is-active');
  };

  return timeline;
})();

/**
 * Initialization
 */

function timelineElementAction (element, action) {
  var key;
  var timeline;

  if (!element || !action) {
    return;
  }

  key = element.getAttribute('data-timeline');

  if (!key || key === '' || !timelines.hasOwnProperty(key)) {
    return;
  }

  timeline = timelines[key];

  timeline[action]();

  return timeline;
}

function timelineEventHandler (elementKey, action) {
  return function (event) {
    return timelineElementAction(event[elementKey], action);
  }
};

Reveal.addEventListener('fragmentshown', timelineEventHandler('fragment', 'play'));
Reveal.addEventListener('fragmenthidden', timelineEventHandler('fragment', 'reverse'));
