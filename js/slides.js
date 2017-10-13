/**
 * Hook maps
 */

var slideTimeline = RevealHooks.map({
  'ready slideshown': 'restart',
  'slidehidden': 'kill'
}, { args: [] });

var fragmentTimeline = RevealHooks.map({
  'fragmentshown': 'play',
  'fragmenthidden': 'reverse'
}, { args: [] });

/**
 * Timelines
 */

slideTimeline('titleText', (function () {
  var timeline = new TimelineMax({
    paused: true,
    repeat: -1,
    repeatDelay: 1
  });
  var so = document.getElementById('title-so');
  var very = document.getElementById('title-very');
  var good = document.getElementById('title-good');
  var zero = 0.001; // Because Edge explodes if this is zero

  timeline.set([so, very, good], {
    scale: zero,
    transformOrigin: '50% 50%'
  });

  timeline.set(so, {
    visibility: 'visible'
  }, 1);

  timeline.to(so, 1, {
    scale: 1,
    ease: Elastic.easeOut.config(1.2, 0.5)
  });

  timeline.to(so, 0.5, {
    scale: zero,
    ease: Back.easeIn.config(1.7)
  });

  timeline.set(so, {
    visibility: 'hidden'
  });

  timeline.set(very, {
    visibility: 'visible'
  }, '-=0.2');

  timeline.to(very, 1, {
    scale: 1,
    ease: Elastic.easeOut.config(1.2, 0.5)
  }, '-=0.2');

  timeline.to(very, 0.5, {
    scale: zero,
    ease: Back.easeIn.config(1.7)
  });

  timeline.set(very, {
    visibility: 'hidden'
  });

  timeline.set(good, {
    visibility: 'visible'
  }, '-=0.2');

  timeline.to(good, 1, {
    scale: 1,
    ease: Elastic.easeOut.config(1.2, 0.5)
  }, '-=0.2');

  timeline.to(good, 0.5, {
    scale: zero,
    ease: Back.easeIn.config(1.7)
  });

  timeline.set(good, {
    visibility: 'hidden'
  });

  return timeline;
}()));

fragmentTimeline('interests', (function () {
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
}()));

fragmentTimeline('photoFrameShrink', (function () {
  var photoFrame = document.getElementById('photo-frame');
  var tween = TweenMax.to(photoFrame, 0.6, {
    scale: 0.45,
    transformOrigin: '50% 50%',
    paused: true,
    ease: Elastic.easeOut.config(1, 0.8)
  });

  return tween;
})());

fragmentTimeline('photoFrameGrowInner', (function () {
  var photo = document.getElementById('photo-frame-inner');
  var tween = TweenMax.to(photo, 0.6, {
    scale: 1.8,
    transformOrigin: '50% 50%',
    paused: true,
    ease: Elastic.easeOut.config(1, 0.8)
  });

  return tween;
})());

RevealHooks.addEach('pie', {
  'fragmentshown': function (element, event, options) {
    var pie = document.querySelector(options.circle);
    var total = 158;
    var target = total * options.ratio;

    pie.style.strokeDasharray = [target, total].join(', ');
  },
  'fragmenthidden': function (element, event, options) {
    var pie = document.querySelector(options.circle);
    pie.style.strokeDasharray = '';
  }
});

fragmentTimeline('blackBox', (function () {
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
})());

RevealHooks.addEach('toggleClass', {
  'fragmentshown': function (element, event, options) {
    var target = document.querySelector(options.target);
    target.classList.add(options.className || 'is-active');
  },
  'fragmenthidden': function (element, event, options) {
    var target = document.querySelector(options.target);
    target.classList.remove(options.className || 'is-active');
  }
});

RevealHooks.addEach('removeClass', {
  'fragmentshown': function (element, event, options) {
    var target = document.querySelector(options.target);
    target.classList.remove(options.className || 'is-active');
  },
  'fragmenthidden': function (element, event, options) {
    var target = document.querySelector(options.target);
    target.classList.add(options.className || 'is-active');
  }
});

fragmentTimeline('sfxType', (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  var element = document.getElementById('sfx-text');
  var initial = element.textContent;
  var words = [initial, 'Boom!', 'Wham!'];

  words.forEach(function (word, index) {
    var length = word.length;
    var counters = {
      add: 0,
      remove: length
    };

    if (index > 0) {
      timeline.to(counters, 1, {
        add: length,
        ease: Linear.easeNone,
        onUpdate: function () {
          var length = Math.ceil(counters.add);
          var str = word.substr(0, length);
          element.textContent = str;
        }
      });
    }

    if (index !== words.length - 1) {
      timeline.to(counters, 1, {
        remove: 0,
        ease: Linear.easeNone,
        onUpdate: function () {
          var length = Math.floor(counters.remove);
          var str = word.substr(0, length);
          element.textContent = str;
        }
      }, (index > 0) ? '+=0.5' : null);
    }
  });

  return timeline;
})());

