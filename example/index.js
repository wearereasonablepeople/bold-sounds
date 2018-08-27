import BoldSounds from '../src/'
import howlOpts from '../src/sprites'

var boldSounds = new BoldSounds({src: ['/audio/sprites.mp3', '/audio/sprites.webm']})

boldSounds.init()
.then(function(){
  Object.keys(howlOpts.sprite).forEach(function (key){
    addButton(key, function(){
      boldSounds.play(key)
    })
  })
  var isMuted = false
  addButton('mute/unmute', function(){
    boldSounds.mute(!isMuted)
    isMuted = !isMuted
  })
})


function addButton(text, eventListener){
  // 1. Create the button
  var button = document.createElement("button");
  button.innerHTML = text;

// 2. Append somewhere
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(button);

// 3. Add event handler
  button.addEventListener ("click", eventListener);
}
