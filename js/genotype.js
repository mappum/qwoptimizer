var LENGTH = 20;

function Genotype(length) {
  if(typeof length === 'number') {
    this.thighs = new Array(length || LENGTH);
    this.calves = new Array(length || LENGTH);
  } else {
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

Genotype.prototype.toString = function() {
  return JSON.stringify(this);
};

Genotype.prototype.breed = function(mate, mutation) {
  var g = new Genotype(this.thighs.length);

  for(var i = 0; i < this.thighs.length; i++) {
    if(Math.random() < mutation) g.thighs[i] = 'qw_'[Math.random()*3|0];
    else if(Math.random() > 0.5) g.thighs[i] = mate.thighs[i];
    else g.thighs[i] = this.thighs[i];
  }

  for(var i = 0; i < this.calves.length; i++) {
    if(Math.random() < mutation) g.calves[i] = 'op_'[Math.random()*3|0];
    else if(Math.random() > 0.5) g.calves[i] = mate.calves[i];
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
