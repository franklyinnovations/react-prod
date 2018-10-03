import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';

const middlewares = [thunk];
let reducer;

export function prependMiddlewares(..._middlewares) {
	middlewares.unshift(..._middlewares);
}

export function setupReducers(reducers) {
	reducer = combineReducers({
		...reducers,
		routing: routerReducer,
	});
}

export function createReduxStore(initialState) {
	const enhancer =
		(typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? 
			window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(...middlewares)) :
			applyMiddleware(...middlewares);
	return createStore(reducer, initialState, enhancer);
}