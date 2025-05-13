import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
	//handle login in or not
	return (
		<div>
			<Link to="/users/signup">Sign up</Link>
		</div>
	);
};

export default LandingPage;
