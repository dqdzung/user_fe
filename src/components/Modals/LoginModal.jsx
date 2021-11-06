import { Modal } from "react-bootstrap";
import LoginForm from "../UserForm/LoginForm";

const LoginModal = ({ show, close, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<LoginForm
						close={close}
						clickLinkEvent={clickLinkEvent}
					></LoginForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default LoginModal;
