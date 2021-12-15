import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
	Container,
	Row,
	Col,
	Button,
	Spinner,
	FormSelect,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";
import "./CartPage.style.css";

const CartPage = () => {
	const [cart, setCart] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const navigate = useNavigate();

	const fetchCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			// redirect/open login modal
			return;
		}

		try {
			const res = await api.get("api/cart");

			if (res.data.success) {
				setCart(res.data.data);
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	const handleQuantityChange = async (e, id, quantity) => {
		setLoading(true);

		const payload = {
			productId: id,
			quantity: e.target.value === "+" ? quantity + 1 : quantity - 1,
		};

		try {
			const res = await api.put("api/cart/item/update", payload);
			if (res.data.success) {
				fetchCart();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleRemoveItem = async (id) => {
		setLoading(true);
		try {
			const res = await api.put("api/cart/item/remove", {
				productId: id,
			});

			if (res.data.success) {
				fetchCart();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleSelect = (method) => {
		setPaymentMethod(method);
	};

	const toCheckout = (method) => {
		if (!method) {
			alert("Please choose a payment method"); //to be changed
			return;
		}

		navigate(`/checkout/${method}`);
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - Cart</title>
			</Helmet>
			<Container>
				<div className="d-flex align-items-center">
					<h1>Your Cart</h1>
					{isLoading && (
						<Spinner animation="border" size="sm" className="mx-2" />
					)}
				</div>
				{!cart ? (
					!isLoading && (
						<h4>
							Your cart is empty. <Link to="/products">Go shop something!</Link>
						</h4>
					)
				) : (
					<Row className="gx-5">
						<Col xs={12} md={7} lg={8} className="py-2">
							<Row className="gy-3 px-3">
								{cart.products.map((product) => {
									return (
										<Col
											xs={12}
											className="p-1 cart-item"
											key={product.product._id}
										>
											<Row>
												<Col
													xs={12}
													lg={7}
													className="d-flex flex-column justify-content-around"
												>
													<div className="d-flex">
														<div className="cart-item-image">
															<Link
																to={`/products/${product.product._id}`}
																className="text-reset text-decoration-none"
															>
																<img
																	src={product.product.avatar}
																	alt={product.product.name}
																/>
															</Link>
														</div>
														<div className="d-flex flex-column justify-content-between px-3">
															<Link
																to={`/products/${product.product._id}`}
																className="text-reset text-decoration-none"
															>
																<h4>{product.product.name}</h4>
															</Link>
															<div className="px-1">
																<s>${product.product.listedPrice}</s>
															</div>
															<div className="px-1 price">
																${product.product.discountPrice}
															</div>
														</div>
													</div>
												</Col>
												<Col
													xs={12}
													lg={5}
													className="d-flex justify-content-between align-items-center my-2"
												>
													<div className="d-flex justify-content-center px-3 quantity-form">
														<input
															type="button"
															value="-"
															onClick={(e) => {
																handleQuantityChange(
																	e,
																	product.product._id,
																	product.quantity
																);
															}}
															disabled={isLoading}
														/>
														<input type="number" value={product.quantity} />
														<input
															type="button"
															value="+"
															onClick={(e) => {
																handleQuantityChange(
																	e,
																	product.product._id,
																	product.quantity
																);
															}}
															disabled={isLoading}
														/>
													</div>
													<Button
														variant="danger"
														className="mx-4"
														onClick={() => {
															handleRemoveItem(product.product._id);
														}}
														disabled={isLoading}
													>
														Remove
													</Button>
												</Col>
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
								<FormSelect
									className="mt-3"
									aria-label="Payment Method"
									defaultValue="default"
									onChange={(e) => {
										handleSelect(e.target.value);
									}}
								>
									<option value="default" disabled>
										Payment method
									</option>
									<option value="cod">COD</option>
									<option value="stripe">Stripe</option>
								</FormSelect>
								<Button
									variant="success"
									className="mt-3"
									size="lg"
									disabled={isLoading}
									onClick={() => {
										toCheckout(paymentMethod);
									}}
								>
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
