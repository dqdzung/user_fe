import "./App.css";
import MainNav from "./components/MainNav/MainNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Products from "./routes/Products";
import News from "./routes/News";
import About from "./routes/About";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<header className="App-header">
					<MainNav />
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/products" element={<Products />}></Route>
						<Route path="/news" element={<News />}></Route>
						<Route path="/about" element={<About />}></Route>
					</Routes>
				</header>
			</BrowserRouter>
		</div>
	);
}

export default App;
