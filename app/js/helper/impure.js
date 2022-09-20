/* requires { Neutralino }

	== impure functions, contact with the outside world == */

let host="https://caulfieldsync.vercel.app/api"
let cache="~/.cache/ttbl" // same as ttbl-cli
let data="~/.local/share/ttbl"
await Neutralino.filesystem.createDirectory(cache);
await Neutralino.filesystem.createDirectory(data);

async function getToken() {
	let token = await (await Neutralino.filesystem.readFile(data + "/token")).json();
	token = token["token"]; // it's stored in the token property
	if (token == null) {
		Neutralino.window.show();
		window.location = "login.html"; // that should prevent the rest from executing I think...
	}
	return token;
}


export async function ffetchTimetable(pastDays, futureDays) {

	// extract date from class table
	let getDate = (subject) => (subject["id"].substring(7))

	let token = await getToken();
	console.log(token);
	let url = `${host}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	let timetable_json = await (await fetch(url)).json();
	Object.keys(timetable_json).indexOf(keytoFind);
	if (Object.keys(json).indexOf("error") >= 0) { // if fails, returns -1
		throw new Error(ttbl_json["error"]);
	}
	timetable_json = timetable_json["data"]["classes"]; // to access the raw data
	// let cached_json = await (await Neutralino.filesystem.readFile(cache + "/timetable.json")).json();
	// let cached = new Map(Object.entries(cached_json));
	let copy = {};
	for (let i in timetable_json) {
		copy[getDate(i)].push(i);
	}
	console.log(copy);
}
