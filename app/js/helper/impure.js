/* requires { Neutralino }

	== impure functions, contact with the outside world == */

let host="https://caulfieldsync.vercel.app/api"
let hosttmp="https://australia-southeast1-studentlife-a0531.cloudfunctions.net"

async function curl(url) {
	let result;
	try {
		result = await fetch(url);
	}	catch(err) {
		throw new Error(err);
	}
	return await result.json();
}

async function getStorageValue(key) {
	let data;
	try {
		data = await Neutralino.storage.getData(key);
	}	catch(err) {
		throw new Error("Entry not found: " + key + ".");
	}
	return data;
}

// export async function getTimetable()

export async function fetchToken(student_id, password) {

	console.log("msg: Fetching token");

	// let url = `${host}/token?username=${student_id}&password=${password}`;
	let url = `${hosttmp}/apiToken?username=${student_id}&password=${password}`;
	let token = await curl(url);
	if (Object.keys(token).indexOf("error") >= 0) { // if fails, returns -1
		throw new Error(ttbl_json["error"]);
	}
	try {
		// the actual token is stored in the key "token"
		await Neutralino.storage.setData("token", token["token"]);
	}	catch(err) {
		console.log(err);
	}

	console.log("msg: Token fetched");

	// successful, changing to home page
	window.location = "index.html";
}

export async function fetchTimetable(pastDays, futureDays) {

	console.log("msg: Fetching timetable");

	// function to extract date from class object
	let getDate = (subject) => (subject["id"].substring(7));

	let token;
	try {
		token = await getStorageValue("token");
	}	catch(err) {
		console.log(err);
		window.location = "login.html";
		Neutralino.window.show();
		return;
	}

	let url = `${host}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	let fetched_timetable = await curl(url);
	if (Object.keys(fetched_timetable).indexOf("error") >= 0) { // if indexOf fails, returns -1
		throw new Error(fetched_timetable["error"]);
	}
	fetched_timetable = fetched_timetable["data"]["classes"]; // to access the classes array

	let cached;
	try {
		cached = JSON.parse(await Neutralino.storage.getData("timetable"));
	}	catch(err) {
		console.log("msg: No cached timetable");
		cached = {};
	}

	let copy = {}; // copy: key is date, value is array of classes for that day
	for (let i in fetched_timetable) {
		let val = fetched_timetable[i];
		let date = getDate(val);
		// if empty, init with <val> otherwise merge with val
		if (!copy[date]) { // if null
			copy[date] = [];
		}
		copy[date].push(val) // each key's value is an array of the classes
	}
	copy = Object.assign(cached, copy);
	try {
		await Neutralino.storage.setData("timetable", JSON.stringify(copy));
	}	catch(err) {
		console.log(err);
	}

	console.log("msg: Timetable fetched");
}