slideTimeline('chart', (function () {
  var timeline = new TimelineMax({
    repeat: -1,
    yoyo: true,
    paused: true
  });
  var line = document.getElementById('chart-line');
  var markers = document.querySelectorAll('.chart-marker');
  var valueSets = [
    [0.49, 0.62, 0.79, 0.75, 0.86], // Tomb Raider
    [0.97, 0.87, 0.97, 0.84, 0.93], // Mario
    [0.54, 0.78, 0.77, 0.63, 0.38], // THPS
    [0.83, 0.69, 0.81, 0.72, 0.32]  // Sonic
  ];
  var min = 20;
  var max = 520;
  var ease = Sine.easeInOut;
  var duration = 0.75;
  var delay = '+=0.25';

  var yFromRatio = function (ratio) {
    return (max - min) * (1 - ratio) + min;
  };

  valueSets.forEach(function (set, setIndex) {
    var label = 'set' + setIndex;
    var points = [];
    timeline.addLabel(label, delay);

    set.forEach(function (value, index) {
      var marker = markers[index];
      var cx = marker.getAttribute('cx');
      var cy = yFromRatio(value);
      var color;

      points.push(cx, cy);

      if (value > .75) {
        color = '#2ecc40';
      } else if (value > .5) {
        color = '#ffdc00';
      } else {
        color = '#ff4136';
      }

      timeline.to(marker, duration, {
        attr: {
          cy: cy,
          fill: color
        },
        ease: ease
      }, label);
    });

    timeline.to(line, duration, {
      attr: {
        points: points.join(' ')
      },
      ease: ease
    }, label);
  });

  return timeline;
})());

fragmentTimeline('favePress', (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  var fave = document.getElementById('fave');

  timeline.to(fave, 0.5, {
    scale: 0.8,
    onComplete: function () {
      fave.setAttribute('aria-pressed', 'true');
    }
  });

  timeline.to(fave, 2, {
    scale: 1,
    ease: Elastic.easeOut.config(3, 0.3),
    onReverseComplete: function () {
      fave.setAttribute('aria-pressed', 'false');
    }
  });

  return timeline;
})());

fragmentTimeline('morphButton', (function () {
  var timeline = new TimelineMax({
    paused: true
  });

  var button = document.getElementById('morph-button');
  var square = document.getElementById('morph-square');
  var check = document.getElementById('morph-check');
  var label = document.getElementById('morph-label');

  var buttonPoints = button.getAttribute('points');
  var squarePoints = square.getAttribute('points');
  var checkPoints = check.getAttribute('points');

  var i;

  timeline.set(label, {
    transformOrigin: '50% 50%' // I'm not sure why??
  });

  timeline.to(button, 0.5, {
    attr: {
      points: squarePoints
    },
    ease: Back.easeIn.config(1.8)
  });

  timeline.to(label, 0.5, {
    scale: 0,
    opacity: 0,
    ease: Back.easeIn.config(1.8)
  }, '-=0.5');

  for (i = 0; i < 3; i++) {
    timeline.to(button, 1, {
      rotation: '+=225',
      transformOrigin: '50% 50%',
      ease: Back.easeOut.config(1.8)
    });
  }

  timeline.to(button, 1, {
    x: -30,
    y: 50,
    scale: 0.75,
    attr: {
      points: checkPoints
    },
    ease: Elastic.easeOut.config(1, 0.3)
  });

  return timeline;
})());

