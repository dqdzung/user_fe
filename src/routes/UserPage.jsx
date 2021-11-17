import { Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import SideNav from "./SideNav";

const UserPage = () => {
	return (
		<Row>
			<Col xs={12} md={2}>
				<SideNav />
			</Col>
			<Col xs={12} md={10}>
				<Outlet />
			</Col>
		</Row>
	);
};

export default UserPage;
