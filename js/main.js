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

  var didlog = false
  qwop.onFrame = function (e) {
    var distance = qwop.getDistance()
    var state = getState(e, distance)

    if (!didlog)console.log(state)
    didlog = true

    var actionIndex = agent.act(state)
    actions[actionIndex]()
    agent.learn(qwop.getDistance()) // meters traveled. higher is better.
  }

  qwop.onDeath = function () {
    console.log('death')
    qwop.reset()
  }

}

function press (char) {
  qwop.key('q', false)
  qwop.key('w', false)
  qwop.key('o', false)
  qwop.key('p', false)
  if (char) qwop.key(char, true)
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
