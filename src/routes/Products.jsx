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
	InputGroup,
	Button,
} from "react-bootstrap";

import api from "../api";
import placeholderImg from "../components/ProductCard/placeholder-image.png";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Product.style.css";

const tags = ["tag 1", "tag 2", "tag 3"];

const PriceFilter = ({ min, max, handleSubmit }) => {
	const [minInput, setMinInput] = useState(0);
	const [maxInput, setMaxInput] = useState(0);

	const handleRangeInput = (e) => {
		if (e.target.id === "min") {
			setMinInput(e.target.value);
			return;
		}
		setMaxInput(e.target.value);
	};

	return (
		<div className="slider-section">
			<div className="tag-section-header mb-2 text-center">Price range</div>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit(minInput, maxInput);
				}}
			>
				<Row className="d-flex flex-column align-items-center">
					<Col xs={6} md={10} lg={8}>
						<InputGroup size="sm">
							<InputGroup.Text>$</InputGroup.Text>
							<FormControl
								id="min"
								type="number"
								className="text-center"
								placeholder={min}
								min={min}
								max={max - 1}
								onChange={handleRangeInput}
							/>
						</InputGroup>
					</Col>
					<span className="text-center">-</span>
					<Col xs={6} md={10} lg={8}>
						<InputGroup size="sm">
							<InputGroup.Text>$</InputGroup.Text>
							<FormControl
								id="max"
								type="number"
								className="text-center"
								placeholder={max}
								min={min}
								max={max - 1}
								onChange={handleRangeInput}
							/>
						</InputGroup>
					</Col>
					<Col className="d-flex justify-content-center">
						<Button type="submit" size="sm" className="mt-2">
							Filter
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

const Products = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);
	const [products, setProducts] = useState([]);
	const [searchTerm, setTerm] = useState("");
	const [searchResults, setResults] = useState([]);
	const [pageItems, setPageItems] = useState([]);
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 4;

	const fetchProducts = async () => {
		try {
			const res = await api.get("/api/product/getAll");

			if (res.status === 200) {
				setProducts(res.data.products);
				setPageItems(getPageItems(res.data.products, 1));
				setTotalPage((res.data.products.length + pageSize - 1) / pageSize);
				setIsLoading(false);

				const [min, max] = getMinMaxPrice(res.data.products);
				setMin(min);
				setMax(max);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchProducts();
		// eslint-disable-next-line
	}, []);

	const getMinMaxPrice = (products) => {
		const max = Math.max.apply(
			Math,
			products.map((product) => product.discountPrice)
		);

		const min = Math.min.apply(
			Math,
			products.map((product) => product.discountPrice)
		);

		return [min, max];
	};

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

	const handlePriceFilter = (min, max) => {
		console.log("hello", min, max);
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
					{/* Price filter */}
					<PriceFilter min={min} max={max} handleSubmit={handlePriceFilter} />
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
