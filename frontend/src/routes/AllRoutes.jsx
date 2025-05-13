import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../landing/LandingPage';
import NewUserSignUp from '../user/NewUserSignUp';

const AllRoutes = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="users/signup" element={<NewUserSignUp />} />
			</Routes>
		</div>
	);
};

export default AllRoutes;
