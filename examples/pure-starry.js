const assert = require('assert')
const starry = require('..')

const store = starry({ users: [] })

const addUser = store.action((state, data) =>
  Object.assign({}, state, { users: state.users.concat(data) }))

addUser('Jack')
addUser('Amelie')
assert.deepEqual(store.state(), { users: [ 'Jack', 'Amelie' ] })
