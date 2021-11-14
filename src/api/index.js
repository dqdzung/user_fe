import axios from "axios";

const api = axios.create({
	baseURL: "https://nhom-xanh-1.herokuapp.com",
	// baseURL: "http://localhost:8000",
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
