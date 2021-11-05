import { Modal } from "react-bootstrap";
import UserForm from "../UserForm/UserForm";

const SignUpModal = ({ show, close, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Sign Up</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<UserForm
						type="signUp"
						close={close}
						clickLinkEvent={clickLinkEvent}
					></UserForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SignUpModal;
