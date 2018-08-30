import { Howl, Howler } from 'howler';

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
    'ambience-park': [
      98000,
      30321.224489795924
    ],
    'ambience-pier': [
      130000,
      16823.60544217687
    ],
    'ambience-wack-a-mole': [
      148000,
      11145.578231292518
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
    'end-of-game': [
      175000,
      14769.251700680286
    ],
    'hint': [
      191000,
      4000
    ],
    'hit-good': [
      196000,
      679.2063492063392
    ],
    'hit': [
      198000,
      609.5238095238074
    ],
    'horse-snort': [
      200000,
      702.9931972789143
    ],
    'paper': [
      202000,
      1001.2471655328739
    ],
    'pen': [
      205000,
      932.9251700680175
    ],
    'phone-vibration': [
      207000,
      4224.64852607709
    ],
    'scan-barcode': [
      213000,
      301.8594104308363
    ],
    'seagals': [
      215000,
      7558.163265306121
    ],
    'steps-on-grass': [
      224000,
      3788.3446712018267
    ],
    'steps-on-stone': [
      229000,
      4236.417233560104
    ],
    'time-is-almost-up': [
      235000,
      9519.818594104323
    ],
    'trash': [
      246000,
      2497.936507936515
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
  endOfGame: 'end-of-game',
  defaultAmbience: 'ambience-default',
  volume: 0.8
};

var isAmbience = function (sprite) { return sprite.includes('ambience'); };
var isSteps = function (sprite) { return sprite.includes('steps'); };

var BoldSounds = function BoldSounds(opts) {
  if ( opts === void 0 ) opts = {};

  this._opts = Object.assign(defaultOpts, opts);
  // Change global volume.
  Howler.volume(opts.volume);
  this._state = {steps: null, ambience: null};
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
  if (state.steps) {
    sound.stop(state.steps);
  }
  state.ambience = sound.play(sprite);
  sound.fade(0, 1, opts.ambienceCrossFadeDuration, state.ambience);
  sound.loop(loop, state.ambience);
};

BoldSounds.prototype.playSteps = function playSteps (sprite) {
  var ref = this;
    var state = ref._state;
    var sound = ref._sound;
  state.steps = sound.play(sprite);
  sound.loop(true, state.steps);
};

BoldSounds.prototype.playEffect = function playEffect (sprite) {
  var ref = this;
    var state = ref._state;
    var sound = ref._sound;
    var opts = ref._opts;
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
      sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.ambience);
    }
    if (state.steps) {
      sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.steps);
    }
  }, effectId);
};

BoldSounds.prototype.play = function play (sprite) {
  var ref = this;
    var opts = ref._opts;
  if (isAmbience(sprite)) {
    this.playAmbience(sprite);
  } else if (isSteps(sprite)) {
    this.playAmbience(opts.defaultAmbience);
    this.playSteps(sprite);
  } else if(sprite === opts.endOfGame) {
    this.playAmbience(opts.endOfGame, false);
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
    this$1._sound = new Howl(howlOpts);
  });
};

export default BoldSounds;
