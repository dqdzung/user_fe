import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Container, Row, Col, Button, Spinner, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
	Elements,
	CardElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";

import api from "../api";
import "./CartPage.style.css";

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			color: "#32325d",
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#aab7c4",
			},
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a",
		},
	},
};

const PaymentForm = ({ total, disabled }) => {
	const elements = useElements();
	const stripe = useStripe();
	const [isDisabled, setDisabled] = useState(true);

	const handlePayment = async (e) => {
		e.preventDefault();
		setDisabled(true);

		if (!stripe || !elements) {
			return;
		}

		try {
			const res = await api.post("api/stripe/create-payment-intent");

			if (res.data.success) {
				const { stripeError, paymentIntent } = await stripe.confirmCardPayment(
					res.data.clientSecret,
					{
						payment_method: {
							card: elements.getElement(CardElement),
						},
					}
				);

				if (stripeError) {
					setDisabled(false);
					alert(stripeError.message);
					return;
				}

				if (paymentIntent.status === "succeeded") {
					alert("Payment succeeded!");
					setDisabled(false);
					//call order/invoice api here and show success page
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleCardInput = ({ error }) => {
		setDisabled(true);
		if (error) {
			console.log(error.message);
			return;
		}
		setDisabled(false);
	};

	return (
		<Form
			className="d-flex flex-column justify-content-between mt-3 card-form"
			onSubmit={handlePayment}
		>
			<CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardInput} />
			<Button
				variant="success"
				type="submit"
				className="mt-3 pay-btn"
				disabled={disabled || isDisabled || !stripe}
			>
				Pay ${total}
			</Button>
		</Form>
	);
};

const CartPage = ({ stripePromise }) => {
	const [cart, setCart] = useState(null);
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
				console.log("cart", res.data.data);
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

	return (
		<div className="mt-4">
			<Elements stripe={stripePromise}>
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
								Your cart is empty.{" "}
								<Link to="/products">Go shop something!</Link>
							</h4>
						)
					) : (
						<Row className="gx-5">
							<Col xs={12} md={12} lg={8} className="py-2">
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
							<Col xs={12} md={12} lg={4} className="py-2">
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
									<PaymentForm
										total={cart.discountTotal}
										disabled={isLoading}
									/>
									<span className="text-muted text-center mt-2">
										Powered by{" "}
										<svg focusable="false" width="33" height="15">
											<g fillRule="evenodd">
												<path d="M32.956 7.925c0-2.313-1.12-4.138-3.261-4.138-2.15 0-3.451 1.825-3.451 4.12 0 2.719 1.535 4.092 3.74 4.092 1.075 0 1.888-.244 2.502-.587V9.605c-.614.307-1.319.497-2.213.497-.876 0-1.653-.307-1.753-1.373h4.418c0-.118.018-.588.018-.804zm-4.463-.859c0-1.02.624-1.445 1.193-1.445.55 0 1.138.424 1.138 1.445h-2.33zM22.756 3.787c-.885 0-1.454.415-1.77.704l-.118-.56H18.88v10.535l2.259-.48.009-2.556c.325.235.804.57 1.6.57 1.616 0 3.089-1.302 3.089-4.166-.01-2.62-1.5-4.047-3.08-4.047zm-.542 6.225c-.533 0-.85-.19-1.066-.425l-.009-3.352c.235-.262.56-.443 1.075-.443.822 0 1.391.922 1.391 2.105 0 1.211-.56 2.115-1.39 2.115zM18.04 2.766V.932l-2.268.479v1.843zM15.772 3.94h2.268v7.905h-2.268zM13.342 4.609l-.144-.669h-1.952v7.906h2.259V6.488c.533-.696 1.436-.57 1.716-.47V3.94c-.289-.108-1.346-.307-1.879.669zM8.825 1.98l-2.205.47-.009 7.236c0 1.337 1.003 2.322 2.34 2.322.741 0 1.283-.135 1.581-.298V9.876c-.289.117-1.716.533-1.716-.804V5.865h1.716V3.94H8.816l.009-1.96zM2.718 6.235c0-.352.289-.488.767-.488.687 0 1.554.208 2.241.578V4.202a5.958 5.958 0 0 0-2.24-.415c-1.835 0-3.054.957-3.054 2.557 0 2.493 3.433 2.096 3.433 3.17 0 .416-.361.552-.867.552-.75 0-1.708-.307-2.467-.723v2.15c.84.362 1.69.515 2.467.515 1.879 0 3.17-.93 3.17-2.548-.008-2.692-3.45-2.213-3.45-3.225z"></path>
											</g>
										</svg>
									</span>
								</div>
							</Col>
						</Row>
					)}
				</Container>
			</Elements>
		</div>
	);
};

export default CartPage;
