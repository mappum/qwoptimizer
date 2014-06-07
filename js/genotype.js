var LENGTH = 20;
var MUTATION_RATE = 0.085;

function Genotype(length) {
  if(typeof length === 'number') {
    this.thighs = new Array(length || LENGTH);
    this.calves = new Array(length || LENGTH);
  } else {
    console.log(length)
    this.thighs = length.thighs;
    this.calves = length.calves;
  }
}

Genotype.prototype.randomize = function() {
  this.addRandom(this.thighs, 'qw_');
  this.addRandom(this.calves, 'op_');
};

Genotype.prototype.addRandom = function(a, set) {
  for(var i = 0; i < a.length; i++) {
    a[i] = set[Math.random()*set.length|0];
  }
};

Genotype.prototype.breed = function(mate) {
  var g = new Genotype(this.thighs.length);

  for(var i = 0; i < this.thighs.length; i++) {
    if(Math.random() > 0.5) g.thighs[i] = mate.thighs[i];
    else g.thighs[i] = this.thighs[i];
  }

  for(var i = 0; i < this.calves.length; i++) {
    if(Math.random() > 0.5) g.calves[i] = mate.calves[i];
    else g.calves[i] = this.calves[i];
  }

  return g;
};

Genotype.prototype.getKey = function(frame, thighs) {
  frame = frame % LENGTH;
  var a = thighs ? this.thighs : this.calves;
  var i = Math.floor(frame / PERIOD);
  return a[i].key;
};
