import { useState, useContext } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./MainNav.style.css";
import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import { AuthContext, CartContext } from "../../App";

const MainNav = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const { user, setUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const { cartData } = useContext(CartContext);

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
		localStorage.removeItem("token");
		setUser(null);
		navigate("/");
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
						{!user ? (
							<>
								<div
									className="nav-link"
									onClick={() => {
										showModal("login");
									}}
								>
									Login
								</div>
							</>
						) : (
							<>
								<div
									className="nav-link"
									onClick={() => {
										navigate("/cart");
									}}
								>
									<div className="cart-icon">
										<i className="fas fa-shopping-cart" />
										{cartData && (
											<Badge className="mx-1 cart-count" bg="danger" pill>
												{cartData.itemCount}
											</Badge>
										)}
									</div>
								</div>
								<NavDropdown title={user.firstName}>
									<NavDropdown.Item
										onClick={() => {
											navigate("/user/me");
										}}
									>
										Profile
									</NavDropdown.Item>

									<NavDropdown.Item onClick={handleLogout}>
										Log out
									</NavDropdown.Item>
								</NavDropdown>
							</>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<LoginModal
				show={showLogin}
				close={closeModal}
				clickLinkEvent={showModal}
			/>
			<SignUpModal
				show={showSignUp}
				close={closeModal}
				clickLinkEvent={showModal}
			/>
		</>
	);
};

export default MainNav;
