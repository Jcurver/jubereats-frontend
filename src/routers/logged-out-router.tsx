import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NotFound } from '../pages/404';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
	return (
		<Router>
			<Switch>
				<Route path="/create-account" component={CreateAccount} />
				<Route exact path="/" component={Login} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
};
