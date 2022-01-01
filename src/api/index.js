import axios from "axios";

const api = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL_LOCAL,
});

api.interceptors.request.use(
	(req) => {
		const token = localStorage.getItem("token");

		if (token) {
			req.headers.Authorization = token;
		}

		return req;
	},
	(err) => {
		return Promise.reject(err);
	}
);

export default api;
