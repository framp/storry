# storry

State Management made simple!

How simple?

```javascript
import storry from 'storry'

const store = storry({ user: 'Jack' })
const updateUser = store.action((state, event) => 
  Object.assign({}, state, { user: event.user}))

store.listen((state) => console.log('NEW STATE', state))

assert(store.state().user, 'Jack')
updateUser({ user: 'Mary' })
assert(store.state().user, 'Mary')
```

 - Want to understand the library more in depth? [Check this explanation!](#step-by-step-explanation)
 - Want to jump to an example with React? [Click here!](#step-by-step-common-preact-pattern)
 - Want to read the code? [It's 8 lines!](src/storry.js)
 - Want to see even more examples? [Here!](examples)

## step by step explanation

Storry provides a data store which contains your state.

```javascript
const store = storry({ user: 'Jack' })
```

The state can be accessed at any moment.

```javascript
store.state() // { user: 'Jack' }
```

The state can be updated with a special function *action*.

To create an *action* we need to provide a pure function `(state, event) => newState`.

This function will be used to generate the new state, using the old state and the event passed to our *action*.

Let's define our *action*:

```javascript
const updateUser = store.action((state, event) => 
  Object.assign({}, state, { user: event.user}))
```

It's time to use our *action*.

```javascript
updateUser({ user: 'Mary'})
store.state() // { user: 'Mary' }
```

Every time the state gets updated all the store listeners gets fired.

If you're interested in reacting to these events you can subscribe to the store.

```javascript
store.listen((state) => console.log("I just received a new state", state))
```

## (p)react bindings

Storry ships with bindings for [React](https://facebook.github.io/react/) and [Preact](https://preactjs.com/).

By importing `storry/storry-preact` or `storry/storry-react` you'll get a `Provider` component which can be used to wrap your application.

All the children of `Provider` will receive the state of the application as `props` everytime it's updated.

```javascript
//index.js
...
import Provider from 'storry/storry-preact'
import App from './components/app'
import store from './store'
...
render(<Provider store={store}><App /></Provider>, document.body)
```

## step by step common (p)react pattern 

We're going to use one store for our application.

Let's define it in its own file, so that we can access it from any other file, and let's initialize it with some initial data.

This step could be, for example, receiving data from an isomorphic/universal application.

```javascript
//store.js
import storry from 'storry'
export default storry({ 
  songs: ['My Way', 'Fly Me to the Moon', 'New York, New York'], 
  votes: [0, 0, 0],
  active: 1 
})
```

Let's import our application main component `App` and Storry's `Provider` component.

We're going to render `App` wrapped in `Provider`, so that `App` will receive the state of our application.

```javascript
//index.js
...
import Provider from 'storry/storry-preact'
import App from './components/app'
import store from './store'
...
render(<Provider store={store}><App /></Provider>, document.body)
```

Our main `App` component will receive the state and will forward it, entirely or partially (as appropriate), to the other components which make our application.

```javascript
//components/app/index.js
import Song from '../song'
export default ({ songs, active, votes }) => <div>
  <Song track={songs[active]} votes={votes[active]} />
</div>
```

```javascript
//components/song/index.js
import { play, vote } from './actions'
export default ({ track, votes }) => <div>
  <div>{track}</div>
  <a onClick={play(track)}>Play</a>
  {votes}
  <a onClick={vote(track)}>Vote</a>
</div>
```

Each component with interactive elements will have a relevant `action` files which contain the logic of our application.

```javascript
//components/song/actions
import store from '../../store'
export const play = (track) => store.action((state) => 
  Object.assign({}, state, { playing: track }))

export const vote = (track) => 
  fetch('/api/vote/' + track)
    .then(res => res.json())
    .then(store.action((state, event) => 
      Object.assign({}, state, { votes: event.votes }))
```

The `play(track)` *action* modifies the current state, adding a field `playing` to it.

`vote(track)` instead makes an asynchronous operation (a XHR request) and set a state dependant on the response received.

## motivations

The Redux architecture brings to the table a lot of elm benefits. 

Having a single store and having well defined boundaries to mutate the state of your application is a great way to limit errors.

Unfortunately it carries a lot of action-related boilerplate and it's hard to teach to unexperienced developers.

Storry wants to preserve the benefits while minimizing boilerplate and while keeping the learning curve shallow.
