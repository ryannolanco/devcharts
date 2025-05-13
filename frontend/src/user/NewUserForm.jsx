import React, { useState } from 'react';
import { Form } from 'react-router-dom';

const intialFormData = {
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	is_admin: false,
};

const NewUserForm = () => {
	const [formData, setFormData] = useState({ ...intialFormData });
	const handleSubmit = () => {};
	const handleChange = ({ target }) => {
		const value =
			target.name === 'is_admin' ? !formData.is_admin : target.value;
		setFormData({ ...formData, [target.name]: value });
	};
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="firstName">First Name:</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						placeholder="Enter your first name"
						onChange={handleChange}
						required
					/>

					<label htmlFor="lastName">Last Name:</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
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
							value={true}
							checked={formData.is_admin === true}
							onChange={handleChange}
						/>
						Yes
					</label>

					<label>
						<input
							type="radio"
							name="is_admin"
							value={false}
							checked={formData.is_admin === false}
							onChange={handleChange}
						/>
						No
					</label>
				</fieldset>
			</form>
		</div>
	);
};

export default NewUserForm;
