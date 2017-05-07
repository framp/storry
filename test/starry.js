import test from 'tape'
import starry from '../src/starry'

test('Starry loads a default state', (assert) => {
  assert.plan(1)
  const store = starry({ answer: 42 })
  assert.deepEqual(store.state(), { answer: 42 })
})

test('Starry can run an action', (assert) => {
  assert.plan(2)
  const store = starry({ answer: 42 })

  const updateAnswer = (answer) =>
    store.action((state, event) =>
      Object.assign({}, state, { answer }))
  assert.deepEqual(store.state(), { answer: 42 })
  updateAnswer(43)()
  assert.deepEqual(store.state(), { answer: 43 })
})

test('Starry can run an action using event data', (assert) => {
  assert.plan(2)
  const store = starry({ answer: 42 })

  const updateAnswer = store.action((state, event) =>
    Object.assign({}, state, { answer: event }))
  assert.deepEqual(store.state(), { answer: 42 })
  updateAnswer(43)
  assert.deepEqual(store.state(), { answer: 43 })
})

test('Starry call its listeners when state changes', (assert) => {
  assert.plan(2)
  const store = starry({ answer: 42 })
  store.listen((state) => {
    assert.deepEqual(store.state(), { answer: 43 })
  })
  const updateAnswer = store.action((state, event) =>
    Object.assign({}, state, { answer: event }))
  assert.deepEqual(store.state(), { answer: 42 })
  setTimeout(() => updateAnswer(43), 10)
})
