window.addEventListener("load", windowLoadHandler, false);
function windowLoadHandler() {
  canvasStart();
}

function canvasStart() {
//VARIABLE FOR CANVAS
  var canvas = document.getElementById('displayCanvas');
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
//VARIABLES FOR ANIMATION
  var xCenter,
  yCenter,
  startRadius,
  tick,
  blackHoles=[],
  PI = Math.PI,
  TWOPI = 2*PI;

//VARIABLES FOR AUDIO
  var audioContext;
  var meter;
  var rafID;

//WEBAUDIO - grab the audio context - get audio input
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();

try {
  navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
  navigator.getUserMedia(
    {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, gotStream, didntGetStream);
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }

  function didntGetStream() {
    alert('Stream generation failed.');
  }

  var mediaStreamSource;
  function gotStream(stream) {
    //create an AudioNode from the stream
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    //create a new volume meter and connect it
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    // kick off the visual updating
    animateBlackHole();
  }

  function animateBlackHole(evt) {
    //context.clearRect(0,0,width,height);
    loop();
  }

  function loop() {
    console.log(meter.volume);
    if(meter.volume>0.1) {
      console.log('scream');
    } else {
      console.log('ahh');
    }
    requestAnimationFrame( loop );
  }
}

function rand(min, max) {
  return Math.random()*(max-min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
