import ReactDOM from 'react-dom';
import starry from 'starry'
import Provider from 'starry/react'

const store = starry({ a: 42 })

const increaseA = ({ a }) => ({ a: a+1 })
const App = ({ a }) => <div>{a}
  <a onClick={store.run(increaseA)}>+</a>
</div>

setTimeout(() => store.run(() => ({a: 54}))(), 3000)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
	document.getElementById('container')
)