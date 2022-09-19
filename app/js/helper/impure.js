/* requires { Neutralino }

	== impure functions, contact with the outside world == */

let host="https://caulfieldsync.vercel.app/api"
let cache="~/.cache/ttbl" // same as ttbl-cli
let data="~/.local/share/ttbl"
await Neutralino.filesystem.createDirectory(cache);
await Neutralino.filesystem.createDirectory(data);

async function getToken() {
	let token = await Neutralino.filesystem.readFile(data + "/token");
	token = token.json()["token"]; // it's stored in the token property
	if (token == null) {
		Neutralino.window.show();
		window.location = "login.html"; // that should prevent the rest from executing I think...
	}
	return token;
}

async function fetchTimetable(pastDays, futureDays, counter) {
	let token = await getToken();
	let url = `${host}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	let ttbl_json = await (await fetch(url)).json();
	if (ttbl_json["error"] != "") {
		throw new Error(ttbl_json["error"])
	}

}
