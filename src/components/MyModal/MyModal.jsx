import { Modal } from "react-bootstrap";
import MyForm from "../MyForm/MyForm";

const MyModal = ({ show, close, type, clickLinkEvent }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>{type === "login" ? "Login" : "Sign Up"}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<MyForm
						type={type}
						close={close}
						clickLinkEvent={clickLinkEvent}
					></MyForm>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default MyModal;
