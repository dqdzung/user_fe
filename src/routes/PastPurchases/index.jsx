import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import api from "../../api";
import "./PastPurchases.style.css";
import { PaginationComp } from "../Products";

const PastPurchase = () => {
	const [orders, setOrders] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isAddingCart, setAddingCart] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
	const pageSize = 10;

	const location = useLocation();

	const fetchPurchases = async () => {
		setLoading(true);
		const page = searchParams.get("page");

		if (!page) {
			setCurrentPage(1);
		}

		try {
			const res = await api.get(
				`/api/order/user/getOrders?page=${page ? page : 1}&perPage=${pageSize}`
			);

			if (res.status === 200) {
				setOrders(res.data.docs);
				setTotalPage((res.data.totalDocs + pageSize - 1) / pageSize);
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
		// eslint-disable-next-line
	}, [location]);

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

	const handlePageChange = (number) => {
		searchParams.set("page", number);
		setSearchParams(searchParams);
		setCurrentPage(number);
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
						<>
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
														<img
															src={item.productId.avatar}
															alt="product-img"
														/>
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
													<span className="mx-3">
														Order Total:
													</span>
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
							<div className="d-flex justify-content-center mt-4">
								<PaginationComp
									total={totalPage}
									current={currentPage}
									onPageChange={handlePageChange}
								/>
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default PastPurchase;
