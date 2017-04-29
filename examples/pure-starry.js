const assert = require('assert')
const starry = require('..')

const store = starry({ users: [] })

const addUser = (state, data) => 
  Object.assign({}, state, { users: state.users.concat(data) })

store.run(addUser)('Jack')
store.run(addUser)('Amelie')
assert.deepEqual(store.state(), { users: [ 'Jack', 'Amelie' ] })