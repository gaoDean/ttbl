/* requires { Neutralino }

	== impure functions, contact with the outside world == */

let host1="https://caulfieldsync.vercel.app/api"
let host="https://australia-southeast1-studentlife-a0531.cloudfunctions.net"

async function curl(url) {
	let ret;
	try {
		ret = await fetch(url);
	}	catch(err) {
		throw new Error(err);
	}
	return await ret.json();
}

async function getStorageValue(key) {
	let value_json;
	try {
		value_json = await Neutralino.storage.getData(key);
	}	catch(err) {
		throw new Error("Entry not found: " + key + ".");
	}
	return value_json;
}

// export async function getTimetable()

export async function fetchToken(student_id, password) {
	console.log("test");
	// let url = `${host}/token?username=${student_id}&password=${password}`;
	let url = `${host}/apiToken?username=${student_id}&password=${password}`;
	let token = await curl(url);
	if (Object.keys(token).indexOf("error") >= 0) { // if fails, returns -1
		throw new Error(ttbl_json["error"]);
	}
	// the actual token is stored in the key "token"
	await Neutralino.storage.setData("token", token["token"])
	window.location = "index.html";
}

export async function fetchTimetable(pastDays, futureDays) {
	console.log("fetching");

	// extract date from class table
	let getDate = (subject) => (subject["id"].substring(7));

	let token;
	try {
		token = await getStorageValue("token");
	}	catch(err) {
		console.log(err);
		// window.location = "login.html";
		// Neutralino.window.show();
		return;
	}
	let url = `${host1}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	let timetable_json = await curl(url);
	if (Object.keys(timetable_json).indexOf("error") >= 0) { // if indexOf fails, returns -1
		throw new Error(timetable_json["error"]);
	}
	timetable_json = timetable_json["data"]["classes"]; // to access the classes array
	let cached_json;
	try {
		cached_json = await Neutralino.storage.getData("timetable");
	}	catch(err) {
		console.log("No cached timetable");
		cached_json = {};
	}
	let cached = new Map(Object.entries(cached_json));
	let copy = {};
	for (let i in timetable_json) {
		let val = timetable_json[i];
		let date = getDate(val);
		let cur = copy[date];
		// if empty, init with <val> otherwise merge with val
		copy[date] = (!cur) ? val : Object.assign(cur, val);
	}
	console.log(copy);
}
