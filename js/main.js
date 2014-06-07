var GENERATION_SIZE = 50;
var BEST_SIZE = 4;
var TIMEOUT = 300;
var SPEED_WEIGHT = 350;
var WORKERS = 2;

var generation = []; 
var best = [];
var nGen = 0;
var iframes = [];

function populate() {
  for(var i = 0; i < GENERATION_SIZE; i++) {
    if(best.length > 1) {
      var p1, p2;
      p1 = best[Math.random() * best.length | 0];
      do {
        p2 = best[Math.random() * best.length | 0];
      } while(p1 === p2)
      generation.push(p1.genotype.breed(p2.genotype));
    } else {
      var g = new Genotype;
      g.randomize();
      generation.push(g);
    }
  }
}

function updateBest() {
  best.sort(function(a, b) {
    return a.score > b.score ? 1 : -1;
  });
  best = best.slice(Math.max(0, best.length - BEST_SIZE - 1));
}

window.addEventListener('message', function(e) {
  var data = JSON.parse(e.data);
  if(typeof data.from === 'undefined') return;

  if(!data.ready) {
    var score = data.speed * SPEED_WEIGHT + data.distance;
    if(best.length < BEST_SIZE || score > best[0].score) {
      console.log('Adding to set of best sequences');
      best.push({ genotype: new Genotype(data.g), score: score });
      updateBest();
    }
  }

  if(generation.length === 0) {
    console.log('Starting generation ' + ++nGen);
    console.log(best);
    populate();
  }
  var g = generation.shift();

  window.postMessage(JSON.stringify({
    g: g.toString(),
    to: data.from
  }), '*');
}, false);

window.onload = function() {
  var container = document.getElementById('workers');
  for(var i = 0; i < WORKERS; i++) {
      var iframe = document.createElement('iframe');
      iframe.src = 'worker.html#' + i;
      container.appendChild(iframe);
      iframes[i] = iframe.contentWindow;
  }
};
