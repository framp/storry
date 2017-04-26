//A preliminary version of starry with labels, listeners and a list of states

const assert = require('assert')

const state = (stateList = [], listeners = {}, globalListeners = []) => {
  const get = () => stateList[0]
  const run = (transform, label) => data =>
    Promise.resolve(transform(stateList[0], data))
      .then(state =>
        stateList.unshift(state) &&
        listeners[label] &&
        Promise.all(listeners[label]
          .map(listener => run.apply(null, listener)())))
      .then(() => globalListeners.map(listener => listener(stateList[0])))
  const addListener = (event, transform, label) => 
    listeners[event] = (listeners[event] || []).concat([[transform, label]])
  const addGlobalListener = (callback) => 
    globalListeners.push(callback)
  return { 
    stateList,
    listeners,
    globalListeners,
    get,
    run,
    addListener,
    addGlobalListener
  }
}

const myAppState = state()
myAppState.addListener('authenticate', (state) => 
  Promise.resolve(Object.assign({}, state, { projects: ['topo', 'gigio'] })), 'get projects')
myAppState.addListener('get projects', (state) => 
  Promise.resolve(Object.assign({}, state, { tracking: 'passed' })), 'post tracking')
myAppState.addGlobalListener(console.log)
assert.deepEqual(Object.keys(myAppState.listeners), ['authenticate', 'get projects'])
const init = () => ({})
myAppState.run(init, 'init')().then(() => {
  assert.deepEqual(myAppState.stateList, [{}])
  var fn = ({ counter }) => ({ counter: (counter || 0)+1 })
  myAppState.run(fn, 'increase counter')().then(() => {
    assert.deepEqual(myAppState.stateList, [{ counter: 1 },{}])
    var fn = ({ counter }, data) => ({ counter: counter+data })
    myAppState.run(fn, 'increase counter by n')(2).then(() => {
      assert.deepEqual(myAppState.stateList, [{ counter: 3},{ counter: 1 },{}])
      var fn = (state, data) => Promise.resolve(Object.assign({}, state, { status: 'success', token: 'abba'}))
      myAppState.run(fn, 'authenticate')().then(() => {
        assert.deepEqual(myAppState.stateList, [ { 
          counter: 3,
          status: 'success',
          token: 'abba',
          projects: [ 'topo', 'gigio' ],
          tracking: 'passed' },
        { counter: 3,
          status: 'success',
          token: 'abba',
          projects: [ 'topo', 'gigio' ] },
        { counter: 3, status: 'success', token: 'abba' },
        { counter: 3 },
        { counter: 1 },
        {} ])
      })
    })
  })
})

/*
class State extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.state.get()
    props.state.addGlobalListener((state) => this.setState(state)) 
   }
  render() {
    const children = React.Children.map(this.props.children, (child) => 
      React.cloneElement(child, { state: this.state }))
    return <div>{children}</div>
  }
}

const myAppState = state([{ a: 42 }])
const App = ({ state }) => <div>{state.a}</div>

setTimeout(() => myAppState.run(() => ({a: 54}))(), 3000)

ReactDOM.render(
  <State state={myAppState}>
    <App />
  </State>,
	document.getElementById('container')
)
*/