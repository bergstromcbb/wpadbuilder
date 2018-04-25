const defaultState = {
	canvas: null,
	activeObject: {},
	hoverObject: {}
};

export default function (state = defaultState, action) {
	switch (action.type) {
	case "CANVAS_UPDATED":
		return {
			...state,
			...action.payload,
		};
	case "OBJECT_UPDATED":
		//return Object.assign({}, state, action.payload );
		return {
			...state,
			...action.payload,
		};
	case "OBJECT_HOVER":
		return {
			...state,
			...action.payload,
		};
	default :
		return state;
	}
}