fragmentTimeline('gStart', (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  
  var clipShape = document.getElementById('g-highlight-clip-shape');
  var clipPointsEar = clipShape.getAttribute('points');
  var clipPointsBowl = clipShape.getAttribute('data-points-bowl');
  var clipPointsLink = clipShape.getAttribute('data-points-link');
  var clipPointsLoop = clipShape.getAttribute('data-points-loop');
  
  var highlightContainer = document.getElementById('g-highlights');
  var highlightEar = document.getElementById('g-highlight-ear');
  var highlightBowl = document.getElementById('g-highlight-bowl');
  var highlightLink = document.getElementById('g-highlight-link');
  var highlightLoop = document.getElementById('g-highlight-loop');
  
  var labelEar = document.getElementById('g-label-ear');
  var labelBowl = document.getElementById('g-label-bowl');
  var labelLink = document.getElementById('g-label-link');
  var labelLoop = document.getElementById('g-label-loop');
  
  var labelFillFrom = labelEar.getAttribute('fill');
  var labelFillTo = '#4c5f56';
  
  var duration = 0.6;
  var durationShort = duration / 4;
  var delay = duration * 1.25;
  
  var clipEase = Back.easeInOut.config(1.4);
  
  timeline.set(highlightContainer, {
    'visibility': 'visible'
  });
  
  timeline.addLabel('toEar');
  
  timeline.to(labelEar, durationShort, {
    fill: labelFillTo
  }, 'toEar');
  
  timeline.fromTo(clipShape, duration / 1.5, {
    scale: 0,
    transformOrigin: '50% 50%'
  }, {
    scale: 1,
    ease: Back.easeOut.config(1.4)
  }, 'toEar');
  
  timeline.addLabel('earToBowl', '+=' + delay);
  
  timeline.to(labelBowl, durationShort, {
    fill: labelFillTo
  }, 'earToBowl');
  
  timeline.fromTo(clipShape, duration, {
    attr: {
      points: clipPointsEar
    }
  }, {
    attr: {
      points: clipPointsBowl
    },
    ease: clipEase
  }, 'earToBowl');
  
  timeline.fromTo(highlightBowl, duration, {
    opacity: 0
  }, {
    opacity: 1
  }, 'earToBowl');
  
  timeline.to(highlightEar, durationShort, {
    opacity: 0
  }, 'earToBowl');
  
  timeline.to(labelEar, durationShort, {
    fill: labelFillFrom
  }, 'earToBowl');
  
  timeline.addLabel('bowlToLink', '+=' + delay);
  
  timeline.to(labelLink, durationShort, {
    fill: labelFillTo
  }, 'bowlToLink');
  
  timeline.to(clipShape, duration, {
    attr: {
      points: clipPointsLink
    },
    ease: clipEase
  }, 'bowlToLink');
  
  timeline.fromTo(highlightLink, duration, {
    opacity: 0
  }, {
    opacity: 1
  }, 'bowlToLink');
  
  timeline.to(highlightBowl, durationShort, {
    opacity: 0
  }, 'bowlToLink');
  
  timeline.to(labelBowl, durationShort, {
    fill: labelFillFrom
  }, 'bowlToLink');
  
  timeline.addLabel('linkToLoop', '+=' + delay);
  
  timeline.to(labelLoop, durationShort, {
    fill: labelFillTo
  }, 'linkToLoop');
  
  timeline.to(clipShape, duration, {
    attr: {
      points: clipPointsLoop
    },
    ease: clipEase
  }, 'linkToLoop');
  
  timeline.fromTo(highlightLoop, duration, {
    opacity: 0
  }, {
    opacity: 1
  }, 'linkToLoop');
  
  timeline.to(highlightLink, durationShort, {
    opacity: 0
  }, 'linkToLoop');
  
  timeline.to(labelLink, durationShort, {
    fill: labelFillFrom
  }, 'linkToLoop');
  
  return timeline;
})());

fragmentTimeline('navExpand', (function () {
  var timeline = new TimelineMax({
    paused: true
  });

  var toggle = document.getElementById('nav-toggle');
  var toggleBase = document.getElementById('nav-toggle-base');
  var toggleIcon = document.getElementById('nav-toggle-icon');
  var toggleIconTop = document.getElementById('nav-toggle-icon-top');
  var toggleIconMiddle = document.getElementById('nav-toggle-icon-middle');
  var toggleIconBottom = document.getElementById('nav-toggle-icon-bottom');

  var childE = document.getElementById('nav-e');
  var childSE = document.getElementById('nav-se');
  var childS = document.getElementById('nav-s');

  var children = [childE, childSE, childS];
  var everything = [
    toggle, toggleBase, toggleIcon, toggleIconTop, toggleIconMiddle,
    toggleIconBottom, childE, childSE, childS
  ];

  timeline.set(everything, {
    transformOrigin: '50% 50%'
  });

  timeline.set(children, {
    visibility: 'hidden',
    scale: 0.2
  });

  timeline.to(toggle, 0.5, {
    scale: 0.8,
    ease: Sine.easeOut
  });

  timeline.addLabel('pressed');

  timeline.to(toggle, 1, {
    scale: 1,
    ease: Elastic.easeOut.config(1.2, 0.3)
  });

  timeline.to(toggleBase, 0.1, {
    fill: '#ddd'
  }, 'pressed');

  timeline.to(toggleIcon, 0.1, {
    stroke: '#222'
  }, 'pressed');

  timeline.to(toggleIconTop, 0.1, {
    y: '+=8',
    ease: Sine.easeIn
  }, 'pressed');

  timeline.to(toggleIconBottom, 0.1, {
    y: '-=8',
    ease: Sine.easeIn
  }, 'pressed');

  timeline.addLabel('toX', 'pressed+=0.1');

  timeline.set(toggleIconMiddle, {
    visibility: 'hidden'
  }, 'toX');

  timeline.to(toggleIconTop, 0.1, {
    rotation: 45,
    ease: Sine.easeOut
  }, 'toX');

  timeline.to(toggleIconBottom, 0.1, {
    rotation: -45,
    ease: Sine.easeOut
  }, 'toX');

  timeline.set(children, {
    visibility: 'visible'
  }, 'pressed');

  timeline.to(childE, 1, {
    scale: 1,
    x: '+=90',
    ease: Elastic.easeOut.config(1, 0.5)
  }, 'pressed');

  timeline.to(childSE, 1, {
    scale: 1,
    x: '+=65',
    y: '+=65',
    ease: Elastic.easeOut.config(1, 0.5)
  }, 'pressed+=0.1');

  timeline.to(childS, 1, {
    scale: 1,
    y: '+=90',
    ease: Elastic.easeOut.config(1, 0.5)
  }, 'pressed+=0.2');

  return timeline;
})());

