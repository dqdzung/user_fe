import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Placeholder,
	Button,
	Spinner,
	Badge,
} from "react-bootstrap";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import api from "../api";
import "./ProductDetail.style.css";
import placeholderImg from "../components/ProductCard/placeholder-image.png";
import { AuthContext } from "../App";

const ProductDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [isLoading, setLoading] = useState(true);
	const [isAddingCart, setAddingCart] = useState(false);
	const [images, setImages] = useState([
		{
			original: placeholderImg,
			thumbnail: placeholderImg,
		},
	]);
	const { user } = useContext(AuthContext);

	const fetchProduct = async (id) => {
		try {
			const res = await api.get(`/api/product/${id}`);

			if (res.status === 200) {
				setData(res.data.product);

				const imageData = [
					res.data.product.avatar,
					...res.data.product.photos,
				].map((photo) => {
					return {
						original: photo,
						thumbnail: photo,
					};
				});

				setImages(imageData);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchProduct(id);
		// eslint-disable-next-line
	}, []);

	const plus = () => {
		setQuantity(quantity + 1);
	};

	const minus = () => {
		if (quantity <= 1) {
			return;
		}
		setQuantity(quantity - 1);
	};

	const handleAddCart = async (id, quantity) => {
		if (!user) {
			alert("Please log in!");
			return;
		}
		setAddingCart(true);

		try {
			const res = await api.post("api/cart", {
				productId: id,
				quantity,
			});

			if (res.data.success) {
				setAddingCart(false);
				setQuantity(1);
				alert("Item added to cart!"); // To be replaced by a toast notification
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleClickTag = (tag) => {
		console.log("clicked", tag);
	};

	return (
		<div className="product-detail mt-4">
			<Helmet>
				<title>Voucher Shop - Product</title>
			</Helmet>

			<Container>
				<Row>
					<Col lg={6} xs={12}>
						{isLoading ? (
							<img
								className="placeholder-img"
								src={placeholderImg}
								alt="placeholder"
							></img>
						) : (
							<ImageGallery
								items={images}
								showPlayButton={false}
								showNav={false}
								showIndex={true}
								showFullscreenButton={false}
								onErrorImageURL={placeholderImg}
								// thumbnailPosition="left"
							/>
						)}
					</Col>
					<Col lg={6} xs={12}>
						<Row>
							<Col xs={6} sm={6} md={6} lg={12}>
								<h1 className="py-3 text-capitalize">
									{isLoading ? (
										<Placeholder animation="glow">
											<Placeholder xs={6} />
										</Placeholder>
									) : (
										data.name
									)}
								</h1>
								{isLoading ? (
									<>
										<div>
											<Placeholder animation="glow">
												<Placeholder xs={3} />
											</Placeholder>
										</div>
										<div>
											<Placeholder animation="glow">
												<Placeholder xs={3} />
											</Placeholder>
										</div>
									</>
								) : (
									<>
										<div className="text-muted d-flex align-items-center my-1">
											Was:{" "}
											<s className="mx-3">
												<b>{`$${data.listedPrice}`}</b>
											</s>
										</div>
										<div className="text-muted d-flex align-items-center my-1">
											Price:{" "}
											<span className="detail-price mx-3">{`$${data.discountPrice}`}</span>
										</div>
									</>
								)}
							</Col>
							<Col
								xs={6}
								sm={6}
								md={6}
								lg={12}
								className="d-flex align-items-center my-4"
							>
								<Form>
									<div className="quantity-form py-3 d-flex">
										<input type="button" value="-" onClick={minus} />
										<input type="number" value={quantity} />
										<input type="button" value="+" onClick={plus} />
									</div>
									<div className="d-flex align-items-center">
										<Button
											variant="warning"
											className="shadow"
											size="lg"
											disabled={isAddingCart}
											onClick={() => {
												handleAddCart(data._id, quantity);
											}}
										>
											ADD TO CART
										</Button>
										{isAddingCart && (
											<Spinner
												as="span"
												size="sm"
												animation="border"
												role="status"
												aria-hidden="true"
												className="mx-2"
											/>
										)}
									</div>
								</Form>
							</Col>
						</Row>
					</Col>
				</Row>
				<div className="mt-3">
					{isLoading ? (
						<Placeholder animation="glow">
							<Placeholder xs={1} />
						</Placeholder>
					) : (
						data.tags.length &&
						data.tags.map((tag) => (
							<Badge
								pill
								bg="info"
								key={tag}
								className="tag"
								onClick={() => {
									handleClickTag(tag);
								}}
							>
								{tag}
							</Badge>
						))
					)}
				</div>
				<hr className="mt-3" />
				<section>
					<h3>Description</h3>
					<p>
						{isLoading ? (
							<Placeholder animation="glow">
								<Placeholder xs={6} />
							</Placeholder>
						) : (
							data.description
						)}
					</p>
				</section>
			</Container>
		</div>
	);
};

export default ProductDetail;
