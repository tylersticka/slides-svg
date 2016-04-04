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
