import { useState, useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MainNav.style.css";
import MyModal from "../MyModal/MyModal";
import { AuthContext } from "../../App";

const MainNav = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const { user, setUser } = useContext(AuthContext);

	const showModal = (type) => {
		if (type === "login") {
			setShowLogin(true);
			return;
		}
		setShowSignUp(true);
	};

	const closeModal = () => {
		setShowLogin(false);
		setShowSignUp(false);
	};

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null);
  }

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
						{!user ? (
							<div
								className="nav-link"
								onClick={() => {
									showModal("login");
								}}
							>
								Login
							</div>
						) : (
							<div className="d-flex">
								<div className="nav-link">{user}</div>
								<div className="nav-link" onClick={handleLogout}>Log out</div>
							</div>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<MyModal
				type="login"
				show={showLogin}
				close={closeModal}
				clickLinkEvent={showModal}
			/>
			<MyModal
				type="signup"
				show={showSignUp}
				close={closeModal}
				clickLinkEvent={showModal}
			/>
		</>
	);
};

export default MainNav;
