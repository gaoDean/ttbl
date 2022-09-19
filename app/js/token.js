/* requires { Neutralino }

	== login and tokens == */

import { fetchToken } from "./helper/cli.js";

function loginMsg(msg) {
	document.getElementById("login_msg").innerText = msg;
}

function busy(bool) {
	document.getElementById("submit").setAttribute("aria-busy", `${bool}`);
}

async function getToken() {
	let student_id = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	if (student_id == "" || password == "") {
		loginMsg("You missed the login or the password.");
		return;
	}
	try {
		busy(true);
		loginMsg("Trying to fetch token");
		await fetchToken(student_id, password);
	}	catch(err) {
		busy(false);
		loginMsg("Login failed, check if you entered the correct password.");
		console.log(err);
		return;
	}
	busy(false);
	loginMsg("Token fetched successfully");
	window.location = "index.html";
}

document.getElementById("submit").addEventListener("click", function() {
	getToken();
});

Neutralino.window.show();
