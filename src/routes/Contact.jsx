import { Helmet } from "react-helmet";
import Map from "../components/Map";

const Contact = () => {
	const mapUrl = `https://maps.googleapis.com/maps/api/js?key=
AIzaSyCapp_yCkXY98-0FdL5raEYp2tdRmYYnvo&callback=initMap`;

	return (
		<div className="mt-5 text-center">
			<Helmet>
				<title>Voucher Shop - Contact</title>
			</Helmet>
			<h1 className="text-uppercase">Voucher Shop</h1>
			<hr style={{ width: "40%", margin: "20px auto" }} />
			<p>MindX, 5th Floor, 71 Nguyen Chi Thanh, Hanoi</p>
			<Map
				googleMapURL={mapUrl}
				loadingElement={<div style={{ height: "100%" }} />}
				containerElement={
					<div
						style={{
							height: "80vh",
							margin: "auto",
						}}
					/>
				}
				mapElement={<div style={{ height: "100%" }} />}
			/>
		</div>
	);
};

export default Contact;
