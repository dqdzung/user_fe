import { useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MainNav.style.css";
import MyModal from "../MyModal/MyModal";

const MainNav = () => {
	const [show, setShow] = useState(false);

	const showLoginModal = () => {
		console.log("clicked login");
		setShow(true);
	};

	const closeModal = () => {
		setShow(false);
	};

	return (
		<>
			<Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
				<Container>
					<Navbar.Brand>Voucher Shop</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Link to="/">Home</Link>
							<Link to="/products">Products</Link>
							<Link to="/news">News</Link>
							<Link to="/about">About Us</Link>
						</Nav>
						<div className="login" onClick={showLoginModal}>
							Login
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<MyModal name="Login" show={show} close={closeModal} />
		</>
	);
};

export default MainNav;
