import { useState, useContext } from "react";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";

import "./ProductCard.style.css";
import placeholderImg from "./placeholder-image.png";
import { AuthContext, CartContext, currencyFormatter } from "../../App";

const ProductCard = ({ data, onClickTag }) => {
	const { user } = useContext(AuthContext);
	const [isLoading, setLoading] = useState(false);
	const { avatar, name, listedPrice, tags, discountPrice, _id } = data;
	const { fetchCart } = useContext(CartContext);

	const handleAddCart = async (id) => {
		if (!user) {
			toast.error("Please log in!");
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
				fetchCart();
				toast.success("Item added to cart!");
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<Link to={`/products/${_id}`} className="text-reset text-decoration-none">
				<Card.Img variant="top" src={avatar || placeholderImg} />
			</Link>
			<Card.Body>
				<Card.Title className="text-capitalize">{name}</Card.Title>
				<hr />
				<Card.Text>
					{tags.length &&
						tags.map((tag) => (
							<Badge
								pill
								bg="info"
								key={tag}
								className="tag"
								onClick={() => {
									onClickTag(tag);
								}}
							>
								{tag}
							</Badge>
						))}
				</Card.Text>
				<div className="d-flex align-items-center justify-content-between">
					<div className="d-flex">
						<div className="price px-1 text-muted">
							<s>{currencyFormatter(listedPrice)}</s>
						</div>
						<div className="price px-1">{currencyFormatter(discountPrice)}</div>
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
	);
};

export default ProductCard;
