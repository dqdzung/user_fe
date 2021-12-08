import { Card, Col, Button } from "react-bootstrap";
import "./ProductCard.style.css";
import placeholderImg from "./placeholder-image.png";

const ProductCard = ({ data }) => {
	const { avatar, name, description, listedPrice, discountPrice } = data;
	return (
		<Col xs={12} lg={6} className="p-4">
			<Card>
				<Card.Img variant="top" src={avatar || placeholderImg} />
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
						<Button variant="warning">
							Add to Cart
						</Button>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductCard;
