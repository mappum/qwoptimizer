var bodyParts = [
  'cluarm',
  'clfarm',
  'clcalf',
  'clfoot',
  'clthigh',
  'cbody',
  'cruarm',
  'crcalf',
  'crthigh',
  'crfarm',
  'chead',
  'crfoot'
]

window.onload = function () {
  qwop.load()
  var agent = initAgent()

  qwop.onReady = function () {
    console.log('ready')
  }

  qwop.onStart = function () {
    console.log('start')
  }

  qwop.onFrame = function (e) {
    var distance = qwop.getDistance()
    var state = getState(e, distance)

    var actionIndex = agent.act(state)
    actions[actionIndex]()
    agent.learn(qwop.getDistance()) // meters traveled. higher is better.
  }

  qwop.onDeath = function () {
    console.log('death')
    qwop.reset()
  }

}

var keyStates = {
  q: false,
  w: false,
  o: false,
  p: false
}
function press (char) {
  keyStates[char] = !keyStates[char]
  qwop.key(char, keyStates[char])
}

var actions = [
  // press, // press nothing
  press.bind(null, 'q'),
  press.bind(null, 'w'),
  press.bind(null, 'o'),
  press.bind(null, 'p')
]

function getState (event, distance) {
  var state = [distance]
  _.map(bodyParts, function (bodyPart) {
    state.push(event[bodyPart].angularVelocity)
    state.push(event[bodyPart].velocity.x)
    state.push(event[bodyPart].velocity.y)
    state.push(event[bodyPart].rotation)
  })
  return state
}

function initAgent () {
  var env = {}
  env.getNumStates = function () { return 49}
  env.getMaxNumActions = function () { return actions.length }

  var spec = { alpha: 0.1, gamma: 0.7 }
  agent = new RL.DQNAgent(env, spec)

  return agent
}
