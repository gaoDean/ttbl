/* requires { Neutralino }

	== login and tokens == */

import { fetchToken, fetchTimetable } from "./helper/cli.js";

function loginMsg(msg) {
	document.getElementById("login_msg").innerText = msg;
}

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

async function getToken() {
	let student_id = document.getElementById("login");
	let password = document.getElementById("password");
	console.log(!checkValid(student_id, isNumeric) + !checkValid(password, () => (true)))
	if (!checkValid(student_id, isNumeric) + !checkValid(password, () => (true))) {
		// if they're both valid, the above will equate to 0
		// I didn't use a logical or because it short circuits and only one of them turns red
		loginMsg("Looks like you missed something.");
		return;
	}
	try {
		busy(true);
		loginMsg("Trying to fetch token");
		await fetchToken(student_id.value, password.value);
	}	catch(err) {
		busy(false);
		loginMsg("Login failed, check if you entered the correct password.");
		console.log(err);
		return;
	}
	loginMsg("Token fetched successfully, fetching timetable");
	fetchTimetable();
	busy(false);
	loginMsg("Timetable synced");
	window.location = "index.html";
}

function addListeners() {
	let student_id = document.getElementById("login");
	let password = document.getElementById("password");
	student_id.addEventListener("input", () => (checkValid(student_id, isNumeric)))
	password.addEventListener("input", () => (checkValid(password, () => (true))))

	document.getElementById("submit").addEventListener("click", () => (getToken()));
}

addListeners()
Neutralino.window.show();
