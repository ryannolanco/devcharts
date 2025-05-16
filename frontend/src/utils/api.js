const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

async function fetchJson(url, options, onCancel) {
	try {
		const response = await fetch(url, options);

		if (response.status === 204) {
			return null;
		}

		const payload = await response.json();

		if (payload.error) {
			return Promise.reject({ message: payload.error });
		}
		return payload.data;
	} catch (error) {
		if (error.name !== 'AbortError') {
			console.error(error.stack);
			console.error(error.name);
			throw error;
		}
		return Promise.resolve(onCancel);
	}
}

export async function createUser(formData, signal) {
	const url = new URL(`${API_BASE_URL}/users/signup`);

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ data: formData }),
		signal,
	};

	return await fetchJson(url, options, []);
}
