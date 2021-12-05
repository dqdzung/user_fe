import { Carousel, Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.style.css";

const imgs = [
	"https://assets.digilink.vn/uploads/2021/11/San-pham-Digilink-1920x690-02-scaled.jpg",
	"https://assets.digilink.vn/uploads/2021/11/busTrip.jpg",
];

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

const ProductCard = () => {
	return (
		<Col xs={12} lg={6} className="p-4">
			<Card>
				<Card.Img
					variant="top"
					src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
				/>
				<Card.Body>
					<Card.Title>Card Title</Card.Title>
					<hr />
					<Card.Text>
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</Card.Text>
					<div className="d-flex align-items-center justify-content-between">
						<span>Price</span>
						<Button variant="warning">Add to Cart</Button>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

const Home = () => {
	return (
		<>
			{/* Carousel section */}
			<section>
				<Carousel fade variant="dark">
					{/* <Carousel.Item interval={3000}>
							<img
								className="d-block my-0 mx-auto"
								src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
								alt="placeholder"
							/>
						</Carousel.Item> */}
					{imgs.map((img) => {
						return (
							<Carousel.Item key={imgs.indexOf(img)} interval={3000}>
								<img
									className="d-block w-100 h-auto my-0 mx-auto"
									src={img}
									alt={`${"item-" + imgs.indexOf(img)}`}
								/>
							</Carousel.Item>
						);
					})}
				</Carousel>
			</section>

			{/* Hot Product section */}
			<section className="mt-4">
				<Container>
					<div className="text-center">
						<h2>Hot Products</h2>
					</div>
					<Row>
						<ProductCard />
						<ProductCard />
						<ProductCard />
						<ProductCard />
						<ProductCard />
						<ProductCard />
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
