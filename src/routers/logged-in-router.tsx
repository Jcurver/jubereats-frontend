import React from 'react';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';

const ClientRoutes = [
	<Route key={1} path="/" exact component={Restaurants} />,
	<Route key={2} path="/confirm" exact component={ConfirmEmail} />,
];

export const LoggedInRouter = () => {
	const { data, loading, error } = useMe();
	console.log('error:: ', error);
	console.log('data:: ', data);
	if (!data || loading || error) {
		return (
			<div className="h-screen flex justify-center items-center">
				<span className="font-medium text-xl traking-wide">Loading...</span>
			</div>
		);
	}
	return (
		<Router>
			<Header />
			<Switch>
				{/* <Redirect from="/potato" to="/" /> */}
				{/* <Route path="*" /> */}
				{/* <Route path="*" component={NotFound} /> */}
				{data.me.role === 'Client' && ClientRoutes}
				{/* <Redirect to="/" /> */}
				<Route component={NotFound}></Route>
			</Switch>
		</Router>
	);
};
