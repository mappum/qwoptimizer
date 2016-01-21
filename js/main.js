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
  var frameCount = 0;
  qwop.load()
  var agent = initAgent()
  window.loadNetwork = function(){
    // clobbers existing agent 
    agent.fromJSON(JSON.parse(localStorage.getItem('net')))
    console.log('loaded checkpointed neural net')
  }
  qwop.onReady = function () {
  }

  qwop.onStart = function () {
  }

  qwop.onFrame = function (e) {
    frameCount++
    var distance = qwop.getDistance()
    var state = getState(e, distance)
    var actionIndex = agent.act(state)
    actions[actionIndex]()
    agent.learn(qwop.getDistance()) // meters traveled. higher is better.
    if(frameCount % 100 === 0){
      var net = JSON.stringify(agent.toJSON())
      console.log(state)
      localStorage.setItem('net', net)
      console.log(actionIndex)
    }
  }

  qwop.onDeath = function () {
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

function normalize (min, max, value) {
  return (Math.max(value, min) - min) / (max - min)
}

function getState (event, distance) {
  var state = [distance,
    qwop.keysDown['q'] ? 1 : 0,
    qwop.keysDown['w'] ? 1 : 0,
    qwop.keysDown['o'] ? 1 : 0,
    qwop.keysDown['p'] ? 1 : 0
  ]
  _.map(bodyParts, function (bodyPart) {
    state.push(normalize(-20, 20, event[bodyPart].angularVelocity))
    state.push(normalize(-20, 20, event[bodyPart].velocity.x))
    state.push(normalize(-20, 20, event[bodyPart].velocity.y))
    state.push(normalize(-180, 180, event[bodyPart].rotation))
  })
  return state
}

function initAgent () {
  var env = {}
  env.getNumStates = function () { return 53}
  env.getMaxNumActions = function () { return actions.length }

  var spec = {}
  spec.update = 'qlearn'
  spec.gamma = 0.9
  spec.epsilon = 0.02
  spec.alpha = 0.1
  spec.experience_add_every = 5 
  spec.experience_size = 1 // intentionally low right now, will increase later
  spec.learning_steps_per_iteration = 5
  spec.tderror_clamp = 1.0 
  spec.num_hidden_units = 100

  agent = new RL.DQNAgent(env, spec)

  return agent
}
