// the interface to the QWOP game via the Shumway runtime

window.qwop = {};

(function(qwop) {
  var stage;
  var initialized = false, loaded = false;
  var wasDead = false;

  qwop.isAlive = function() {
    // a little hacky, searches through stage for dialog box
    for(var i = 0; i < stage._children.length; i++) {
      var child = stage._children[i];
      if(child.x === 2600 || child.x === 2520)
        return false;
    }
    return true;
  }

  var distanceObj;
  var getDistance = qwop.getDistance = function() {
    if(!distanceObj) distanceObj = stage.getChildByName('instance6');
    var text = distanceObj.text;
    return +text.split(' ')[0];
  }

  qwop.onReady = function() {}

  qwop.onStart = function() {}

  qwop.onDeath = function() {}

  qwop.onLoad = function() {
    loaded = true;

    window.removeEventListener('keypress', ShumwayKeyboardListener);
    window.removeEventListener('keyup', ShumwayKeyboardListener);
    window.removeEventListener('keydown', ShumwayKeyboardListener);

    qwop.reset();
  };

  qwop.onFrame = function() {}

  qwop.frameHandler = function() {
    if(!qwop.isAlive()) {
      if(initialized && !wasDead) {
        wasDead = true;
        qwop.onDeath();
      }
    } else if(!initialized) {
      initialized = true;
    } else {
      qwop.onFrame();
    }
  };

  qwop.onStageInitialized = function(_stage) {
    stage = _stage;
    qwop.onReady();
  };

  qwop.key = function(char, up) {
    var code = (char || '_').toUpperCase().charCodeAt(0);
    stage._dispatchEvent(new flash.events.KeyboardEvent(
      up ? 'keyUp' : 'keyDown',
      true,
      false,
      code,
      code
    ));
  }

  qwop.reset = function() {
    if(!initialized) {
      stage._mouseTarget._dispatchEvent('click');
    } else {
      qwop.key(' ');
    }

    if(loaded) {
      wasDead = false;
      qwop.onStart();
    }
  }
})(window.qwop);
