var TIMEOUT = 300;
var PERIOD = 5;

var killing = false;
var frame, endFrame;
var lastDistance = 0, lastMovement = 0;
var genotype;
var ready = false;

var id = +window.location.hash.substr(1);
console.log = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('[worker '+id+']');
  parent.console.log.apply(parent.console, args);
};

function postMessage(message) {
  message.from = id;
  parent.postMessage(JSON.stringify(message), '*');
}

qwop.onReady = function() {
  if(!ready) {
    ready = true;
    postMessage({ ready: true });
  }
}

qwop.onStart = function() {
  frame = 0;
  lastDistance = 0;
  lastMovement = 0;
};

qwop.onFrame = function() {
  if(!genotype) return;

  if(!killing) {
    if(frame % PERIOD === 0) {
      var i = Math.floor(frame / PERIOD) % genotype.thighs.length;

      var keyT = genotype.thighs[i];
      qwop.key('q', keyT !== 'q');
      qwop.key('w', keyT !== 'w');

      var keyC = genotype.calves[i];
      qwop.key('o', keyC !== 'o');
      qwop.key('p', keyC !== 'p');
    }

    var distance = qwop.getDistance();
    if(distance > lastDistance) {
      lastMovement = frame;
      lastDistance = distance;
    }

  } else if(frame % 20 === 0) {
    var k = ['q','w','o','p'][Math.random()*4 | 0];
    qwop.key(k, Math.random() < 0.5);
  }

  if(!killing && frame - lastMovement >= TIMEOUT) {
    console.log('Stuck, killing');
    killing = true;
    endFrame = frame;
  }

  frame++;
};

qwop.onDeath = function() {
  if(!genotype) return;

  if(killing) killing = false;
  else endFrame = frame;

  postMessage({
    speed: lastDistance / endFrame,
    distance: lastDistance,
    g: genotype
  });
  genotype = null;
};

parent.addEventListener('message', function(e) {
  var data = JSON.parse(e.data);
  if(data.to !== id) return;

  genotype = new Genotype(data.g);
  console.log('testing sequence: ' + genotype);
  qwop.reset();
}, false);

window.onload = function() {
  runViewer('../athletics.swf');
};
