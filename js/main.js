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

var actions = [
  _.noop,
  qwop.key.bind(null, 'q', true),
  qwop.key.bind(null, 'w', true),
  qwop.key.bind(null, 'o', true),
  qwop.key.bind(null, 'p', true),
  qwop.key.bind(null, 'q', false),
  qwop.key.bind(null, 'w', false),
  qwop.key.bind(null, 'o', false),
  qwop.key.bind(null, 'p', false)
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
