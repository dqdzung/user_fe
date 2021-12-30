import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api";
import "./PastPurchases.style.css";

const PastPurchase = () => {
	const [orders, setOrders] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isAddingCart, setAddingCart] = useState(false);

	const fetchPurchases = async () => {
		try {
			const res = await api.get("/api/order/user/getOrders");

			if (res.status === 200) {
				setOrders(res.data.orders);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPurchases();
	}, []);

	const handleBuyAgain = async (items) => {
		setAddingCart(true);

		let addedItems = 0;
		for (let i = 0; i < items.length; i++) {
			try {
				const res = await api.post("api/cart", {
					productId: items[i].productId._id,
					quantity: items[i].purchaseQty,
				});
				if (res.data.success) {
					addedItems++;
				}
			} catch (err) {
				console.log(err);
			}
		}
		alert(`${addedItems} items added to cart!`);
		setAddingCart(false);
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - Purchases</title>
			</Helmet>
			{isLoading ? (
				<h2 className="text-center">Loading Past Purchases...</h2>
			) : (
				<>
					{!orders ? (
						<h2>
							No purchases, please go <Link to="/products">buy something</Link>
						</h2>
					) : (
						<Row className="g-3">
							{orders.map((order) => (
								<Col
									xs={12}
									className="shadow-sm p-3 order-card"
									key={order._id}
								>
									<span>Order ID: {order._id}</span>
									<Row className="gx-2">
										{order.items.map((item) => (
											<Col
												xs={12}
												key={item.productId._id}
												className="py-2 px-0 d-flex order-item"
											>
												<Link to={`/products/${item.productId._id}`}>
													<img src={item.productId.avatar} alt="product-img" />
												</Link>
												<div className="mx-2 w-100 d-flex justify-content-between">
													<div>
														<h6>
															<Link
																to={`/products/${item.productId._id}`}
																className="text-decoration-none text-black"
															>
																{item.productId.name}
															</Link>
														</h6>
														<span className="text-muted">
															Qty: {item.purchaseQty}
														</span>
													</div>
													<div className="d-flex align-items-center price">
														${item.payablePrice}
													</div>
												</div>
											</Col>
										))}
										<hr className="text-muted" />
										<Col xs={12}>
											<div className="d-flex align-items-center order-total justify-content-end">
												<span>Order Total:</span>
												<span className="total-price price">
													${order.totalAmount}
												</span>
											</div>

											<Button
												className="mt-4 order-btn"
												variant="warning"
												onClick={() => {
													handleBuyAgain(order.items);
												}}
												disabled={isAddingCart}
											>
												{isAddingCart ? (
													<Spinner
														as="span"
														animation="border"
														size="sm"
														role="status"
														aria-hidden="true"
													/>
												) : (
													"Buy Again"
												)}
											</Button>
										</Col>
									</Row>
								</Col>
							))}
						</Row>
					)}
				</>
			)}
		</div>
	);
};

export default PastPurchase;
