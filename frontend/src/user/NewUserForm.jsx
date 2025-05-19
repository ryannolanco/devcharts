import React, { useState } from 'react';
import { createUser } from '../utils/api.js';

const initialFormData = {
	name: '',
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
			console.log(formData);

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
				<div>
					<label htmlFor="first_name">Name:</label>
					<input
						type="text"
						id="name"
						name="ame"
						placeholder="Enter your name"
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Enter your email"
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<div>Admin:</div>
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
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
};

export default NewUserForm;
