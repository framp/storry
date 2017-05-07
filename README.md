# storry

State Management made simple!

How simple?

```javascript
import storry from 'storry'
import { Map } from 'immutable'

const store = storry(Map({ user: 'Jack' }))
const updateUser = store.action((state, event) => state.set('user', event.user))

store.listen((state) => console.log('NEW STATE', state))

assert(store.state().user, 'Jack')
updateUser({ user: 'Mary' })
assert(store.state().user, 'Mary')
```

 - Want to understand the library more in depth? [Check this explanation!](#step-by-step-explanation)
 - Want to jump to an example with React? [Click here!](#step-by-step-common-preact-pattern)
 - Want to read the code? [It's 8 lines!](src/storry.js)
 - Want to see the full API? [Yup!](#api)
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

When defining our action we can use [ramda](ramdajs.com) or [immutable](https://facebook.github.io/immutable-js/) to simplify our task.

```javascript
import { Map } from 'immutable'
const updateUser = store.action((state, event) => state.set('user', event.user))
```

```javascript
import { set, lensProp } from 'ramda'
const updateUser = store.action((state, event) => 
  set(lensProp('user'), event.user, state)
```

All three implementations behave in the same way.

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

By importing `storry/preact` or `storry/react` you'll get a `Provider` component which can be used to wrap your application.

If you're using node without `import` support you can use `storry/lib/storry` + `storry/lib/storry-preact` or `storry/lib/storry-react`.

All the children of `Provider` will receive the state of the application as `props` everytime it's updated.

```javascript
//index.js
...
import Provider from 'storry/preact'
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
import Provider from 'storry/preact'
import App from './components/app'
import store from './store'
...
render(<Provider store={store}><App /></Provider>, document.body)
```

Our main `App` component will receive the state and will pass a portion of it, to the other components which make our application.

```javascript
//components/app/index.js
import Song from '../song'
export default ({ songs, active, votes }) => 
  <Song track={songs[active]} votes={votes[active]} />
```

```javascript
//components/song/index.js
import { play, vote, next } from './actions'
export default ({ track, votes }) => <div>
  <div>{track}</div>
  <a onClick={play(track)}>Play</a>
  {votes}
  <a onClick={vote(track)}>Vote</a>
  <a onClick={next}>Next</a>
</div>
```

Each component with interactive elements will have a relevant `action` files which contain the logic of our application.

In this case, we know the value we want to pass before the action is triggered, therefore we can create a function which accepts data and return an *action*.

The *action* is going to be invoked with the Click event but the event is going to be ignored.

```javascript
//components/song/actions
import store from '../../store'
export const play = (track) => store.action((state) => 
  Object.assign({}, state, { playing: track }))

export const next = store.action(state) =>
  Object.assign({}, state, { active: (state.active+1) % state.songs.length})

export const vote = (track) => 
  fetch('/api/vote/' + track)
    .then(res => res.json())
    .then(store.action((state, data) => 
      Object.assign({}, state, { votes: data.votes }))
```

The `play(track)` *action* modifies the current state, adding a field `playing` to it.

The `next` *action* modifies the current state, increasing the `active` song index by 1.

`vote(track)` instead makes an asynchronous operation (a XHR request) and set a state dependant on the result of the operation. 

In this case we are assuming the API will return a list of all the votes, that we can use to update our application's state.

Your application will now display data from your store and update them on actions.

## API

```javascript
import storry from 'storry'

const store = storry(initialState = {}, initialListeners = [])
```
- Creates a store.
- It accepts two optional parameters.
- `initialState` will be set as the initial state of your store and can have any shape
- `initialListeners` is a list of functions which are called everytime the state updates

```javascript
store.listen(listener)
```

 - Add a function to the `listeners` array, a list of functions which are called everytime the state updates

```javascript
const action = store.action(transform(state, event))
action(event)
```

 - Returns a function which accept an `event` (which can have any shape) and calls `transform`
 - `transform` is called with `state` and `event`
 - `transform` needs to be a pure function and should return the next `state`

```javascript
import Provider from 'storry/preact'
//or
import Provider from 'storry/react'

render(<Provider store={store}><App /></Provider>)
```

 - `Provider` is a stateful components which listens to your `store` changes and re-render your application accordingly
 - `Provider` will pass the `state` of your `store` to all its children

## package structure

This package contains
  - `import` ready files
    - `es/storry.js`
    - `es/storry-preact.js`
    - `es/storry-react.js`
    - `index.js`
    - `preact.js`
    - `react.js`
  - `require` ready files
    - `lib/storry.js`
    - `lib/storry-preact.js`
    - `lib/storry-react.js`
  - UMD build
    - `umd/storry.js`: exports `starry`
    - `umd/storry-preact.js`: exports `Provider`
    - `umd/storry-react.js`: exports `Provider`
  - Handcrafted readable browser files
     - `browser/storry.js`: exports `storry`
     - `browser/storry-preact.js`: exports `Provider`
     - `browser/storry-react.js`: exports `Provider`
  - Minified version of the browser files
     - `dist/storry.js`: exports `storry`
     - `dist/storry-preact.js`: exports `Provider`
     - `dist/storry-preact.js`: exports `Provider`

Just pick whatever you need for your application and please report if you spot some problems with your setup.

## motivations

The Redux architecture brings to the table a lot of Elm benefits. 

Having a single store and having well defined boundaries to mutate the state of your application is a great way to limit errors.

Unfortunately it carries a lot of action-related boilerplate and it's hard to teach to unexperienced developers.

Storry wants to preserve the benefits while minimizing boilerplate and while keeping the learning curve shallow.

## thanks
- [Elm Architecture](https://guide.elm-lang.org/architecture/)
- [Redux](http://redux.js.org/)
