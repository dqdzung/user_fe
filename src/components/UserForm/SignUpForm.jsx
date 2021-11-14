import { Form, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useFormik } from "formik";
import api from "../../api";
import "./UserForm.style.css";

const validate = (values) => {
	const errors = {};

	if (!values.email) {
		errors.email = "Required!";
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = "Invalid email address!";
	}

	if (!values.password) {
		errors.password = "Required!";
	} else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(values.password)) {
		errors.password =
			"Must be 6-20 characters, contains at least one number, one uppercase and one lowercase letter!";
	}

	if (!values.passwordConfirm) {
		errors.passwordConfirm = "Required!";
	} else if (values.passwordConfirm !== values.password) {
		errors.passwordConfirm = "Password confirmation doesn't match!";
	}

	if (!values.firstName) {
		errors.firstName = "Required!";
	}

	if (!values.lastName) {
		errors.lastName = "Required!";
	}

	return errors;
};

const SignUpForm = ({ close, clickLinkEvent }) => {
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
			firstName: "",
			lastName: "",
		},
		validate,
		// to be changed later
		onSubmit: async (values) => {
			setLoading(true);
			const { email, password, firstName, lastName } = values;

			try {
				const res = await api({
					url: "api/user/register",
					method: "POST",
					data: { email, password, firstName, lastName },
				});

				if (res.status === 200) {
					setLoading(false);
					alert("Registration success!");
					close();
				}
			} catch (err) {
				setLoading(false);
				console.log(err);
				close();
			}
		},
	});

	const handleClickLink = () => {
		close();
		clickLinkEvent("login");
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
					<div className="error p-1">{formik.errors.email}</div>
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
			<Form.Group className="mb-3">
				<Form.Label>Password Confirmation</Form.Label>
				<Form.Control
					id="passwordConfirm"
					type="password"
					placeholder="Re-enter Password"
					onChange={formik.handleChange}
					value={formik.values.passwordConfirm}
				/>
				<div className="error p-1">{formik.errors.passwordConfirm}</div>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>First Name</Form.Label>
				<Form.Control
					id="firstName"
					type="text"
					placeholder="Enter your first name"
					onChange={formik.handleChange}
					value={formik.values.firstName}
				/>
				<div className="error p-1">{formik.errors.firstName}</div>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Last Name</Form.Label>
				<Form.Control
					id="lastName"
					type="text"
					placeholder="Enter your last name"
					onChange={formik.handleChange}
					value={formik.values.lastName}
				/>
				<div className="error p-1">{formik.errors.lastName}</div>
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
						"Sign Up"
					)}
				</Button>
				<Button className="mx-2" variant="secondary" onClick={close}>
					Cancel
				</Button>
			</div>
			<div className="pt-2 form-link" onClick={handleClickLink}>
				Already have an account? Click here to sign in!
			</div>
		</Form>
	);
};

export default SignUpForm;
