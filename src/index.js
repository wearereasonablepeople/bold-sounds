import {Howl, Howler} from 'howler';
import howlOpts from './sprites';

const DEFAULT_AMBIENCE = 'ambience-default';
const FADE_DURATION = 2000;
const isAmbience = sprite => sprite.includes('ambience');
const isSteps = sprite => sprite.includes('steps');

class BoldSounds {
  constructor(opts) {
    // Change global volume.
    Howler.volume((opts && opts.volume) || 0.8);

    this.publicPath = (opts && opts.publicPath) || '';
    this.state = {steps: null, ambience: null};
    this.sound = null;
  }

  playAmbience(sprite) {
    const {state, sound} = this;
    if (state.ambience) {
      sound.fade(1, 0, FADE_DURATION, state.ambience);
    }
    if (state.steps) {
      sound.stop(state.steps);
    }
    state.ambience = sound.play(sprite);
    sound.fade(0, 1, FADE_DURATION, state.ambience);
    sound.loop(true, state.ambience);
  }

  playSteps(sprite) {
    const {state, sound} = this;
    state.steps = sound.play(sprite);
    sound.loop(true, state.steps);
  }

  playEffect(sprite) {
    const {state, sound} = this;
    const lowerVolume = 0.4;
    if (state.ambience) {
      sound.volume(lowerVolume, state.ambience);
    }
    if (state.steps) {
      sound.volume(lowerVolume, state.steps);
    }
    const effectId = sound.play(sprite);
    setTimeout(() => {
      if (state.ambience) {
        sound.fade(lowerVolume, 1, FADE_DURATION, state.ambience);
      }
      if (state.steps) {
        sound.fade(lowerVolume, 1, FADE_DURATION, state.steps);
      }
    }, sound.duration(effectId) * 1000);
  }

  play(sprite) {
    if (isAmbience(sprite)) {
      this.playAmbience(sprite);
    } else if (isSteps(sprite)) {
      this.playAmbience(DEFAULT_AMBIENCE);
      this.playSteps(sprite);
    } else {
      this.playEffect(sprite);
    }
  }

  mute(isMuted) {
    this.sound.mute(isMuted);
  }

  init() {
    const {publicPath} = this;
    return new Promise((resolve, reject) => {
      howlOpts.src = howlOpts.src.map(url => `${publicPath}${url}`);
      howlOpts.onfade = id => {
        if (this.sound.volume(id) === 0) {
          this.sound.stop(id);
        }
      };
      howlOpts.onload = resolve;
      howlOpts.onloaderror = reject;
      this.sound = new Howl(howlOpts);
    });
  }
}

export default BoldSounds;
