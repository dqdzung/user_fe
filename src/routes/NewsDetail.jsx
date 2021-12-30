import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Badge } from "react-bootstrap";
import moment from "moment";
import api from "../api";
import "./NewsDetail.style.css";
import { NewsCard } from "./News";

export const buildTagQuery = (array) => {
	let queryString = "";
	array.forEach((tag) => {
		return (queryString += `&tag=${tag}`);
	});
	return queryString;
};

const NewsDetail = () => {
	const { id } = useParams();
	const [news, setNews] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [relatedNews, setRelatedNews] = useState(null);

	const navigate = useNavigate();

	const fetchNews = async () => {
		try {
			const res = await api.get(`api/post/${id}`);

			if (res.status === 200) {
				setLoading(false);
				setNews(res.data.post);
				await fetchRelatedNews(res.data.post.tags);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	const fetchRelatedNews = async (tagArray) => {
		const tagQuery = buildTagQuery(tagArray);
		const url = `api/post?page=1&perPage=4${tagQuery}`;
		try {
			const res = await api.get(url);
			if (res.status === 200) {
				setRelatedNews(res.data.docs);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchNews();
		// eslint-disable-next-line
	}, []);

	const handleClickTag = (tag) => {
		navigate(`/news?tag=${tag}`);
	};

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - News</title>
			</Helmet>
			<Container>
				{isLoading && <h2>Loading Article...</h2>}
				{news && (
					<section className="news-detail">
						<h1>{news.title}</h1>
						<p>{moment(news.createdAt).format("DD/MM/YYYY, HH:MM (UTC+7)")}</p>
						<div dangerouslySetInnerHTML={{ __html: news.post }}></div>
						<h5 className="author">By {news.createdBy}</h5>
						<div className="mb-4">
							<span>Tag: </span>
							{news.tags.map((tag) => {
								return (
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
								);
							})}
						</div>
						<section>
							<h4>Related articles</h4>
							{relatedNews &&
								relatedNews
									.filter((item) => item._id !== news._id)
									.map((item) => {
										return (
											<NewsCard
												article={item}
												onClickTag={handleClickTag}
												key={item._id}
											/>
										);
									})}
						</section>
            <p className="text-center"><Link to="/news">See more</Link></p>
					</section>
				)}
			</Container>
		</div>
	);
};

export default NewsDetail;
