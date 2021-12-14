import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import api from "../api";
import "./CartPage.style.css";

const CartPage = () => {
	const [cart, setCart] = useState({});
	const [isLoading, setLoading] = useState(true);

	const fetchCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			// redirect/open login modal
			return;
		}

		try {
			const res = await api.get("api/cart");

			if (res.data.success) {
				console.log(res.data.data);
				setCart(res.data.data);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	const handleQuantityChange = (e, id) => {
		console.log(e.target.value);
		console.log(id);
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - Cart</title>
			</Helmet>
			<Container>
				<h1>Your Cart</h1>

				{isLoading ? (
					<h4>
						Your cart is empty. <Link to="/products">Go shop something!</Link>
					</h4>
				) : (
					<Row className="gx-5">
						<Col xs={12} md={7} lg={8} className="py-2">
							<Row className="gy-3 px-3">
								{cart.products.map((product) => {
									return (
										<Col xs={12} className="p-3 cart-item">
											<Row>
												<Col className="d-flex align-items-center justify-content-around">
													<span>{product.product.name}</span>
													<span>${product.product.discountPrice}</span>
												</Col>
												<Col className="quantity-form py-3 d-flex justify-content-center">
													<input
														type="button"
														value="-"
														onClick={(e) => {
															handleQuantityChange(e, product.product._id);
														}}
													/>
													<input type="number" value={product.quantity} />
													<input
														type="button"
														value="+"
														onClick={(e) => {
															handleQuantityChange(e, product.product._id);
														}}
													/>
												</Col>
												<Col className="d-flex align-items-center">Remove</Col>
											</Row>
										</Col>
									);
								})}
							</Row>
						</Col>
						<Col xs={12} md={5} lg={4} className="py-2">
							<div className="p-3 d-flex flex-column subtotal-section">
								<Row>
									<Col Col xs={9}>
										<h5>Subtotal:</h5>
										<h5>With Discount:</h5>
										<div>You save:</div>
									</Col>
									<Col xs={3} className="d-flex flex-column align-items-end">
										<h5>
											<s>${cart.listedTotal}</s>
										</h5>
										<h5>${cart.discountTotal}</h5>
										<div>${cart.listedTotal - cart.discountTotal}</div>
									</Col>
								</Row>
								<Button variant="success" className="mt-3" size="lg">
									Proceed to Checkout
								</Button>
							</div>
						</Col>
					</Row>
				)}
			</Container>
		</div>
	);
};

export default CartPage;
