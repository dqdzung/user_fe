import { useState, useContext } from "react";
import { Card, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api";

import "./ProductCard.style.css";
import placeholderImg from "./placeholder-image.png";
import { AuthContext } from "../../App";

const ProductCard = ({ data }) => {
	const { user } = useContext(AuthContext);
	const [isLoading, setLoading] = useState(false);
	const { avatar, name, description, listedPrice, discountPrice, _id } = data;

	const handleAddCart = async (id) => {
		if (!user) {
			alert("Please log in!");
      return;
		}
		setLoading(true);

		try {
			const res = await api.post("api/cart", {
				productId: id,
				quantity: 1,
			});

			if (res.data.success) {
				setLoading(false);
				alert("Item added to cart!"); // To be replaced by a toast notification
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Col xs={12} lg={6} className="p-4">
			<Card>
				<Link
					to={`/products/${_id}`}
					className="text-reset text-decoration-none"
				>
					<Card.Img variant="top" src={avatar || placeholderImg} />
				</Link>
				<Card.Body>
					<Card.Title>{name}</Card.Title>
					<hr />
					<Card.Text>{description || "No description"}</Card.Text>
					<div className="d-flex align-items-center justify-content-between">
						<div className="d-flex">
							<div className="price px-1">
								<s>{`US$${listedPrice}`}</s>
							</div>
							<div className="price px-1">{`US$${discountPrice}`}</div>
						</div>
						<Button
							variant="warning"
							disabled={isLoading}
							onClick={() => {
								handleAddCart(_id);
							}}
						>
							{isLoading ? (
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
								/>
							) : (
								"Add to Cart"
							)}
						</Button>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductCard;
