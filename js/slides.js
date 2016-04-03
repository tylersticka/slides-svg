/**
 * Variables
 */

var timelines = {};
var elements = {};

/**
 * Test timeline
 */

elements.testCircle = document.getElementById('test-circle');

timelines.test = new TimelineMax({
  repeat: -1,
  paused: true,
  yoyo: true
});

timelines.test.to(elements.testCircle, 1, {
  x: '+400',
  ease: Linear.easeNone
});

/** 
 * Initialization 
 */

function toggleElementTimeline (element, start) {
  var key, timeline;
  
  if (!element) return;
  
  key = element.getAttribute('data-timeline');
  
  if (!key || key === '' || !timelines.hasOwnProperty(key)) return;
  
  timeline = timelines[key];
  
  if (start) {
    return timeline.restart();
  }
  
  return timeline.kill();
}

function timelineSlideEvent (event) {
  toggleElementTimeline(event.previousSlide, false);
  toggleElementTimeline(event.currentSlide, true);
}

Reveal.addEventListener('ready', timelineSlideEvent);
Reveal.addEventListener('slidechanged', timelineSlideEvent);