import ReactDOM from 'react-dom';
import starry from '..'
import Provider from '../react'

const store = starry({ a: 42 })

const increaseA = ({ a }) => ({ a: a+1 })
const App = ({ a }) => <div>{a}
  <a onClick={store.run(increaseA)}>+</a>
</div>

setTimeout(() => run(() => ({a: 54}))(), 3000)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
	document.getElementById('container')
)