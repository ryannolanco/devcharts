import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../landing/LandingPage';
import NewUserSignUp from '../user/NewUserSignUp';

const Routes = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="signup" element={<NewUserSignUp />} />
			</Routes>
		</div>
	);
};

export default Routes;
