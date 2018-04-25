
require("fabric");
const Store = require("../../common/store/index.js");

var states = [];
var currentState = 0;
var restoring = false;
var getState, setState;

export function pushState() {
	if (restoring) {
		return;
	}

	var state = getState();
	if (state === states[currentState]) {
		// nothing has changed
		return;
	}

	// Cap the number of states
	if (currentState > 99) {
		currentState--;
		states.shift();
	}

	if (currentState < states.length - 1) {
		// Forking stack
		var remove = (states.length - 1) - currentState;
		states = states.slice(0, states.length - remove);
	}

	currentState++;
	states.push(state);
}

export function restore(state) {
	restoring = true;
	setState(state);
	restoring = false;

	//canvas.renderAll();  add BTD to prevent blank canvas
}

export function undo() {
	if (currentState > 0) {
		currentState--;
		restore(states[currentState]);
	}
}

export function redo() {
	if (currentState < (states.length - 1)) {
		currentState++;
		restore(states[currentState]);
	}
}

export function StateModule(_getState, _setState) {
	if (!(this instanceof StateModule)) return new StateModule();
	getState = _getState;
	setState = _setState;
	states.push(getState());
}

module.exports = StateModule;