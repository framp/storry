"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var _state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	return {
		state: function state() {
			return _state;
		},
		run: function run(reduce) {
			return function (event) {
				_state = reduce(_state, event);
				listeners.forEach(function (listener) {
					return listener(_state);
				});
			};
		},
		listen: function listen(callback) {
			return listeners.push(callback);
		}
	};
};