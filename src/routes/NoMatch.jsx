import { Helmet } from "react-helmet";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NoMatch = () => {
	return (
		<div className="my-4">
			<Helmet>
				<title>Voucher Shop - 404</title>
			</Helmet>
			<Container>
				<h2>
					Nothing to see here, please <Link to="/">go back</Link>!
				</h2>
			</Container>
		</div>
	);
};

export default NoMatch;
