/* requires { Neutralino }

	== login and tokens == */

import { fetchToken, fetchTimetable } from "./helper/impure.js";

// gui: the msg under the login
function loginMsg(msg) {
	document.getElementById("login_msg").innerText = msg;
}

// gui: the rotating circle on the button
function busy(bool) {
	document.getElementById("submit").setAttribute("aria-busy", `${bool}`);
}

function isNumeric(str) {
	return Number(str) == str;
}

function checkValid(node, validFunc) {
	if (node.value != "" && validFunc(node.value)) {
		node.setAttribute("aria-invalid", "false");
		return true; // is valid
	}	else {
		node.setAttribute("aria-invalid", "true");
		return false; // isn't valid
	}
}

async function login() {
	let student_id = document.getElementById("login");
	let password = document.getElementById("password");

	// check validity of entries
	if (!checkValid(student_id, isNumeric) + !checkValid(password, () => (true))) {
		// if they're both valid, the above will equate to 0
		// I didn't use a logical or because it short circuits and only one of them turns red
		loginMsg("Looks like you missed something.");
		return;
	}

	// try to fetch the token
	try {
		busy(true);
		loginMsg("Trying to fetch token");
		await fetchToken(student_id.value, password.value);
	}	catch(err) {
		busy(false);
		loginMsg(err);
		console.log(err);
		return;
	}

	loginMsg("Token fetched successfully, fetching timetable");
	await fetchTimetable();
	busy(false);
	loginMsg("Timetable fetched");
	window.location = "index.html";
}

function addListeners() {
	let student_id = document.getElementById("login");
	let password = document.getElementById("password");

	// adds input listener to check if input is valid (gui)
	student_id.addEventListener("input", () => (checkValid(student_id, isNumeric)));
	password.addEventListener("input", () => (checkValid(password, () => (true))));

	// on the "login" button clicked, try to fetch token
	document.getElementById("submit").addEventListener("click", () => (login()));
}

addListeners();
Neutralino.window.show();
