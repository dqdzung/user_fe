import {
	withGoogleMap,
	withScriptjs,
	GoogleMap,
	Marker,
} from "react-google-maps";

const Map = () => {
  const marker = { lat: 21.02404, lng: 105.810849 };
	return (
		<div>
			<GoogleMap
				defaultZoom={15}
				defaultCenter={marker}
			>
				<Marker position={marker} />
			</GoogleMap>
		</div>
	);
};

export default withScriptjs(withGoogleMap(Map));
