export default (state = {}, listeners = []) => ({
	state: () => state,
	run: reduce => event => {
	  state = reduce(state, event)
    listeners.forEach(listener => listener(state))
  },
	listen: callback => listeners.push(callback)
})