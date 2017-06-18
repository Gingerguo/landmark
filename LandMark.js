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
    context.clearRect(0,0,width,height);
    loop();
  }

  function BlackHole() {
    this.x = xCenter;
    this.y = yCenter;
    this.outerRadius = 200;
    this.gradientOuter = context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.outerRadius);
    this.gradientOuter.addColorStop( 0, 'hsla(0, 0%, 50%,' + rand( 0, 0.03 ) + ')' );
    this.gradientOuter.addColorStop( 1, 'hsla(0, 0%, 100%,'+ rand(0.07, 0.1 ) + ')');
  }

  BlackHole.prototype.draw = function() {
    context.save();
    context.translate( xCenter, yCenter );
    context.scale( rand( 0.9, 1.1 ), rand( 0.9, 1.1 ));
    context.translate( -xCenter, -yCenter );

    context.beginPath();
    context.arc( this.x + rand( -5, 5 ), this.y + rand( -5, 5 ), this.outerRadius + rand( -5 , 5 ), 0, TWOPI, false );
    context.fillStyle = this.gradientOuter;
    context.fill();

    context.beginPath();
    context.arc( this.x + rand( -5, 5 ), this.y + rand( -5, 5 ), this.outerRadius + rand( -1, 1 ), 0, TWOPI, false );
    context.lineWidth = rand( 1, 10 );
    context.strokeStyle = 'hsla(0, 0%, 100%,' + rand(0, 0.1) + ')';
    context.stroke();
    context.restore();
  }

  reset();

  function reset() {
    width = window.innerWidth;
    height = window.innerHeight;
    xCenter = width / 2;
    yCenter = height / 2;
    startRadius = Math.sqrt( width*width + height*height) / 2 +50;
    blackHoles.length = 0;
    tick = 0;
    canvas.width = width;
    canvas.height = height;
    blackHoles.push( new BlackHole());
  }

  function loop() {
    console.log(meter.volume);
    if(meter.volume>0.1){
      clear();
      drawBlackHole(meter.volume);
    } else {
      context.clearRect(0,0,width,height);
      //generate();
    }
    requestAnimationFrame( loop );
    tick++;
  }

  function clear() {
    context.globalCompositeOperation = 'source-over';
    if( rand(0, 1) > 0.4 ) {
      context.fillStyle = 'hsla(60, 0, 0, 0.3)';
    } else {
      context.fillStyle = randInt( 0, 1 ) ? 'hsla(180, 100%, 50%, 0.3)':'hsla(300, 100%, 50%, 0.1)';
    }
    context.fillRect( 0, 0, width, height);
    context.globalCompositeOperation = 'lighter';
  }

  function drawBlackHole(x) {
    context.save();
    context.translate( xCenter, yCenter);
    context.scale(rand(0.95,1.05), rand(1,1));
    context.translate(-xCenter, -yCenter);
    var i = blackHoles.length;
    while(i--){
      blackHoles[i].draw();
    }
    context.restore();
  }
}

function rand(min, max) {
  return Math.random()*(max-min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
