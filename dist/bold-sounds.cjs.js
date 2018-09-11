'use strict';

var howler = require('howler');

var howlOpts = {
  sprite: {
    'ambience-city-cafe': [
      0,
      40102.51700680272
    ],
    'ambience-city-center': [
      42000,
      65482.01814058957
    ],
    'ambience-info': [
      109000,
      29768.730158730166
    ],
    'ambience-park': [
      140000,
      30321.224489795924
    ],
    'ambience-pier': [
      172000,
      16823.60544217687
    ],
    'ambience-wack-a-mole': [
      190000,
      11145.578231292518
    ],
    'badge': [
      203000,
      2608.1405895691605
    ],
    'click': [
      207000,
      45.89569160998508
    ],
    'collect-item': [
      209000,
      1493.5600907029425
    ],
    'end-of-game': [
      212000,
      14769.251700680286
    ],
    'hint': [
      228000,
      4000
    ],
    'hit-good': [
      233000,
      679.2063492063392
    ],
    'hit': [
      235000,
      609.5238095238074
    ],
    'horse-snort': [
      237000,
      702.9931972789143
    ],
    'horse-whinny': [
      239000,
      1644.1723356008993
    ],
    'id-scan': [
      242000,
      314.6712018140647
    ],
    'ov-chipcard': [
      244000,
      549.3650793650886
    ],
    'paper-pen': [
      246000,
      1537.528344671216
    ],
    'phone-vibration': [
      249000,
      4224.64852607709
    ],
    'smart-bin': [
      255000,
      2096.0090702947696
    ],
    'time-is-almost-up': [
      259000,
      9519.818594104323
    ]
  },
  src: [
    'sprites.webm',
    'sprites.mp3'
  ]
};

var defaultOpts = {
  ambienceCrossFadeDuration: 4000,
  afterEffectFadeInDuration: 2000,
  duringEffectVolume: 0.3,
  volume: 0.8
};

var isAmbience = function (sprite) { return sprite.includes('ambience'); };
var isEndOfGame = function (sprite) { return sprite === 'end-of-game'; };

var BoldSounds = function BoldSounds(opts) {
  if ( opts === void 0 ) opts = {};

  this._opts = Object.assign(defaultOpts, opts);
  // Change global volume.
  howler.Howler.volume(opts.volume);
  this._state = {ambience: null};
  this._sound = null;
};

BoldSounds.prototype.playAmbience = function playAmbience (sprite, loop) {
    if ( loop === void 0 ) loop = true;

  var ref = this;
    var state = ref._state;
    var sound = ref._sound;
    var opts = ref._opts;
  if (state.ambience) {
    sound.fade(1, 0, opts.ambienceCrossFadeDuration, state.ambience);
    sound.once('fade', function (id) { return sound.stop(id); }, state.ambience);
  }
  state.ambience = sound.play(sprite);
  sound.fade(0, 1, opts.ambienceCrossFadeDuration, state.ambience);
  sound.loop(loop, state.ambience);
};

BoldSounds.prototype.playEffect = function playEffect (sprite) {
  var ref = this;
    var state = ref._state;
    var sound = ref._sound;
    var opts = ref._opts;
  var lowerVolume = opts.duringEffectVolume;
  if (state.ambience) {
    sound.volume(lowerVolume, state.ambience);
  }
  var effectId = sound.play(sprite);
  sound.once('end', function () {
    if (state.ambience) {
      sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.ambience);
    }
  }, effectId);
};

BoldSounds.prototype.playEndOfGame = function playEndOfGame (sprite) {
  var ref = this;
    var state = ref._state;
    var sound = ref._sound;
    var opts = ref._opts;
  if (state.ambience) {
    sound.fade(1, 0, opts.ambienceCrossFadeDuration, state.ambience);
    sound.once('fade', function (id) { return sound.stop(id); }, state.ambience);
  }
  sound.play(sprite);
};

BoldSounds.prototype.play = function play (sprite) {
  if (isAmbience(sprite)) {
    this.playAmbience(sprite);
  } else if(isEndOfGame(sprite)) {
    this.playEndOfGame(sprite, false);
  } else {
    this.playEffect(sprite);
  }
};

BoldSounds.prototype.mute = function mute (isMuted) {
  this._sound.mute(isMuted);
};

BoldSounds.prototype.init = function init () {
    var this$1 = this;

  var ref = this;
    var opts = ref._opts;
  return new Promise(function (resolve, reject) {
    howlOpts.src = opts.src;
    howlOpts.onload = resolve;
    howlOpts.onloaderror = reject;
    this$1._sound = new howler.Howl(howlOpts);
  });
};

module.exports = BoldSounds;
