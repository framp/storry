const assert = require('assert')
const storry = require('..')

const store = storry({ users: [] })

const addUser = store.action((state, data) =>
  Object.assign({}, state, { users: state.users.concat(data) }))

addUser('Jack')
addUser('Amelie')
assert.deepEqual(store.state(), { users: [ 'Jack', 'Amelie' ] })
