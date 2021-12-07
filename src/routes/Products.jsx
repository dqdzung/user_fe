import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
	Container,
	Row,
	Col,
	Form,
	FormControl,
	Pagination,
	Card,
	Placeholder,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard/ProductCard";
import api from "../api";
import "./Product.style.css";
import placeholderImg from "../components/ProductCard/placeholder-image.png";

const tags = ["tag 1", "tag 2", "tag 3"];

const Products = () => {
	const [products, setProducts] = useState([]);
	const [pageItems, setPageItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 4;

	const fetchProducts = async () => {
		try {
			const res = await api.get("/api/product");

			if (res.status === 200) {
				setProducts(res.data.products);
				setPageItems(getPageItems(res.data.products, 1));
				setTotalPage((res.data.products.length + pageSize - 1) / pageSize);
				setIsLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchProducts();
		// eslint-disable-next-line
	}, []);

	const getPageItems = (array, pageNumber) => {
		const offset = (pageNumber - 1) * pageSize;
		return array.slice(offset, offset + pageSize);
	};

	const handlePageChange = (number) => {
		setCurrentPage(number);
		setPageItems(getPageItems(products, number));
	};

	let items = [];
	for (let number = 1; number <= totalPage; number++) {
		items.push(
			<Pagination.Item
				key={number}
				active={number === currentPage}
				onClick={() => {
					handlePageChange(number);
				}}
			>
				{number}
			</Pagination.Item>
		);
	}

	const PlaceholderCard = () => (
		<Col xs={12} lg={6} className="p-4">
			<Card>
				<Card.Img variant="top" src={placeholderImg} />
				<Card.Body>
					<Placeholder as={Card.Title} animation="glow">
						<Placeholder xs={6} />
					</Placeholder>
					<hr />
					<Placeholder as={Card.Text} animation="glow">
						<Placeholder xs={7} /> <Placeholder xs={4} />
						<Placeholder xs={8} />
					</Placeholder>
					<Row>
						<Col>
							<Placeholder animation="glow">
								<Placeholder xs={6} />
							</Placeholder>
						</Col>
						<Col className="d-flex justify-content-end">
							<Placeholder.Button variant="warning" xs={6} />
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);

	return (
		<>
			<Helmet>
				<title>Voucher Shop - Products</title>
			</Helmet>
			<Container className="product-content d-flex">
				<div className="product-side-nav">
					<div className="tag-section">
						<div className="tag-section-header mb-2 text-center">Tags</div>
						<Form>
							<Row>
								{tags.map((tag) => (
									<Col
										xs={4}
										md={12}
										lg={12}
										className="d-flex justify-content-center py-2 px-4"
										key={tags.indexOf(tag)}
									>
										<Form.Check
											type="radio"
											id={tags.indexOf(tag)}
											label={tag}
											name="tag-select"
										/>
									</Col>
								))}
							</Row>
						</Form>
					</div>
				</div>
				<div className="product-main">
					<Form className="w-100 px-3">
						<FormControl
							type="search"
							placeholder="Search"
							aria-label="Search"
						/>
					</Form>
					<Row className="product-list">
						{isLoading ? (
							<>
								<PlaceholderCard />
								<PlaceholderCard />
							</>
						) : (
							pageItems.map((item) => (
								<ProductCard key={item._id} data={item} />
							))
						)}
					</Row>
					<div className="d-flex justify-content-center">
						<Pagination>{items}</Pagination>
					</div>
				</div>
			</Container>
		</>
	);
};

export default Products;
