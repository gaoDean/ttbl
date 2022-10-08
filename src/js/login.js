// == login and tokens ==

const { appWindow } = window.__TAURI__.window
const invoke = window.__TAURI__.invoke;

function goLogin()
{
	if (window.location != "login.html") {
		window.location = "login.html";
		appWindow.show();
	}
}

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

function checkValidity(node, validFunc) {
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
	if (!checkValidity(student_id, isNumeric) + !checkValidity(password, () => (true))) {
		// if they're both valid, the above will equate to 0
		// I didn't use a logical or because it short circuits and only one of them turns red
		loginMsg("Looks like you missed something.");
		return;
	}

	// try to fetch the token
	busy(true);
	loginMsg("Trying to fetch token");

	try {
		await invoke("fetch_token", { studentId: student_id.value, password: password.value });
	}	catch(err) {
		console.log(err)
		busy(false);
		if (err == 403) {
			loginMsg("Authorisation failed. Make sure you have typed in your username and password correctly.");
		}	else {
			loginMsg(err);
		}
		return;
	}

	loginMsg("Token fetched successfully, fetching timetable");

	try {
		await invoke("fetch_timetable");
	}	catch(err) {
		console.log(err);
		busy(false);
		if (err == 403) {
			loginMsg("Authorisation failed. Make sure you have typed in your username and password correctly.");
		}	else {
			loginMsg(err);
		}
		return;
	}

	busy(false);
	loginMsg("Timetable fetched");
	window.location = "index.html";
}

function addListeners() {
	let student_id = document.getElementById("login");
	let password = document.getElementById("password");

	// adds input listener to check if input is valid (gui)
	student_id.addEventListener("input", () => (checkValidity(student_id, isNumeric)));
	password.addEventListener("input", () => (checkValidity(password, () => (true))));

	// on the "login" button clicked, try to fetch token
	document.getElementById("submit").addEventListener("click", () => (login()));
	// document.getElementById("link").addEventListener("click", () => (Neutralino.os.open("https://github.com/gaoDean/ttbl")));
}

addListeners();
appWindow.show();
appWindow.setFocus();
