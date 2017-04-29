var starry = function(state, listeners){
	if (!state) state = {}
	if (!listeners) listeners = {}
	return {
		state,
		run: function(reduce) {
			return function(event) {
				return Promise.resolve(reduce(state, event))
					.then(function(result) { return state = result })
					.then(listeners.change)
					.catch(listeners.error)
			}
		},
		on: function(type, callback) {
			return listeners[type] = callback
		}
	}
}