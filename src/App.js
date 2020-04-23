import React from 'react';
import './App.css';
import Main from './components/Main';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Route exact path='/' component={Main} />
			</Router>
		</Provider>
	);
}

export default App;
