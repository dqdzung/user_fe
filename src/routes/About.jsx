import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
	return (
		<Container>
			<div className="my-4">
				<Helmet>
					<title>Voucher Shop - About Us</title>
				</Helmet>
				<h2>About Us</h2>
				<section>
					<p className="text-justify">
						This website is built with <b>ReactJS</b>, <b>NodeJS</b>,{" "}
						<b>MongoDB</b> and hosted with <b>Firebase Hosting</b>, by a team of
						two dedicated developers over a period of two months as their final
						project for MindX Technology School.
					</p>
				</section>
				<section className="mt-4">
					<h4 className="text-center mb-3">Meet the Team</h4>
					<Row className="g-4">
						<Col xs={6}>
							<Card>
								<img
									style={{
										border: "1px solid rgba(0, 0, 0, 0.125)",
										borderRadius: "100%",
										minWidth: "40%",
										maxWidth: "45%",
										margin: "15px auto",
									}}
									src={`https://randomuser.me/api/portraits/men/${Math.floor(
										Math.random() * 100
									)}.jpg`}
									alt=""
								/>
								<Card.Body className="text-center">
									<Card.Title>NNH</Card.Title>
									<p>Male, 24</p>
									<Card.Text>
										Responsible for most of the project's backend and the
										frontend for the admin's management features.
									</Card.Text>
									<h4>
										<a
											href="https://github.com/ngochieu276"
											className="text-black"
										>
											<i class="fab fa-github mx-1" />
										</a>
										<i class="fab fa-facebook mx-1" />
										<i class="fab fa-linkedin mx-1" />
									</h4>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={6}>
							<Card>
								<img
									style={{
										border: "1px solid rgba(0, 0, 0, 0.125)",
										borderRadius: "100%",
										minWidth: "40%",
										maxWidth: "45%",
										margin: "15px auto",
									}}
									src={`https://randomuser.me/api/portraits/men/${Math.floor(
										Math.random() * 100
									)}.jpg`}
									alt=""
								/>
								<Card.Body className="text-center">
									<Card.Title>ĐQD</Card.Title>
									<p>Male, 27</p>
									<Card.Text>
										Responsible for the user's frontend, which is what you're
										seeing, and some of the backend's features.
									</Card.Text>
									<h4>
										<a href="https://github.com/dqdzung" className="text-black">
											<i class="fab fa-github mx-1" />
										</a>
										<i class="fab fa-facebook mx-1" />
										<i class="fab fa-linkedin mx-1" />
									</h4>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</section>
				<section className="mt-5">
					<h2 className="text-center">"We deliver the best of the best!"</h2>
				</section>
			</div>
		</Container>
	);
};

export default AboutUs;
