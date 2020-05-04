import { create } from 'apisauce';

const api = create({
	baseURL: 'https://api.ipma.pt/open-data/',
});

api.addAsyncResponseTransform(async (response) => {
	if (!response.ok) {
		throw response;
	}
});

async function get(endpoint, params) {
	return await api
		.get(endpoint, params, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
}

export { get };
