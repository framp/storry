const starry = (state = {}, listeners = []) => ({
  state,
  run: reduce => event => 
    Promise.resolve(reduce(state, event)).then(result => {
      listeners.map(listener => listener(result)) 
      state = result
    }),
  addListener: callback => listeners.push(callback)
})

export default starry