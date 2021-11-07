import "./App.css";
import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MainNav from "./components/MainNav/MainNav";
import Home from "./routes/Home";
import Products from "./routes/Products";
import News from "./routes/News";
import About from "./routes/About";
import Profile from "./routes/Profile";
import NoMatch from "./routes/NoMatch";

export const AuthContext = createContext();

function App() {
	const [user, setUser] = useState(null);

	const fetchUser = () => {
		// to be changed later
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}
		const { user } = JSON.parse(localStorage.getItem("token"));
		setUser(user);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div className="App">
			<AuthContext.Provider value={{ user, setUser }}>
				<BrowserRouter>
					<MainNav />
					<Container>
						<Routes>
							<Route path="/" element={<Home />}></Route>
							<Route path="/products" element={<Products />}></Route>
							<Route path="/news" element={<News />}></Route>
							<Route path="/about" element={<About />}></Route>
							<ProtectedRoute
								path="/profile"
								element={<Profile />}
							></ProtectedRoute>
							<Route path="*" element={<NoMatch />}></Route>
						</Routes>
					</Container>
				</BrowserRouter>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
