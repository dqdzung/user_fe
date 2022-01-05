import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ProtectedRoute from "./components/ProtectedRoute";
import MainNav from "./components/MainNav";
import Home from "./routes/Home";
import Products from "./routes/Products";
import News from "./routes/News";
import About from "./routes/About";
import UserPage from "./routes/UserPage";
import Profile from "./components/Profile";
import PastPurchase from "./routes/PastPurchases";
import NoMatch from "./routes/NoMatch";
import Footer from "./components/Footer";
import Contact from "./routes/Contact";
import ProductDetail from "./routes/ProductDetail";
import CartPage from "./routes/Cart";
import SuccessPage from "./routes/SuccessPage";
import NewsDetail from "./routes/NewsDetail";
import api from "./api";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(
	"pk_test_51K2XQmG4O6UAM7MpJnpzEUcBVJV1jlDxMaI6uNw7eCWrl5XEsOdudWZ7kkzAboMzDsUoh7RxOuYKnu5LF8BzbEMw004e6JvTUu"
);

export const AuthContext = createContext();

export const currencyFormatter = (number) => {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});
	return formatter.format(number);
};

export const useFetchCart = () => {
	const [cartData, setCartData] = useState(null);
	const [isFetchingCart, setFetchingCart] = useState(true);

	const fetchCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			// redirect/open login modal
			return;
		}

		try {
			const res = await api.get("api/cart");

			if (res.data.success) {
				setCartData(res.data.data);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setFetchingCart(false);
		}
	};

	useEffect(() => {
		fetchCart();
	});

	return { cartData, fetchCart, isFetchingCart, setFetchingCart };
};

function App() {
	const [user, setUser] = useState(null);
	const { fetchCart } = useFetchCart();

	const fetchUser = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}
		try {
			const res = await api({
				url: "/api/user/me",
				method: "GET",
			});

			if (res.status === 200) {
				setUser(res.data.user);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUser();
		fetchCart();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="App">
			<Helmet>
				<title>{document.title}</title>
			</Helmet>
			<AuthContext.Provider value={{ user, setUser }}>
				<BrowserRouter>
					<MainNav />
					<div className="main-content">
						<Routes>
							<Route path="/" element={<Home />}></Route>
							<Route path="/products" element={<Products />}></Route>
							<Route path="/news" element={<News />}></Route>
							<Route path="/about" element={<About />}></Route>
							<ProtectedRoute path="/user" element={<UserPage />}>
								<Route path="/user" element={<Navigate to="me" />} />
								<Route path="me" element={<Profile />} />
								<Route path="purchase" element={<PastPurchase />} />
							</ProtectedRoute>
							<Route path="/contact" element={<Contact />}></Route>
							<Route path="/products/:id" element={<ProductDetail />}></Route>
							<Route
								path="/cart"
								element={<CartPage stripePromise={stripePromise} />}
							></Route>
							<Route
								path="/payment-success/:id"
								element={<SuccessPage />}
							></Route>
							<Route path="/news/:id" element={<NewsDetail />}></Route>
							<Route path="*" element={<NoMatch />}></Route>
						</Routes>
						<ToastContainer
							position="top-center"
							autoClose={1500}
							hideProgressBar
							newestOnTop
							closeOnClick
							rtl={false}
							draggable
							theme="colored"
							limit={1}
						/>
					</div>
					<Footer />
				</BrowserRouter>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
