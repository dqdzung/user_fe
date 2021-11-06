import { Modal } from "react-bootstrap";
import SignUpForm from "../UserForm/SignUpForm";

const SignUpModal = ({ show, close, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Sign Up</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SignUpForm
						close={close}
						clickLinkEvent={clickLinkEvent}
					></SignUpForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SignUpModal;
