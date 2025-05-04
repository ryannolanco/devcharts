const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

require('dotenv').config(); // Ensure this is called once in your app (can also go in your server.js)

const adminEmails = process.env.ADMIN_EMAILS
	? process.env.ADMIN_EMAILS.split(',').map((email) => email.trim())
	: [];

const requiredProperties = ['first_name', ' last_name', 'email', 'password'];

//create middleware for post request

//check if properties are present
function bodyDataHasFields(requiredProperties) {
	return function (req, res, next) {
		const { data = {} } = req.body;
		for (const property of requiredProperties) {
			if (!data[property]) {
				next({ status: 400, message: `Must include ${property}` });
			}
		}
		next();
	};
}
//check if email is valid and not assigned
//check if password is valid
//check if name is valid
//check if email is valid
//check if is_admin is valid, should only be my email
