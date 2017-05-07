var storry = function (state, listeners) {
  if (!state) { state = {} }
  if (!listeners) { listeners = [] }
  return ({
    state: function () { return state },
    action: function (reduce) {
      return function (event) {
        state = reduce(state, event)
        listeners.forEach(function (listener) { return listener(state) })
      }
    },
    listen: function (callback) { return listeners.push(callback) }
  })
}