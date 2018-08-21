import {Howl, Howler} from 'howler';
import howlOpts from './sprites';

const DEFAULT_AMBIENCE = 'ambience-default';

const isAmbience = sprite => sprite.includes('ambience');
const isSteps = sprite => sprite.includes('steps');

class BoldSounds {
  constructor(opts) {
    // Change global volume.
    Howler.volume((opts && opts.volume) || 0.7);

    this.publicPath = (opts && opts.publicPath) || '';
    this.state = {steps: null, ambience: null};
    this.sound = null;
  }

  playAmbience(sprite) {
    const {state, sound} = this;
    if (state.ambience) {
      sound.fade(1, 0, 2000, state.ambience);
    }
    if (state.steps) {
      sound.stop(state.steps);
    }
    state.ambience = sound.play(sprite);
    sound.loop(true, state.ambience);
  }

  playSteps(sprite) {
    const {state, sound} = this;
    state.steps = sound.play(sprite);
    sound.loop(true, state.steps);
  }

  play(sprite) {
    const {sound} = this;
    if (isAmbience(sprite)) {
      this.playAmbience(sprite);
    } else if (isSteps(sprite)) {
      this.playAmbience(DEFAULT_AMBIENCE);
      this.playSteps(sprite);
    } else {
      sound.play(sprite);
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
        this.sound.stop(id);
      };
      howlOpts.onload = resolve;
      howlOpts.onloaderror = reject;
      this.sound = new Howl(howlOpts);
    });
  }
}

export default BoldSounds;
