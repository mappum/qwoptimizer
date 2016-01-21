window.onload = function () {
  qwop.load()

  qwop.onReady = function () {
    console.log('ready')
  }

  qwop.onStart = function () {
    console.log('start')
  }

  qwop.onFrame = function () {}

  qwop.onDeath = function () {
    console.log('death')
  }
}
