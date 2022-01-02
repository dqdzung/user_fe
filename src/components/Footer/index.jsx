import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.style.css";

const Footer = () => {
	return (
		<>
			{/* <section className="bg-primary text-light p-5 my-4">
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
			</section> */}
			<section className="py-3 bg-primary text-light footer">
				<Container>
					<Row>
						<Col className="mb-2" xs={12} md={4}>
							<h3>Voucher Shop</h3>
							<div>MindX School</div>
							<div>(+84) 1234 567 890</div>
							<div>info@voucher.com</div>
						</Col>
						<Col className="mb-2" xs={12} md={4}>
							<h3>About Us</h3>
							<div>
								<Link to="/about" className="text-reset text-decoration-none">
									Our Story
								</Link>
							</div>
							<div>
								<Link to="/contact" className="text-reset text-decoration-none">
									Contact Us
								</Link>
							</div>
							<div>Policy</div>
							<div>FAQ</div>
						</Col>
						<Col className="mb-2" xs={12} md={4}>
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
