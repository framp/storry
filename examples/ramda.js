const assert = require('assert')
const { over, lensProp, append } = require('ramda')
const storry = require('..')

const store = storry({ users: [] })

const addUser = store.action((state, data) =>
  over(lensProp('users'), append(data), state))

addUser('Jack')
addUser('Amelie')
assert.deepEqual(store.state(), { users: [ 'Jack', 'Amelie' ] })
