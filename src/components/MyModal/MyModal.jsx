import { Modal, Button } from "react-bootstrap";

const MyModal = ({ show, close, name }) => {
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>{name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={close}>
						Cancel
					</Button>
					<Button variant="primary" onClick={close}>
						Login
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default MyModal;
