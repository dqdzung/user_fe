import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../../App"
import "./MyForm.style.css";

const MyForm = ({ type, close, clickLinkEvent }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
  const {setUser} = useContext(AuthContext);

	const handleClickLink = () => {
		close();
		if (type === "login") {
			clickLinkEvent("signup");
			return;
		}
		clickLinkEvent("login");
	};

	const handleInput = (e, type) => {
		switch (type) {
			default:
				setEmail(e.target.value);
				break;
			case "password":
				setPassword(e.target.value);
				break;
			case "passwordConfirm":
				setPasswordConfirm(e.target.value);
				break;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
    // to be changed later
		if (type === "login") {
			console.log("login form submitted", email, password);
      localStorage.setItem("token", "token123");
      setUser("user");
      close();
			return;
		}
		console.log("signup form submitted", email, passwordConfirm);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control
					onChange={handleInput}
					type="email"
					placeholder="Enter email"
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control
					onChange={(e) => {
						handleInput(e, "password");
					}}
					type="password"
					placeholder="Password"
				/>
			</Form.Group>
			{type === "login" ? (
				<Form.Group className="mb-3" controlId="formBasicCheckbox">
					<Form.Check type="checkbox" label="Remember me" />
				</Form.Group>
			) : (
				<Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
					<Form.Label>Password Confirmation</Form.Label>
					<Form.Control
						onChange={(e) => {
							handleInput(e, "passwordConfirm");
						}}
						type="password"
						placeholder="Re-enter Password"
					/>
				</Form.Group>
			)}
			<div className="form-btn py-2">
				<Button variant="primary" type="submit">
					{type === "login" ? "Login" : "Sign Up"}
				</Button>
				<Button className="mx-2" variant="secondary" onClick={close}>
					Cancel
				</Button>
			</div>
			<div className="pt-2 form-link" onClick={handleClickLink}>
				{type === "login"
					? "Don't have an account? Click here to sign up!"
					: "Already have an account? Click here to sign in!"}
			</div>
		</Form>
	);
};

export default MyForm;
