import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Placeholder,
	Button,
} from "react-bootstrap";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import api from "../api";
import "./ProductDetail.style.css";
import placeholderImg from "../components/ProductCard/placeholder-image.png";

const ProductDetail = () => {
	const { id } = useParams();
	const [data, setData] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [isLoading, setLoading] = useState(true);
	const [images, setImages] = useState([
		{
			original: placeholderImg,
			thumbnail: placeholderImg,
		},
	]);

	const fetchProduct = async (id) => {
		try {
			const res = await api.get(`/api/product/${id}`);

			if (res.status === 200) {
				setData(res.data.product);
				// console.log(res.data.product.avatar);

				const imageData = res.data.product.photos.map((photo) => {
					return {
						original: photo,
						thumbnail: photo,
					};
				});

				imageData.unshift({
					original: res.data.product.avatar,
					thumbnail: res.data.product.avatar,
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

	return (
		<div className="product-detail mt-4">
			<Helmet>
				<title>Voucher Shop - Product</title>
			</Helmet>

			<Container>
				<Row>
					<Col lg={6} xs={12}>
						{isLoading ? (
							<img className="placeholder-img" src={placeholderImg} alt="placeholder"></img>
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
								<h1 className="py-3">
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
									<Button variant="warning" className="shadow" size="lg">
										ADD TO CART
									</Button>
								</Form>
							</Col>
						</Row>
					</Col>
				</Row>
				<hr className="mt-4" />
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
