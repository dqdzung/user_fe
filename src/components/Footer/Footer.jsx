import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.style.css";

const Footer = () => {
	return (
		<>
			<section className="bg-primary text-light p-5 my-4">
				<Container className="d-md-flex align-items-center justify-content-between">
					<h4 className="mb-3 mb-md-0">Sign Up For Our Newsletter</h4>
					<div className="input-group newsletter-input">
						<input
							type="text"
							className="form-control"
							placeholder="Enter Your Email"
						/>
						<button className="btn btn-dark btn-lg" type="button">
							Send me
						</button>
					</div>
				</Container>
			</section>
			<section className="mb-4 info">
				<Container>
					<Row>
						<Col className="mb-3" xs={12} md={4}>
							<h3>Voucher Shop</h3>
							<div>MindX School</div>
							<div>(+84) 1234 567 890</div>
							<div>info@voucher.com</div>
						</Col>
						<Col className="mb-3" xs={12} md={4}>
							<h3>About Us</h3>
							<Link to="/about" className="text-reset text-decoration-none">
								<div>Our Story</div>
							</Link>
							<Link to="/contact" className="text-reset text-decoration-none">
								<div>Contact Us</div>
							</Link>
							<div>Policy</div>
							<div>FAQ</div>
						</Col>
						<Col className="mb-3" xs={12} md={4}>
							<h3>Payment Methods</h3>
							<i className="fab fa-cc-visa h1 mx-1" />
							<i className="fab fa-cc-mastercard h1 mx-1" />
							<i className="fab fa-cc-jcb h1 mx-1" />
							<i className="fab fa-cc-paypal h1 mx-1" />
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default Footer;
