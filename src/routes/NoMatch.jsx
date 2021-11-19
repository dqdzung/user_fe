import { Helmet } from "react-helmet";

const NoMatch = () => {
	return (
		<div className="mt-4">
			<Helmet>
				<title>Voucher Shop - 404</title>
			</Helmet>
			<h1>404</h1>
		</div>
	);
};

export default NoMatch;
