import {hot} from 'react-hot-loader';
import React from 'react';
import {Provider} from 'react-redux';
import {Router, match} from 'react-router';
import routes from './routes';
import FetchData from './components/FetchData';
import {flattenComponents} from './utils';

export function preloadComponents(history, store) {
	return new Promise((resolve, reject) => {
		match({routes: routes(store), history}, (error, redirectLocation, renderProps) => {
			if (error) {
				reject(error);
			} else if (redirectLocation) {
				window.location.href = redirectLocation;
			} else if (!renderProps) {
				reject('renderProps not defined!');
			} else {
				resolve(flattenComponents(renderProps.components));
			}
		});
	});
}

function App({store, history}) {
	return (
		<Provider store={store} key='provider'>
			<Router
				history={history}
				routes={routes(store)}
				render={props => <FetchData lkey={props.router.location.key} {...props}/>}/>
		</Provider>
	);
}

export default hot(module)(App);

if (module.hot) {
	module.hot.accept('./routes', () => {
		require('./routes').default;
	});
}