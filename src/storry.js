export default (state = {}, listeners = []) => ({
  state: () => state,
  action: transform => event => {
    state = transform(state, event)
    listeners.forEach(listener => listener(state))
  },
  listen: callback => listeners.push(callback)
})
