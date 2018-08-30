import {Howl, Howler} from 'howler';
import howlOpts from './sprites';

const defaultOpts = {
  ambienceCrossFadeDuration: 4000,
  afterEffectFadeInDuration: 2000,
  endOfGame: 'end-of-game',
  defaultAmbience: 'ambience-default',
  volume: 0.8
};

const isAmbience = sprite => sprite.includes('ambience');
const isSteps = sprite => sprite.includes('steps');

class BoldSounds {
  constructor(opts = {}) {
    this._opts = Object.assign(defaultOpts, opts);
    // Change global volume.
    Howler.volume(opts.volume);
    this._state = {steps: null, ambience: null};
    this._sound = null;
  }

  playAmbience(sprite, loop = true) {
    const {_state: state, _sound: sound, _opts: opts} = this;
    if (state.ambience) {
      sound.fade(1, 0, opts.ambienceCrossFadeDuration, state.ambience);
      sound.once('fade', id => sound.stop(id), state.ambience);
    }
    if (state.steps) {
      sound.stop(state.steps);
    }
    state.ambience = sound.play(sprite);
    sound.fade(0, 1, opts.ambienceCrossFadeDuration, state.ambience);
    sound.loop(loop, state.ambience);
  }

  playSteps(sprite) {
    const {_state: state, _sound: sound} = this;
    state.steps = sound.play(sprite);
    sound.loop(true, state.steps);
  }

  playEffect(sprite) {
    const {_state: state, _sound: sound, _opts: opts} = this;
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
        sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.ambience);
      }
      if (state.steps) {
        sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.steps);
      }
    }, effectId);
  }

  play(sprite) {
    const {_opts: opts} = this;
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
  }

  mute(isMuted) {
    this._sound.mute(isMuted);
  }

  init() {
    const {_opts: opts} = this;
    return new Promise((resolve, reject) => {
      howlOpts.src = opts.src;
      howlOpts.onload = resolve;
      howlOpts.onloaderror = reject;
      this._sound = new Howl(howlOpts);
    });
  }
}

export default BoldSounds;
