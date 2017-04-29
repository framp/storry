const assert = require('assert')
const starry = require('..')

const store = starry({ users: [] })

const addUser = (state, data) => 
  Object.assign({}, state, { users: state.users.concat(data) })

Promise.all([
  store.run(addUser)('Jack'),
  store.run(addUser)('Amelie')
]).then(() => assert.equal(store.state(), { users: [ 'Jack', 'Amelie' ] }))