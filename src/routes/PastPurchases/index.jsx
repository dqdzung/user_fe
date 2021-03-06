import { Helmet } from "react-helmet";
import { useState, useEffect, useContext } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import api from "../../api";
import "./PastPurchases.style.css";
import { PaginationComp } from "../Products";
import moment from "moment";
import { toast } from "react-toastify";
import { currencyFormatter } from "../../App";
import {  CartContext } from "../../App";

const PastPurchase = () => {
	const [orders, setOrders] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
	const pageSize = 10;

	const location = useLocation();
	const { fetchCart } = useContext(CartContext);

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
				console.log("orders", res.data.docs);
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
		setIsFetching(true);

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
    await fetchCart();
		toast.success(`${addedItems} items added to cart!`);
		setIsFetching(false);
	};

	const handleRefund = async (paymentIntentId, orderId) => {
		setIsFetching(true);
		try {
			const res = await api.post("/api/stripe/refund", {
				paymentIntentId,
			});

			if (res.data.success) {
				await api.put("/api/order/user/cancelOrder", {
					orderId,
				});
				toast.success("Successfully cancel order!");

				await fetchPurchases();
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsFetching(false);
		}
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
					{!orders && !orders.length ? (
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
										<div className="d-flex justify-content-between">
											<span>Order ID: {order._id}</span>
											<b
												className={`${
													order.status === "cancelled"
														? "text-danger"
														: "text-success"
												} text-uppercase`}
											>
												{order.status}
											</b>
										</div>
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
															{currencyFormatter(item.payablePrice)}
														</div>
													</div>
												</Col>
											))}
											<hr className="text-muted" />
											<Col xs={12}>
												<Row className="purchase-card-footer">
													<Col
														md={12}
														lg={6}
														className="d-flex align-items-center timeline"
													>
														<section className="time-line-box">
															<div className="swiper-wrapper">
																{order.orderStatus.map((status) => {
																	if (status.isCompleted) {
																		return (
																			<div
																				className="swiper-slide"
																				key={status._id}
																			>
																				<div className="mb-2 date">
																					{moment(status.date).format(
																						"DD/MM/YYYY, HH:MM"
																					)}
																				</div>
																				<div className="status">
																					<span>{status.type}</span>
																				</div>
																			</div>
																		);
																	}
																	return <></>;
																})}
																{order.isCancel && (
																	<div className="swiper-slide">
																		<div className="mb-2 date">
																			{moment(order.updatedAt).format(
																				"DD/MM/YYYY, HH:MM"
																			)}
																		</div>
																		<div className="status">
																			<span>cancelled</span>
																		</div>
																	</div>
																)}
															</div>
														</section>
													</Col>
													<Col md={12} lg={6} className="mt-3">
														<Row className="g-4">
															<Col
																xs={6}
																lg={12}
																className="d-flex align-items-center order-total justify-content-end"
															>
																<b className="">Order Total: </b>
																<span className="mx-1 total-price price">
																	{currencyFormatter(order.totalAmount)}
																</span>
															</Col>

															<Col
																xs={6}
																lg={12}
																className="d-flex align-items-center justify-content-end"
															>
																<Button
																	className="order-btn mx-1"
																	variant="warning"
																	onClick={() => {
																		handleBuyAgain(order.items);
																	}}
																	disabled={isFetching}
																>
																	{isFetching ? (
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
																{order.status === "ordered" && (
																	<Button
																		className="order-btn mx-1"
																		variant="danger"
																		onClick={() => {
																			handleRefund(
																				order.paymentIntentId,
																				order._id
																			);
																		}}
																		disabled={isFetching}
																	>
																		{isFetching ? (
																			<Spinner
																				as="span"
																				animation="border"
																				size="sm"
																				role="status"
																				aria-hidden="true"
																			/>
																		) : (
																			"Cancel"
																		)}
																	</Button>
																)}
															</Col>
														</Row>
													</Col>
												</Row>
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
