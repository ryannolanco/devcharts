const service = require('./users.service');

const asyncErrorBoundary = require('../db/errors/asyncErrorBoundary');

require('dotenv').config(); // Ensure this is called once in your app (can also go in your server.js)

//in future create table for admin emails and only admin can post to this table.
const adminEmails = process.env.ADMIN_EMAILS
	? process.env.ADMIN_EMAILS.split(',').map((email) => email.trim())
	: [];

const requiredProperties = ['name', 'email', 'password'];

/* ----- HELPER FUNCTIONS ----- */

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
//check if email is valid
function emailIsValid(req, res, next) {
	const { data: { email } = {} } = req.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const trimmedEmail = email.trim();

	if (!emailRegex.test(trimmedEmail)) {
		return next({ status: 400, message: `${email} must be a valid email.` });
	}

	if (typeof email !== 'string') {
		return next({
			status: 400,
			message: 'Email is required and must be a string.',
		});
	}

	next();
}

//check if email is already in use
async function emailDoesNotExist(req, res, next) {
	const { data: { email } = {} } = req.body;

	if (typeof email !== 'string') {
		return next({
			status: 400,
			message: 'Email is required and must be a string.',
		});
	}

	const normalizedEmail = email.trim().toLowerCase();

	try {
		const userWithEmail = await service.getUserByEmail(normalizedEmail);
		if (userWithEmail) {
			return next({
				status: 400,
				message: `User with email ${normalizedEmail} already exists.`,
			});
		}
		next();
	} catch (error) {
		next(error);
	}
}

//check if password is valid
function passwordIsValid(req, res, next) {
	const { data: { password } = {} } = req.body;
	if (typeof password !== 'string') {
		return next({
			status: 400,
			message: 'Password is required and must be a string.',
		});
	}
	//password has correct characters

	const passwordRegex =
		/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]+$/;

	if (!passwordRegex.test(password)) {
		return next({
			status: 400,
			message:
				'Password must include at least one uppercase letter, one number, and one special character. Must not include spaces.',
		});
	}

	if (password.length < 8) {
		return next({
			status: 400,
			message: 'Password must be at least 8 characters long.',
		});
	}

	next();
}

//check if name is valid
function nameIsValid(req, res, next) {
	const { data: { name } = {} } = req.body;

	const formattedName = name
		.toLowerCase()
		.split(' ')
		.filter(Boolean) // removes extra spaces
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	// Check if first and last names are between 1 and 20 characters
	if (formattedName.length < 1 || formattedName.length > 40) {
		return next({
			status: 400,
			message: 'First name must be between 1 and 40 characters.',
		});
	}

	// Ensure the names only contain alphabetic characters and spaces
	const nameRegex = /^[A-Za-z\s]+$/;
	if (!nameRegex.test(formattedName)) {
		return next({
			status: 400,
			message: 'Name can only contain letters and spaces.',
		});
	}

	// Store normalized names
	req.body.data.name = formattedName;

	next();
}

//check if is_admin is valid, should only be my email
function adminIsValid(adminEmails) {
	return function (req, res, next) {
		const { data: { is_admin, email } = {} } = req.body;

		// Ensure email is provided and is a valid string
		if (typeof email !== 'string') {
			return next({
				status: 400,
				message: 'Email is required and must be a valid string.',
			});
		}

		// Ensure email follows a valid format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return next({
				status: 400,
				message: 'Email must be a valid format.',
			});
		}

		// Ensure is_admin is a boolean
		if (is_admin && typeof is_admin !== 'boolean') {
			return next({
				status: 400,
				message: 'is_admin must be a boolean value.',
			});
		}

		// If the user is an admin, check if the email is in the valid admin list
		if (is_admin === true) {
			if (!adminEmails.includes(email)) {
				return next({
					status: 400,
					message: 'Not a valid admin email.',
				});
			}
		}

		// If the user is not an admin, or email is valid, proceed
		next();
	};
}

/* ---- CRUD FUNCTIONS ---- */
async function createUser(req, res) {
	const { name, email, password, isAdmin } = req.body.data;
	const userData = {
		name,
		email,
		password,
		is_admin: isAdmin,
	};
	const data = await service.create(userData);
	res.status(200).json({ data });
}

module.exports = {
	create: [
		bodyDataHasFields(requiredProperties),
		asyncErrorBoundary(emailDoesNotExist),
		emailIsValid,
		nameIsValid,
		adminIsValid(adminEmails),
		passwordIsValid,
		asyncErrorBoundary(createUser),
	],
};
