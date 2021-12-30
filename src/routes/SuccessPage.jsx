import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import api from "../api";
import "./SuccessPage.style.css";

const SuccessPage = () => {
	const { id } = useParams();
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState(null);

	const componentRef = useRef();

	const fetchOrder = async () => {
		try {
			const res = await api.post("/api/order/user/getOrder", {
				orderId: id,
			});

			setData(res.data.order);
			setLoading(false);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
		// eslint-disable-next-line
	}, []);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - Success</title>
			</Helmet>
			<Container>
				{isLoading && (
					<div className="d-flex align-items-center">
						<Spinner animation="border" size="sm" className="mx-2" />
						<h2>Loading...</h2>
					</div>
				)}
				{!isLoading && (
					<div className="my-3" ref={componentRef}>
						<h2 className="text-center">
							Thank you for your purchase from Voucher Shop!
						</h2>
						<div className="my-4 mx-auto p-2 receipt">
							<h4 className="text-center">Your order No. {id}</h4>
							<Row className="p-3">
								{data.items.map((item) => (
									<Col xs={12}>
										<Row className="text-center">
											<Col>{item.productId.name}</Col>
											<Col>x{item.purchaseQty}</Col>
											<Col>{item.payablePrice}</Col>
										</Row>
									</Col>
								))}
							</Row>
							<Row className="text-center">
								<Col>
									<h4>Total</h4>
								</Col>
								<Col></Col>
								<Col>
									<h4>${data.totalAmount}</h4>
								</Col>
							</Row>
							<div className="d-flex justify-content-center mt-3 mb-2">
								<Button
									className="mx-1"
									variant="warning"
									onClick={handlePrint}
								>
									Print Receipt
								</Button>
								<Button className="mx-1" variant="secondary">
									<Link to="/" className="text-decoration-none text-white">
										Back to Home
									</Link>
								</Button>
							</div>
						</div>
					</div>
				)}
			</Container>
		</div>
	);
};

export default SuccessPage;
