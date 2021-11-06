import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
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

	return errors;
};

const SignUpForm = ({ close, clickLinkEvent }) => {
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
		},
		validate,
		// to be changed later
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
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
			<div className="form-btn py-2">
				<Button variant="primary" type="submit">
					Login
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
