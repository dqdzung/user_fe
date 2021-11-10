import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";

const validate = (values) => {
	const errors = {};

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

const PasswordModal = ({ show, close, setPassword }) => {
  const handleClose = () => {
    formik.resetForm();
    close();
  }

	const formik = useFormik({
		initialValues: {
			password: "",
			passwordConfirm: "",
		},
		validate,
		onSubmit: ({password}) => {
			setPassword(password);
      formik.resetForm();
			close();
		},
	});
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Change Password</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={formik.handleSubmit}>
						<Form.Group className="mb-3">
							<Form.Label>New Password</Form.Label>
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
							<Form.Label>New Password Confirmation</Form.Label>
							<Form.Control
								id="passwordConfirm"
								type="password"
								placeholder="Re-enter Password"
								onChange={formik.handleChange}
								value={formik.values.passwordConfirm}
							/>
							<div className="error p-1">{formik.errors.passwordConfirm}</div>
						</Form.Group>
						<div className="py-2">
							<Button variant="primary" type="submit">
								Save
							</Button>
							<Button className="mx-2" variant="secondary" onClick={handleClose}>
								Cancel
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default PasswordModal;
