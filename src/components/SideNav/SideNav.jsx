import { Link } from "react-router-dom";
import "./SideNav.style.css";

const SideNav = () => {
	return (
		<div className="d-flex flex-column mt-3 side-nav">
			<Link
				className="text-decoration-none text-reset shadow-sm p-2 my-2 bg-white rounded side-nav-link"
				to="me"
			>
				Profile
			</Link>
			<Link
				className="text-decoration-none text-reset shadow-sm p-2 my-2 bg-white rounded side-nav-link"
				to="purchase"
			>
				Purchases
			</Link>
		</div>
	);
};

export default SideNav;
