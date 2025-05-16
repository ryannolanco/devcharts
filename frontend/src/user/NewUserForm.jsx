import React, { useState } from 'react';
import { createUser } from '../utils/api.js';

const initialFormData = {
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	is_admin: false,
};

const NewUserForm = () => {
	const [formData, setFormData] = useState({ ...initialFormData });
	const [errors, setErrors] = useState(null);

	async function handleSubmit(event) {
		event.preventDefault();
		const controller = new AbortController();
		const signal = controller.signal;

		try {
			console.log('sending request');

			const response = await createUser(formData, signal);
			console.log(`User Created: ${response}`);
			setFormData({ ...initialFormData });
			setErrors(null);
		} catch (errors) {
			console.log(errors);
			setErrors(errors);
		}
	}
	const handleChange = ({ target }) => {
		let value = target.value;
		if (target.name === 'is_admin') {
			value = value === 'true'; // converts string to boolean
		}
		setFormData({ ...formData, [target.name]: value });
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="first_name">First Name:</label>
					<input
						type="text"
						id="first_name"
						name="first_name"
						placeholder="Enter your first name"
						onChange={handleChange}
						required
					/>

					<label htmlFor="last_name">Last Name:</label>
					<input
						type="text"
						id="last_name"
						name="last_name"
						placeholder="Enter your last name"
						onChange={handleChange}
						required
					/>

					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Enter your email"
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<legend>Password:</legend>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						onChange={handleChange}
						required
					/>

					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						placeholder="Confirm your password"
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<legend>Admin:</legend>

					<label>
						<input
							type="radio"
							name="is_admin"
							value="true"
							checked={formData.is_admin === true}
							onChange={handleChange}
						/>
						Yes
					</label>

					<label>
						<input
							type="radio"
							name="is_admin"
							value="false"
							checked={formData.is_admin === false}
							onChange={handleChange}
						/>
						No
					</label>
				</fieldset>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default NewUserForm;
