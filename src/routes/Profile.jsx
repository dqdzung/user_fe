import { useContext, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import {
	ref,
	uploadBytesResumable,
	getDownloadURL,
	getStorage,
} from "firebase/storage";
import firebase from "../firebase";
import { useFormik } from "formik";
import moment from "moment";
import ImageUploading from "react-images-uploading";
import { AuthContext } from "../App";
import PasswordModal from "../components/Modals/PasswordModal";
import api from "../api";
import "./Profile.style.css";

const Profile = () => {
	const { user, setUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [newPassword, setPassword] = useState(null);
	const [images, setImages] = useState([]);

	const isHidden = images.length > 0;
	const toggleHiddenClass = isHidden ? "hidden" : "";

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
			const image = images[0];

			const imgUrl = await uploadFile(image.file);

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

	const uploadFile = (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(firebase);
			const storageRef = ref(storage, file.name);
			const metadata = {
				contentType: file.type,
			};
			const uploadTask = uploadBytesResumable(storageRef, file, metadata);
			const onProgress = () => {};
			const onError = (err) => reject(err);
			const onSuccess = () => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					resolve(downloadURL)
				);
			};
			uploadTask.on("state_changed", onProgress, onError, onSuccess);
		});
	};

	const onImageChange = (imageList) => {
		setImages(imageList);
	};

	return (
		<>
			<h1>Profile Page</h1>
			<Form onSubmit={formik.handleSubmit}>
				<div className="d-flex flex-column align-items-center justify-content-center">
					<ImageUploading
						value={images}
						maxNumber={1}
						onChange={onImageChange}
						dataURLKey="data_url"
					>
						{({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => {
							return (
								<>
									{!images.length > 0 && (
										<div className="imageWrapper mt-4">
											{user && user.profilePicture !== '' ? (
												<img alt="avatar" src={user.profilePicture} />
											) : (
												<img
													alt="avatar"
													src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
												/>
											)}
										</div>
									)}
									{imageList.map((image, index) => {
										return (
											<div key={index}>
												<div
													className="imageWrapper d-flex align-items-center justify-content-center"
													onClick={onImageUpdate}
												>
													<img src={image.data_url} alt="" />
												</div>
											</div>
										);
									})}
									<div className="my-3">
										<Button
											className={toggleHiddenClass}
											onClick={onImageUpload}
										>
											Upload image
										</Button>
										{images.length > 0 && (
											<Button variant="secondary" onClick={onImageRemove}>
												Remove
											</Button>
										)}
									</div>
								</>
							);
						}}
					</ImageUploading>
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
						disabled={
							loading || (!formik.dirty && !newPassword && !images.length > 0)
						}
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
