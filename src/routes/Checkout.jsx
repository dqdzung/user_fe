import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Elements, CardElement } from "@stripe/react-stripe-js";

// import StripeCheckout from "../components/StripeCheckout/StripeCheckout";
import api from "../api";
import "./Checkout.style.css";

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

const Checkout = ({ stripe }) => {
	const [data, setData] = useState(null);
	const { method } = useParams();
	const [isLoading, setLoading] = useState(true);
	// const [clientSecret, setClientSecret] = useState("");

	const fetchCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			return;
		}

		try {
			const res = await api.get("api/cart");

			if (res.data.success) {
				setData(res.data.data);

				// fetch("/create-payment-intent", {
				// 	method: "POST",
				// 	headers: { "Content-Type": "application/json" },
				// 	body: JSON.stringify(data.products),
				// })
				// 	.then((res) => res.json())
				// 	.then((data) => setClientSecret(data.clientSecret));

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

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - Checkout</title>
			</Helmet>
			<Container>
				<div className="d-flex align-items-center">
					<h1>Checkout</h1>
					{isLoading && (
						<Spinner animation="border" size="sm" className="mx-2" />
					)}
				</div>
				<Link to="/cart">Back to Cart</Link>
				{data && (
					<Row>
						{/* <h2 className="mt-3">${data.discountTotal}</h2> */}
						<Col xs={12} md={12} lg={6} className="py-3">
							{/* Item list */}
							<Row className=" px-3">
								{data.products.map((product) => {
									return (
										<Col xs={12} className="p-1" key={product.product._id}>
											<Row>
												<Col className="d-flex">
													<div className="checkout-item-image">
														<img
															src={product.product.avatar}
															alt={product.product.name}
														/>
													</div>
													<div className="mx-3">
														<b>{product.product.name}</b>
														<div>x{product.quantity}</div>
													</div>
												</Col>
												<Col className="d-flex flex-column align-items-end">
													<b>
														${product.quantity * product.product.discountPrice}
													</b>
													{product.quantity > 1 && (
														<div className="text-muted">
															${product.product.discountPrice} each
														</div>
													)}
												</Col>
											</Row>
										</Col>
									);
								})}
							</Row>
						</Col>
						<Col xs={12} md={12} lg={6} className="py-3">
							{method === "cod" && "Shipping form"}
							{method === "stripe" && (
								<Row className="h-100">
									<Col xs={12} md={9} className="mx-auto my-auto">
										<Elements stripe={stripe}>
											<Form className="p-3 d-flex flex-column justify-content-between shadow card-form">
												<h3>Card</h3>
												<CardElement options={CARD_ELEMENT_OPTIONS} />
												<Button variant="success" className="mt-4">
													Pay ${data.discountTotal}
												</Button>
											</Form>
										</Elements>
									</Col>
								</Row>
							)}
						</Col>
					</Row>
				)}
			</Container>
		</div>
	);
};

export default Checkout;
