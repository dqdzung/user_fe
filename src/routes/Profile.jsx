import { useContext, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { AuthContext } from "../App";
import PasswordModal from "../components/Modals/PasswordModal";
import placeholder from "../placeholder/holder.jpg";
import "./Profile.style.css";

const Profile = () => {
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [newPassword, setPassword] = useState(null);

	const close = () => {
		setShow(false);
	};

	const open = () => {
		setShow(true);
	};

	const clearForm = () => {
		formik.resetForm();
		setPassword(null);
	};

	const formik = useFormik({
		initialValues: {
			firstName: user ? user.firstName : "",
			lastName: user ? user.lastName : "",
			dob: user ? user.dob : "",
			phone: user ? user.phone : "",
		},
		onSubmit: (values) => {
      // to be changed
      setLoading(true);
			const data = { password: newPassword, ...values };
			console.log("edited", data);
      setLoading(false);

		},
	});

	const handleUpload = () => {
		// to be changed
		console.log("clicked upload");
	};

	return (
		<>
			<h1>Profile Page</h1>
			<Form onSubmit={formik.handleSubmit}>
				<div className="d-flex flex-column align-items-center justify-content-center">
					<div className="imageWrapper">
						<img alt="avatar" src={user ? user.profilePicture : placeholder} />
					</div>
					<Button className="my-3" onClick={handleUpload}>
						Upload
					</Button>
				</div>

				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						Email
					</Form.Label>
					<Col sm="10" className="d-flex align-items-center">
						{user ? user.email : "example@example.com"}
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						Password
					</Form.Label>
					<Col sm="10" className="d-flex align-items-center">
						<Button onClick={open} disabled={newPassword}>
							Change
						</Button>
						{newPassword && (
							<div className="mx-2">Password changed, remember to Save</div>
						)}
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						First name
					</Form.Label>
					<Col sm="10">
						<Form.Control
							id="firstName"
							type="text"
							placeholder="John/Jane"
							onChange={formik.handleChange}
							value={formik.values.firstName}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						Last name
					</Form.Label>
					<Col sm="10">
						<Form.Control
							id="lastName"
							type="text"
							placeholder="Doe"
							onChange={formik.handleChange}
							value={formik.values.lastName}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						Date of Birth
					</Form.Label>
					<Col sm="10">
						<Form.Control
							id="dob"
							type="text"
							placeholder="01-01-1991"
							onChange={formik.handleChange}
							value={formik.values.dob}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm="2">
						Phone
					</Form.Label>
					<Col sm="10">
						<Form.Control
							id="phone"
							type="text"
							placeholder="0123456789"
							onChange={formik.handleChange}
							value={formik.values.phone}
						/>
					</Col>
				</Form.Group>
				<div className="d-flex justify-content-center py-4">
					<Button
						variant="primary"
						type="submit"
						disabled={loading || (!formik.dirty && !newPassword)}
					>
						{loading ? (
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						) : (
							"Save"
						)}
					</Button>
					<Button className="mx-2" variant="secondary" onClick={clearForm}>
						Clear
					</Button>
				</div>
			</Form>
			<PasswordModal show={show} close={close} setPassword={setPassword} />
		</>
	);
};

export default Profile;
