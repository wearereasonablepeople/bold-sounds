# Bold sounds

Module to play ambient and effect sounds for the game.

## Usage

1. Get the module

    `npm install git+https://github .com/wearereasonablepeople/bold-sounds.git`

2. Copy `sprites.mp3` and `sprites.webm` to your app public folder (e.g `/build/audio/`) manually or using Webpack.
    ```
    cp node_modules/bold-sounds/dist/sprites.* /build/audio/
    ```


3. Import the module of your choice (.cjs, .umd or .esm) from `/dist` folder and play some sounds

```javascript
import BoldSounds from 'bold-sounds';
const boldSounds = new BoldSounds({publicPath: '/build/audio'});

boldSounds.init()
.then(() => {
    // at this point audio files are loaded
    // for a list of available sounds see src/sprites.js
    boldSounds.play('badge');

    //to mute all sounds we can do
    boldSounds.mute(true);

    //to unmute all sounds we can do
    boldSounds.mute(false);
});
```

## Logic

- All `ambience-` sounds would play in a loop until a different ambience starts to play.

- All `steps-` sounds would play until ambience starts to play.

- All other sounds would just play once and can be combined with ambience or other sounds.

## Build

Requires `ffmpeg` to build sprites

```
brew install ffmpeg --with-theora --with-libvorbis
npm run build
```
