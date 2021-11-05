import { Modal } from "react-bootstrap";
import MyForm from "../UserForm/UserForm";

const MyModal = ({ show, close, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Sign Up</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<MyForm
						type="signUp"
						close={close}
						clickLinkEvent={clickLinkEvent}
					></MyForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default MyModal;
