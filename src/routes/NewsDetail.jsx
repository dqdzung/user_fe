import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../api";
import "./NewsDetail.style.css"

const NewsDetail = () => {
	const { id } = useParams();
	const [news, setNews] = useState(null);
	const [isLoading, setLoading] = useState(true);

	const fetchNews = async () => {
		try {
			const res = await api.get(`api/post/${id}`);

			if (res.status === 200) {
				setLoading(false);
				setNews(res.data.post);
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

	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - News</title>
			</Helmet>
			<Container>
				{isLoading && <h2>Loading News...</h2>}
				{news && (
					<div className="news-detail">
						<h1>{news.title}</h1>
						<div dangerouslySetInnerHTML={{ __html: news.post }}></div>
					</div>
				)}
			</Container>
		</div>
	);
};

export default NewsDetail;
