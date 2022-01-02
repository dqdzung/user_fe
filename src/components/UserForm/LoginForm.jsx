import { useState, useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { AuthContext } from "../../App";
import api from "../../api";
import "./UserForm.style.css";
import { toast } from "react-toastify";

const validate = (values) => {
	const errors = {};

	if (!values.email) {
		errors.email = "Required!";
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = "Invalid email address!";
	}

	if (!values.password) {
		errors.password = "Required!";
	}

	return errors;
};

const LoginForm = ({ close, clickLinkEvent }) => {
	const { setUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validate,
		onSubmit: async (values) => {
			setLoading(true);
			const { email, password } = values;

			try {
				const res = await api({
					url: "api/user/login",
					method: "POST",
					data: { email, password },
				});

				if (res.status === 200) {
					setLoading(false);
					const { user, token } = res.data;
					localStorage.setItem("token", token);
					setUser(user);
					close();
				}
			} catch (err) {
				console.log(err);
				toast.warn("Wrong Email or Password");
			} finally {
				setLoading(false);
			}
		},
	});

	const handleClickLink = () => {
		close();
		clickLinkEvent("signup");
	};

	return (
		<Form onSubmit={formik.handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Label>Email address</Form.Label>
				<Form.Control
					id="email"
					type="email"
					placeholder="Enter email"
					onChange={formik.handleChange}
					value={formik.values.email}
				/>
				{formik.errors.email ? (
					<div className="error pt-1">{formik.errors.email}</div>
				) : null}
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control
					id="password"
					type="password"
					placeholder="Password"
					onChange={formik.handleChange}
					value={formik.values.password}
				/>
				{formik.errors.password ? (
					<div className="error p-1">{formik.errors.password}</div>
				) : null}
			</Form.Group>
			<Form.Group className="mb-3" controlId="formBasicCheckbox">
				<Form.Check type="checkbox" label="Remember me" />
			</Form.Group>
			<div className="py-2">
				<Button variant="primary" type="submit" disabled={loading}>
					{loading ? (
						<Spinner
							as="span"
							animation="border"
							size="sm"
							role="status"
							aria-hidden="true"
						/>
					) : (
						"Login"
					)}
				</Button>
				<Button className="mx-2" variant="secondary" onClick={close}>
					Cancel
				</Button>
			</div>
			<div className="pt-2 form-link" onClick={handleClickLink}>
				Don't have an account? Click here to sign up!
			</div>
		</Form>
	);
};

export default LoginForm;
