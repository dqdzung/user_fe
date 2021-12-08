import { useState, useEffect } from "react";
import { Carousel, Container, Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Home.style.css";
import api from "../api";

const news = [
	{
		title: "Bắt Trend Check in Du Thuyền Sang Chảnh Bạn Đã Thử?",
		date: "24 Tháng Mười Một, 2021",
		img: "https://assets.digilink.vn/uploads/2021/11/CHECK-IN-DU-THUYEN-e1637723308155.jpg",
	},
	{
		title: "KINH NGHIỆM ĐẾN THIÊN ĐƯỜNG DU LỊCH CÔN ĐẢO",
		date: "24 Tháng Mười Một, 2021",
		img: "https://assets.digilink.vn/uploads/2021/11/BEN-DAM-e1637722800902.jpg",
	},
	{
		title: "Ghé thăm trái tim xanh FLC Vĩnh Phúc?",
		date: "11 Tháng Mười, 2021",
		img: "https://assets.digilink.vn/uploads/2021/10/FLC-eco-farm-1-e1633937922301.jpg",
	},
];

const Home = () => {
	const [homeProducts, setHomeProducts] = useState({
		inSlider: [],
		isHot: [],
	});
	const [isLoading, setLoading] = useState(true);

	const fetchHomeProducts = async () => {
		try {
			const responses = await Promise.all([
				api.get("/api/product/inSlider"),
				api.get("/api/product/isHot"),
			]);

			if (responses.length) {
				setHomeProducts({
					inSlider: responses[0].data.products,
					isHot: responses[1].data.products,
				});
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchHomeProducts();
	}, []);

	return (
		<>
			{/* Carousel section */}
			<section>
				<Carousel fade>
					{isLoading ? (
						<Carousel.Item>
							<Spinner animation="border" role="status" />
						</Carousel.Item>
					) : (
						homeProducts.inSlider.map((item) => (
							<Carousel.Item key={item._id} interval={3000}>
								<img
									className="d-block w-100 h-auto my-0 mx-auto"
									src={item.avatar}
									alt={item.name}
								/>
							</Carousel.Item>
						))
					)}
				</Carousel>
			</section>

			{/* Hot Product section */}
			<section className="hot-section mt-4">
				<Container>
					<div className="text-center">
						<h2>Hot Products</h2>
					</div>
					<Row>
						{isLoading ? (
							<div className="text-center py-5">
								<Spinner animation="border" role="status" />
							</div>
						) : (
							homeProducts.isHot.map((item) => (
								<ProductCard key={item._id} data={item} />
							))
						)}
					</Row>
				</Container>
			</section>

			{/* News section */}
			<section className="news-section mt-4 py-4">
				<div className="text-center">
					<h2>News</h2>
				</div>
				<Container>
					<Row>
						{news.map((item) => {
							return (
								<Col
									xs={12}
									md={6}
									lg={4}
									className="p-4"
									key={news.indexOf(item)}
								>
									<Card className="shadow h-100">
										<Card.Img variant="top" src={item.img} />
										<Card.Body className="px-4 py-3">
											<Card.Title>{item.title}</Card.Title>
										</Card.Body>
										<span className="px-4 pb-3">{item.date}</span>
									</Card>
								</Col>
							);
						})}
					</Row>
					<div className="text-center">
						<Link to="news">See more</Link>
					</div>
				</Container>
			</section>
		</>
	);
};

export default Home;
