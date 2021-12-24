import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams, Link } from "react-router-dom";
import { Container, Row, Col, Badge } from "react-bootstrap";
import moment from "moment";

import { PaginationComp } from "./Products";
import api from "../api";
import "./News.style.css";

const News = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
	const pageSize = 10;

	const fetchNews = async () => {
		const page = searchParams.get("page");

		if (!page) {
			setCurrentPage(1);
		}

		const url = `/api/post?page=${page ? page : 1}&perPage=${pageSize}`;

		try {
			const res = await api.get(url);

			if (res.status === 200) {
				console.log(res.data);
				setData(res.data.docs);
				setTotalPage((res.data.totalDocs + pageSize - 1) / pageSize);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNews();
		// eslint-disable-next-line
	}, []);

	const handlePageChange = (number) => {
		console.log(number);
	};

	const handleClickTag = (tag) => {
		console.log(tag);
		setSearchParams({ tag: tag });
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - News</title>
			</Helmet>
			<Container>
				{isLoading ? (
					<h2>Loading...</h2>
				) : (
					<>
						<h1>News</h1>
						<Row className="px-3">
							{data.map((item) => {
								return (
									<Col xs={12} className="p-3 my-3 shadow-sm news">
										<Row>
											<Col xs={12} md={4} className="d-flex align-items-center">
												<img src={item.avatar} alt="news-avatar" />
											</Col>
											<Col xs={12} md={8}>
												<h3 className="mt-3">{item.title}</h3>
												<div className="my-2">
													{moment(item.createdAt).format("DD/MM/YYYY")}
												</div>
												<p>
													{item.description ||
														"Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat eaque ab perspiciatis, commodi culpa aliquam expedita officia ullam ipsa unde. Recusandae excepturi saepe consequatur repudiandae?"}
												</p>
												<Link to={`/news/${item._id}`} className="text-decoration-none">Read more...</Link>
												<div className="mt-3">
													{item.tags.map((tag) => (
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
													))}
												</div>
											</Col>
										</Row>
									</Col>
								);
							})}
						</Row>
						<div className="d-flex justify-content-center">
							<PaginationComp
								total={totalPage}
								current={currentPage}
								onPageChange={handlePageChange}
							/>
						</div>
					</>
				)}
			</Container>
		</div>
	);
};

export default News;
