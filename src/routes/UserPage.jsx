import { Row, Col, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import SideNav from "../components/SideNav/index.jsx";

const UserPage = () => {
	return (
		<Container>
			<Row>
				<Col xs={12} md={2}>
					<SideNav />
				</Col>
				<Col xs={12} md={10}>
					<Outlet />
				</Col>
			</Row>
		</Container>
	);
};

export default UserPage;
