import { useContext, useState, useRef } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import moment from "moment";

import { AuthContext } from "../App";
import PasswordModal from "../components/Modals/PasswordModal";
import api from "../api";
import "./Profile.style.css";

const Profile = () => {
	const { user, setUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [newPassword, setPassword] = useState(null);
	const [imageUploading, setUploading] = useState(false);
	const [imgUrl, setUrl] = useState(null);
	const imageInputRef = useRef();

	const close = () => {
		setShow(false);
	};

	const open = () => {
		setShow(true);
	};

	const clearForm = () => {
		formik.resetForm();
		setPassword(null);
		setUrl(null);
		setUploading(false);
		imageInputRef.current.value = "";
	};

	const formatDate = (date) => {
		return moment(date).format("DD/MM/YYYY");
	};

	const formik = useFormik({
		initialValues: {
			firstName: user ? user.firstName : "",
			lastName: user ? user.lastName : "",
			dob: user ? formatDate(user.dob) : "",
			phone: user ? user.phone : "",
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			setLoading(true);

			const data = { password: newPassword, profilePicture: imgUrl, ...values };
			try {
				const res = await api({
					url: "api/user/update",
					method: "PUT",
					data: data,
				});

				if (res.data.success) {
					setLoading(false);
					setUser(res.data.data);
					alert("User info updated!");
				}
			} catch (err) {
				setLoading(false);
				console.log(err);
			}
		},
	});

	const handleFileInput = async (e) => {
		setUploading(true);
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file, file.name);

		try {
			const res = await api.post("api/image", formData);

			if (res.data.success) {
				setUploading(false);
				setUrl(res.data.data);
			}
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	return (
		<>
			<div className="d-flex">
				<div className="sidebar" style={{ width: "15%" }}>
					<h3 className="w3-bar-item">Menu</h3>
					<div className="links d-flex flex-column">
						<span>Profile</span>
						<span>Purchases</span>
					</div>
				</div>
				<div className="profile" style={{ width: "85%" }}>
					<Form onSubmit={formik.handleSubmit}>
						<div className="d-flex flex-column align-items-center justify-content-center">
							<div className="d-flex align-items-center mt-4 imageWrapper">
								{imgUrl ? (
									<img alt="avatar" src={imgUrl} />
								) : (
									<img
										alt="avatar"
										src={
											user && user.profilePicture !== ""
												? user.profilePicture
												: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
										}
									/>
								)}
							</div>
							<Form.Group className="my-3 d-flex align-items-center">
								<Form.Control
									type="file"
									size="sm"
									ref={imageInputRef}
									onChange={handleFileInput}
								/>
								{imageUploading && (
									<Spinner animation="border" size="sm" className="mx-2" />
								)}
							</Form.Group>
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
								disabled={loading || (!formik.dirty && !newPassword && !imgUrl)}
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
				</div>
				<PasswordModal show={show} close={close} setPassword={setPassword} />
			</div>
		</>
	);
};

export default Profile;
