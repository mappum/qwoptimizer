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
    var state = getState(e)
    var action = actions[agent.act(state)]
    agent.learn(qwop.getDistance()) // meters traveled. higher is better.
  }

  qwop.onDeath = function () {
    console.log('death')
  }

}

function press (char) {}
  qwop.key('q', false)
  qwop.key('w', false)
  qwop.key('o', false)
  qwop.key('p', false)
  if(char) qwop.key(char, true)
}

var actions = [
  press, // press nothing
  press.bind(null, 'q'),
  press.bind(null, 'w'),
  press.bind(null, 'o'),
  press.bind(null, 'p')
]

function getState () {
  return []
}

function initAgent () {
  var env = {}
  env.getNumStates = function () { return }
  env.getMaxNumActions = function () { return actions.length }

  var spec = { alpha: 0.01 }
  agent = new RL.DQNAgent(env, spec)

  return agent
}
