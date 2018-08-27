'use strict';

var howler = require('howler');

var howlOpts = {
  sprite: {
    'ambience-city': [
      0,
      65482.01814058957
    ],
    'ambience-default': [
      67000,
      29768.730158730166
    ],
    'ambience-game': [
      98000,
      11145.578231292518
    ],
    'ambience-park': [
      111000,
      30321.224489795924
    ],
    'ambience-pier': [
      143000,
      16823.60544217687
    ],
    'badge': [
      161000,
      2608.1405895691605
    ],
    'chipcard-link': [
      165000,
      314.6712018140647
    ],
    'chipcard-print': [
      167000,
      1776.7800453514724
    ],
    'click': [
      170000,
      45.89569160998508
    ],
    'collect-item': [
      172000,
      1266.4399092970484
    ],
    'hint': [
      175000,
      4000
    ],
    'hit-good': [
      180000,
      679.2063492063392
    ],
    'hit': [
      182000,
      609.5238095238074
    ],
    'horse-snort': [
      184000,
      702.9931972789143
    ],
    'paper': [
      186000,
      1001.2471655328739
    ],
    'pen': [
      189000,
      932.9251700680175
    ],
    'phone-vibration': [
      191000,
      4224.64852607709
    ],
    'scan-barcode': [
      197000,
      301.8594104308363
    ],
    'seagals': [
      199000,
      7558.163265306121
    ],
    'steps-on-grass': [
      208000,
      3788.3446712018267
    ],
    'steps-on-stone': [
      213000,
      4236.417233560104
    ],
    'time-is-almost-up': [
      219000,
      9519.818594104323
    ],
    'trash': [
      230000,
      2497.936507936515
    ]
  },
  src: [
    'sprites.webm',
    'sprites.mp3'
  ]
};

var DEFAULT_AMBIENCE = 'ambience-default';
var FADE_DURATION = 2000;
var isAmbience = function (sprite) { return sprite.includes('ambience'); };
var isSteps = function (sprite) { return sprite.includes('steps'); };

var BoldSounds = function BoldSounds(opts) {
  // Change global volume.
  howler.Howler.volume((opts && opts.volume) || 0.8);

  this.src = (opts && opts.src) || '';
  this.state = {steps: null, ambience: null};
  this.sound = null;
};

BoldSounds.prototype.playAmbience = function playAmbience (sprite) {
  var ref = this;
    var state = ref.state;
    var sound = ref.sound;
  if (state.ambience) {
    sound.fade(1, 0, FADE_DURATION, state.ambience);
    sound.once('fade', function (id) { return sound.stop(id); }, state.ambience);
  }
  if (state.steps) {
    sound.stop(state.steps);
  }
  state.ambience = sound.play(sprite);
  sound.fade(0, 1, FADE_DURATION, state.ambience);
  sound.loop(true, state.ambience);
};

BoldSounds.prototype.playSteps = function playSteps (sprite) {
  var ref = this;
    var state = ref.state;
    var sound = ref.sound;
  state.steps = sound.play(sprite);
  sound.loop(true, state.steps);
};

BoldSounds.prototype.playEffect = function playEffect (sprite) {
  var ref = this;
    var state = ref.state;
    var sound = ref.sound;
  var lowerVolume = 0.4;
  if (state.ambience) {
    sound.volume(lowerVolume, state.ambience);
  }
  if (state.steps) {
    sound.volume(lowerVolume, state.steps);
  }
  var effectId = sound.play(sprite);
  sound.once('end', function () {
    if (state.ambience) {
      sound.fade(lowerVolume, 1, FADE_DURATION, state.ambience);
    }
    if (state.steps) {
      sound.fade(lowerVolume, 1, FADE_DURATION, state.steps);
    }
  }, effectId);
};

BoldSounds.prototype.play = function play (sprite) {
  if (isAmbience(sprite)) {
    this.playAmbience(sprite);
  } else if (isSteps(sprite)) {
    this.playAmbience(DEFAULT_AMBIENCE);
    this.playSteps(sprite);
  } else {
    this.playEffect(sprite);
  }
};

BoldSounds.prototype.mute = function mute (isMuted) {
  this.sound.mute(isMuted);
};

BoldSounds.prototype.init = function init () {
    var this$1 = this;

  var ref = this;
    var src = ref.src;
  return new Promise(function (resolve, reject) {
    if (src) {
      howlOpts.src = src;
    }
    howlOpts.onload = resolve;
    howlOpts.onloaderror = reject;
    this$1.sound = new howler.Howl(howlOpts);
  });
};

module.exports = BoldSounds;
