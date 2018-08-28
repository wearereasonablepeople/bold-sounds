import {Howl, Howler} from 'howler';
import howlOpts from './sprites';

const DEFAULT_AMBIENCE = 'ambience-default';
const END_OF_GAME = 'end-of-game'
const FADE_DURATION = 2000;
const isAmbience = sprite => sprite.includes('ambience');
const isSteps = sprite => sprite.includes('steps');

class BoldSounds {
  constructor(opts) {
    // Change global volume.
    Howler.volume((opts && opts.volume) || 0.8);

    this._src = (opts && opts.src) || '';
    this._state = {steps: null, ambience: null};
    this._sound = null;
  }

  playAmbience(sprite, loop = true) {
    const {_state: state, _sound: sound} = this;
    if (state.ambience) {
      sound.fade(1, 0, FADE_DURATION, state.ambience);
      sound.once('fade', id => sound.stop(id), state.ambience);
    }
    if (state.steps) {
      sound.stop(state.steps);
    }
    state.ambience = sound.play(sprite);
    sound.fade(0, 1, FADE_DURATION, state.ambience);
    sound.loop(loop, state.ambience);
  }

  playSteps(sprite) {
    const {_state: state, _sound: sound} = this;
    state.steps = sound.play(sprite);
    sound.loop(true, state.steps);
  }

  playEffect(sprite) {
    const {_state: state, _sound: sound} = this;
    const lowerVolume = 0.4;
    if (state.ambience) {
      sound.volume(lowerVolume, state.ambience);
    }
    if (state.steps) {
      sound.volume(lowerVolume, state.steps);
    }
    const effectId = sound.play(sprite);
    sound.once('end', () => {
      if (state.ambience) {
        sound.fade(lowerVolume, 1, FADE_DURATION, state.ambience);
      }
      if (state.steps) {
        sound.fade(lowerVolume, 1, FADE_DURATION, state.steps);
      }
    }, effectId);
  }

  play(sprite) {
    if (isAmbience(sprite)) {
      this.playAmbience(sprite);
    } else if (isSteps(sprite)) {
      this.playAmbience(DEFAULT_AMBIENCE);
      this.playSteps(sprite);
    } else if(sprite === END_OF_GAME) {
      this.playAmbience(END_OF_GAME, false);
    } else {
      this.playEffect(sprite);
    }
  }

  mute(isMuted) {
    this._sound.mute(isMuted);
  }

  init() {
    const {_src: src} = this;
    return new Promise((resolve, reject) => {
      if (src) {
        howlOpts.src = src;
      }
      howlOpts.onload = resolve;
      howlOpts.onloaderror = reject;
      this._sound = new Howl(howlOpts);
    });
  }
}

export default BoldSounds;
