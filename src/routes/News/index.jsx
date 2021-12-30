import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Badge, CloseButton } from "react-bootstrap";
import moment from "moment";

import { PaginationComp } from "../Products";
import api from "../../api";
import "./News.style.css";

export const NewsCard = ({ article, onClickTag }) => {
	return (
		<Col xs={12} className="p-3 my-3 shadow-sm news">
			<Row>
				<Col
					xs={12}
					md={5}
					lg={4}
					className="d-flex align-items-center justify-content-center"
				>
					<Link to={`/news/${article._id}`}>
						<img src={article.avatar} alt="news-avatar" />
					</Link>
				</Col>
				<Col xs={12} md={7} lg={8}>
					<Link
						to={`/news/${article._id}`}
						className="text-decoration-none text-black"
					>
						<h3 className="mt-3">{article.title}</h3>
					</Link>
					<div className="my-2">
						{moment(article.createdAt).format("DD/MM/YYYY")}
					</div>
					<p>
						{article.description ||
							"Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat eaque ab perspiciatis, commodi culpa aliquam expedita officia ullam ipsa unde. Recusandae excepturi saepe consequatur repudiandae?"}
					</p>
					<Link to={`/news/${article._id}`} className="text-decoration-none">
						Read more...
					</Link>
					<div className="mt-3">
						{article.tags.map((tag) => (
							<Badge
								pill
								bg="info"
								key={tag}
								className="tag"
								onClick={() => {
									onClickTag(tag);
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
};

const News = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
	const pageSize = 5;
	const [tagFilter, setTag] = useState(searchParams.get("tag"));

	const location = useLocation();

	const fetchNews = async () => {
		setLoading(true);
		const page = searchParams.get("page");
		const tag = searchParams.get("tag");

		if (!page) {
			setCurrentPage(1);
		}

		const url = `/api/post?page=${page ? page : 1}&perPage=${pageSize}${
			tag ? `&tag=${tag}` : ""
		}`;

		try {
			const res = await api.get(url);

			if (res.status === 200) {
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
	}, [location]);

	const handlePageChange = (number) => {
		searchParams.set("page", number);
		setSearchParams(searchParams);
		setCurrentPage(number);
	};

	const handleClickTag = (tag) => {
		setTag(tag);
		setCurrentPage(1);
		setSearchParams({ tag: tag });
	};

	const handleRemoveTag = () => {
		searchParams.delete("tag");
		setSearchParams(searchParams);
		setTag(null);
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - News</title>
			</Helmet>
			<Container>
				{isLoading ? (
					<h2 className="mb-4">Loading News...</h2>
				) : (
					<>
						<h1>News</h1>
						{tagFilter && (
							<div className="d-flex align-items-center">
								<span>Showing results for</span>
								<Badge pill bg="info" className="mx-1">
									{tagFilter}
								</Badge>
								<CloseButton onClick={handleRemoveTag} />
							</div>
						)}
						<Row className="px-3">
							{data.map((item) => {
								return (
									<NewsCard
										article={item}
										onClickTag={handleClickTag}
										key={item._id}
									/>
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