slideTimeline('lovefest', (function () {
  var timeline = new TimelineMax({
    paused: true,
    repeat: -1
  });

  var group = document.getElementById('lovefest');
  var heart = document.getElementById('lovefest-heart');
  var nodes = group.querySelectorAll('g');

  timeline.fromTo(heart, (5 / 4), {
    rotation: -15,
    svgOrigin: '480 300'
  }, {
    rotation: 15,
    repeat: 3,
    yoyo: true,
    ease: Sine.easeInOut
  });

  timeline.to(group, 5, {
    rotation: 360,
    svgOrigin: '480 300',
    ease: Linear.easeNone
  }, 0);

  timeline.to(nodes, 5, {
    rotation: -360,
    transformOrigin: '50% 50%',
    ease: Linear.easeNone
  }, 0);

  return timeline;
})());

RevealHooks.addEach('cloudMasks', {
  'fragmentshown': function (element, event, options) {
    var images = document.querySelectorAll('.cloud-mask-image');
    for (var i = 0; i < images.length; i++) {
      images[i].setAttribute('clip-path', 'url(#cloud-mask)');
    }
  },
  'fragmenthidden': function (element, event, options) {
    var images = document.querySelectorAll('.cloud-mask-image');
    for (var i = 0; i < images.length; i++) {
      images[i].setAttribute('clip-path', '');
    }
  }
});

RevealHooks.addEach('halfTones', {
  'fragmentshown': function (element, event, options) {
    var images = document.querySelectorAll('.half-tone-image');
    for (var i = 0; i < images.length; i++) {
      images[i].setAttribute('filter', 'url(#half-tone)');
    }
  },
  'fragmenthidden': function (element, event, options) {
    var images = document.querySelectorAll('.half-tone-image');
    for (var i = 0; i < images.length; i++) {
      images[i].setAttribute('filter', '');
    }
  }
});

slideTimeline('spinner', (function () {
  var spinner = document.getElementById('spinner-gsap');

  return TweenMax.to(spinner, 1.3, {
    paused: true,
    repeat: -1,
    transformOrigin: '50% 50%',
    rotation: 180,
    ease: Back.easeOut.config(1.8)
  });
})());

fragmentTimeline('fun', (function () {
  var timeline = new TimelineMax({
    paused: true
  });
  var before = document.getElementById('fun-before');
  var after = document.getElementById('fun-after');

  timeline.set([before, after], {
    svgOrigin: '230 200'
  });

  timeline.set(after, {
    scale: 0.2,
    visibility: 'hidden'
  });

  timeline.to(before, 0.5, {
    scale: 0.2,
    ease: RoughEase.ease.config({
      template: Linear.easeNone,
      strength: 1,
      points: 20,
      taper: 'in',
      randomize: true,
      clamp: false
    })
  });

  timeline.set(before, {
    visibility: 'hidden'
  });

  timeline.set(after, {
    visibility: 'visible'
  });

  timeline.to(after, 1, {
    scale: 1.25,
    ease: Elastic.easeOut.config(1.5, 0.4)
  });

  return timeline;
})());

fragmentTimeline('fgScroll', (function(){
  var element = document.getElementById('safari-fg-inner');
  var height = element.getAttribute('height');
  var tween = new TweenMax(element, 4, {
    paused: true,
    y: '-=' + (height - 720),
    ease: Sine.easeInOut
  });

  return tween;
})());
