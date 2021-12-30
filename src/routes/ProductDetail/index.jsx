import { Helmet } from "react-helmet";

import { useParams, useNavigate } from "react-router-dom";
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
import api from "../../api";
import "./ProductDetail.style.css";
import placeholderImg from "../../components/ProductCard/placeholder-image.png";

import { AuthContext } from "../../App";
import ProductCard from "../../components/ProductCard";
import { buildTagQuery } from "../NewsDetail";

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
	const [relatedProducts, setRelatedProducts] = useState(null);
	const navigate = useNavigate();

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
				// console.log("tags", res.data.product.tags);
				await fetchRelatedProducts(res.data.product.tags);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchRelatedProducts = async (tagArray) => {
		const tagQuery = buildTagQuery(tagArray);
		const url = `api/product?page=1&perPage=4${tagQuery}`;
		console.log("url", url);
		try {
			const res = await api.get(url);
			if (res.status === 200) {
				setRelatedProducts(res.data.docs);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
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
		} finally {
			setLoading(false);
		}
	};

	const handleClickTag = (tag) => {
		navigate(`/products?tag=${tag}`);
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
				<section>
					<h3>Related products</h3>
					{relatedProducts && (
						<Row>
							{relatedProducts
								.filter((item) => item._id !== data._id)
								.map((item) => {
									return (
										<ProductCard
											data={item}
											onClickTag={handleClickTag}
											key={item._id}
										/>
									);
								})}
						</Row>
					)}
				</section>
			</Container>
		</div>
	);
};

export default ProductDetail;
