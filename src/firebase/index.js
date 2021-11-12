import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyA4S7hdlWwLKaOS8E_JJ0CeOiR4Acuohqw",
	authDomain: "x-career-user-fe.firebaseapp.com",
	projectId: "x-career-user-fe",
	storageBucket: "x-career-user-fe.appspot.com",
	messagingSenderId: "196988099789",
	appId: "1:196988099789:web:01b23ae4aef034644d5d84",
};

const firebase = initializeApp(firebaseConfig);

export default firebase