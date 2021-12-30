import { AuthContext } from "../../App";
import { useContext } from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, path }) => {
	const { user } = useContext(AuthContext);

	const el = user ? element : <Navigate to="/" />;

	return <Route path={path} element={el} />;
};

export default ProtectedRoute;
