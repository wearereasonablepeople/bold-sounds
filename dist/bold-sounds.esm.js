import { Howl, Howler } from 'howler';

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
    'ambience-space': [
      190000,
      10471.111111111099
    ],
    'badge': [
      202000,
      2608.1405895691605
    ],
    'click': [
      206000,
      45.89569160998508
    ],
    'coins': [
      208000,
      1162.6077097505743
    ],
    'collect-item': [
      211000,
      1493.5600907029425
    ],
    'end-of-game': [
      214000,
      14769.251700680286
    ],
    'fly-away-bonus': [
      230000,
      896.1678004535258
    ],
    'fly-away': [
      232000,
      452.35827664399153
    ],
    'hint': [
      234000,
      4000
    ],
    'horse-snort': [
      239000,
      702.9931972789143
    ],
    'horse-whinny': [
      241000,
      1644.1723356008993
    ],
    'id-scan': [
      244000,
      314.6712018140647
    ],
    'ov-chipcard': [
      246000,
      549.3650793650886
    ],
    'paper-pen': [
      248000,
      1537.528344671216
    ],
    'phone-vibration': [
      251000,
      4224.64852607709
    ],
    'smart-bin': [
      257000,
      2096.0090702947696
    ],
    'steps-long': [
      261000,
      4014.64852607711
    ],
    'steps-short': [
      267000,
      1836.6893424036448
    ],
    'time-is-almost-up': [
      270000,
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
  Howler.volume(opts.volume);
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
    this$1._sound = new Howl(howlOpts);
  });
};

export default BoldSounds;
