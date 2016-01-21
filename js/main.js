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

  var spec = {}
  spec.update = 'qlearn'
  spec.gamma = 0.9
  spec.epsilon = 0.2 // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.1 // this'll be lowered soon
  spec.experience_add_every = 5 // number of time steps before we add another experience to replay memory
  spec.experience_size = 10 // intentionally low right now, will increase later
  spec.learning_steps_per_iteration = 5
  spec.tderror_clamp = 1.0 // for robustness
  spec.num_hidden_units = 100 // number of neurons in hidden layer

  agent = new RL.DQNAgent(env, spec)

  return agent
}
