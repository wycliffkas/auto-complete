import React from "react";
import AutoComplete from "../../components/AutoComplete";
import "./styles.css";

function Home() {
	return (
		<div className="App">
			<h3>Please enter the name of your country</h3>
			<AutoComplete />
		</div>
	);
}

export default Home;
