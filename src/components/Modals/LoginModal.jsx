import { Modal } from "react-bootstrap";
import UserForm from "../UserForm/UserForm";

const LoginForm = ({ show, close, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<UserForm
						type="login"
						close={close}
						clickLinkEvent={clickLinkEvent}
					></UserForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default LoginForm;
