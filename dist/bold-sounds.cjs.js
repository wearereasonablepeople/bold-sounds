'use strict';

var howler = require('howler');

var howlOpts = {
	"sprite": {
		"ambience-city": [
			0,
			65482.01814058957
		],
		"ambience-default": [
			67000,
			29768.730158730166
		],
		"ambience-park": [
			98000,
			30321.224489795924
		],
		"ambience-pier": [
			130000,
			16823.60544217687
		],
		"badge": [
			148000,
			2608.1405895691605
		],
		"chipcard-link": [
			152000,
			314.6712018140647
		],
		"chipcard-print": [
			154000,
			1776.7800453514724
		],
		"click": [
			157000,
			45.89569160998508
		],
		"collect-item": [
			159000,
			1266.4399092970484
		],
		"hint": [
			162000,
			4000
		],
		"hit-good": [
			167000,
			679.2063492063392
		],
		"hit": [
			169000,
			609.5238095238074
		],
		"horse-snort": [
			171000,
			702.9931972789143
		],
		"paper": [
			173000,
			1001.2698412698455
		],
		"pen": [
			176000,
			932.9251700680175
		],
		"phone-vibration": [
			178000,
			4224.64852607709
		],
		"scan-barcode": [
			184000,
			301.8594104308363
		],
		"seagals": [
			186000,
			7558.1859410430925
		],
		"steps-on-grass": [
			195000,
			3788.3446712018267
		],
		"steps-on-stone": [
			200000,
			4236.417233560104
		],
		"time-is-almost-up": [
			206000,
			9519.818594104323
		],
		"trash": [
			217000,
			2497.936507936515
		]
	},
	"src": [
		"sprites.webm",
		"sprites.mp3"
	]
};

var DEFAULT_AMBIENCE = 'ambience-default';

var isAmbience = function (sprite) { return sprite.includes('ambience'); };
var isSteps = function (sprite) { return sprite.includes('steps'); };

var BoldSounds = function BoldSounds(opts) {
  // Change global volume.
  //Howler.volume((opts && opts.volume) || 0.5);

  this.publicPath = (opts && opts.publicPath) || '';
  this.state = {steps: null, ambience: null};
  this.sound = null;
};

BoldSounds.prototype.playAmbience = function playAmbience (sprite) {
  var ref = this;
    var state = ref.state;
    var sound = ref.sound;
  if (state.ambience) {
    sound.fade(1, 0, 2000, state.ambience);
  }
  if (state.steps) {
    sound.stop(state.steps);
  }
  state.ambience = sound.play(sprite);
  sound.loop(true, state.ambience);
};

BoldSounds.prototype.playSteps = function playSteps (sprite) {
  var ref = this;
    var state = ref.state;
    var sound = ref.sound;
  state.steps = sound.play(sprite);
  sound.loop(true, state.steps);
};

BoldSounds.prototype.play = function play (sprite) {
  var ref = this;
    var sound = ref.sound;
  if (isAmbience(sprite)) {
    this.playAmbience(sprite);
  } else if (isSteps(sprite)) {
    this.playAmbience(DEFAULT_AMBIENCE);
    this.playSteps(sprite);
  } else {
    sound.play(sprite);
  }
};

BoldSounds.prototype.mute = function mute (isMuted) {
  this.sound.mute(isMuted);
};

BoldSounds.prototype.init = function init () {
    var this$1 = this;

  var ref = this;
    var publicPath = ref.publicPath;
  return new Promise(function (resolve, reject) {
    howlOpts.src = howlOpts.src.map(function (url) { return ("" + publicPath + url); });
    howlOpts.onfade = function (id) {
      this$1.sound.stop(id);
    };
    howlOpts.onload = resolve;
    howlOpts.onloaderror = reject;
    this$1.sound = new howler.Howl(howlOpts);
  });
};

module.exports = BoldSounds;
