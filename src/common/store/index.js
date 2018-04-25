import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise";
import logger from "redux-logger";
import rootReducer from "../reducers/index.js";

export default createStore(
	rootReducer,
	compose(
		applyMiddleware(promise, thunk, logger),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);