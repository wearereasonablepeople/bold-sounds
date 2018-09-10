import {Howl, Howler} from 'howler';
import howlOpts from './sprites';

const defaultOpts = {
  ambienceCrossFadeDuration: 4000,
  afterEffectFadeInDuration: 2000,
  duringEffectVolume: 0.3,
  volume: 0.8
};

const isAmbience = sprite => sprite.includes('ambience');
const isEndOfGame = sprite => sprite === 'end-of-game';

class BoldSounds {
  constructor(opts = {}) {
    this._opts = Object.assign(defaultOpts, opts);
    // Change global volume.
    Howler.volume(opts.volume);
    this._state = {ambience: null};
    this._sound = null;
  }

  playAmbience(sprite, loop = true) {
    const {_state: state, _sound: sound, _opts: opts} = this;
    if (state.ambience) {
      sound.fade(1, 0, opts.ambienceCrossFadeDuration, state.ambience);
      sound.once('fade', id => sound.stop(id), state.ambience);
    }
    state.ambience = sound.play(sprite);
    sound.fade(0, 1, opts.ambienceCrossFadeDuration, state.ambience);
    sound.loop(loop, state.ambience);
  }

  playEffect(sprite) {
    const {_state: state, _sound: sound, _opts: opts} = this;
    const lowerVolume = opts.duringEffectVolume;
    if (state.ambience) {
      sound.volume(lowerVolume, state.ambience);
    }
    const effectId = sound.play(sprite);
    sound.once('end', () => {
      if (state.ambience) {
        sound.fade(lowerVolume, 1, opts.afterEffectFadeInDuration, state.ambience);
      }
    }, effectId);
  }

  playEndOfGame(sprite) {
    const {_state: state, _sound: sound, _opts: opts} = this;
    if (state.ambience) {
      sound.fade(1, 0, opts.ambienceCrossFadeDuration, state.ambience);
      sound.once('fade', id => sound.stop(id), state.ambience);
    }
    sound.play(sprite);
  }

  play(sprite) {
    if (isAmbience(sprite)) {
      this.playAmbience(sprite);
    } else if(isEndOfGame(sprite)) {
      this.playEndOfGame(sprite, false);
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
