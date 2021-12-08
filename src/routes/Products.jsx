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


import api from "../api";
import placeholderImg from "../components/ProductCard/placeholder-image.png";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Product.style.css";

const tags = ["tag 1", "tag 2", "tag 3"];

const Products = () => {
	const [isLoading, setIsLoading] = useState(true);
	// const [range, setRange] = useState({
	// 	min: 0,
	// 	max: 1,
	// });
	const [products, setProducts] = useState([]);
	const [searchTerm, setTerm] = useState("");
	const [searchResults, setResults] = useState([]);
	const [pageItems, setPageItems] = useState([]);
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

				// const [min, max] = getMinMaxPrice(res.data.products);
				// setRange({ min, max });
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchProducts();
		// eslint-disable-next-line
	}, []);

	// const getMinMaxPrice = (products) => {
	// 	const max = Math.max.apply(
	// 		Math,
	// 		products.map((product) => product.discountPrice)
	// 	);

	// 	const min = Math.min.apply(
	// 		Math,
	// 		products.map((product) => product.discountPrice)
	// 	);

	// 	return [min, max];
	// };

	const getPageItems = (array, pageNumber) => {
		const offset = (pageNumber - 1) * pageSize;
		return array.slice(offset, offset + pageSize);
	};

	const handlePageChange = (number) => {
		const items = searchTerm ? searchResults : products;
		setPageItems(getPageItems(items, number));
		setCurrentPage(number);
	};

	const handleSearchInput = (e) => {
		setTerm(e.target.value);
		const searchRegExp = new RegExp(e.target.value, "ig");
		const results = products.filter((item) => item.name.match(searchRegExp));
		setResults(results);
		setTotalPage((results.length + pageSize - 1) / pageSize);
		setPageItems(getPageItems(results, 1));
		setCurrentPage(1);
	};

	const PaginationComp = ({ total, current }) => {
		let items = [];
		for (let number = 1; number <= total; number++) {
			items.push(
				<Pagination.Item
					key={number}
					active={number === current}
					onClick={() => {
						handlePageChange(number);
					}}
				>
					{number}
				</Pagination.Item>
			);
		}

		return <Pagination>{items}</Pagination>;
	};

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

	const ProductList = ({ items }) => {
		return items.map((item) => <ProductCard key={item._id} data={item} />);
	};

	return (
		<>
			<Helmet>
				<title>Voucher Shop - Products</title>
			</Helmet>
			<Container className="product-content d-flex mt-4">
				{/* Side nav */}
				<div className="product-side-nav">
					{/* Tags */}
					<div className="tag-section mb-4">
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
					{/* Range slider */}
					<div className="slider-section">
						<div className="tag-section-header mb-2 text-center">
							Price range
						</div>
						<div className="mt-3 px-2">

						</div>
					</div>
				</div>

				{/* Products section */}
				<div className="product-main">
					<Form className="w-100 px-3">
						<FormControl
							type="search"
							placeholder="Search"
							aria-label="Search"
							onChange={handleSearchInput}
						/>
					</Form>
					<Row className="product-list">
						{isLoading ? (
							<>
								<PlaceholderCard />
								<PlaceholderCard />
							</>
						) : (
							<ProductList items={pageItems} />
						)}
					</Row>

					{/* Pagination */}
					<div className="d-flex justify-content-center">
						<PaginationComp total={totalPage} current={currentPage} />
					</div>
				</div>
			</Container>
		</>
	);
};

export default Products;
