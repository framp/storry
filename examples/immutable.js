const assert = require('assert')
const { Map } = require('immutable')
const storry = require('..')

const store = storry(Map({ users: [] }))

const addUser = store.action((state, data) =>
  state.set('users', state.get('users').concat(data)))

addUser('Jack')
addUser('Amelie')
assert.deepEqual(store.state().toObject(), { users: [ 'Jack', 'Amelie' ] })
