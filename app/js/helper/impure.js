/* requires { Neutralino }

	== impure functions, contact with the outside world == */

let host="https://caulfieldsync.vercel.app/api"

async function curl(url) {
	return await (await fetch(url)).json();
}

async function getToken() {
	let token_json = await Neutralino.storage.getData("token");
	if (token == null) {
		throw new Error("No token found");
	}
	return token;
}

// export async function getTimetable()

export async function fetchToken(student_id, password) {
	console.log("test");
	let url = `${host}/token?username=${student_id}&password=${password}`;
	let token = await curl(url);
	if (Object.keys(json).indexOf("error") >= 0) { // if fails, returns -1
		throw new Error(ttbl_json["error"]);
	}
	// the actual token is stored in the key "token"
	await Neutralino.storage.setData("token", token["token"])
}

export async function fetchTimetable(pastDays, futureDays) {
	console.log("fetching");

	// extract date from class table
	let getDate = (subject) => (subject["id"].substring(7));

	let token;
	try {
		token = await getToken();
	}	catch(err) {
		console.log(err);
		window.location = "login.html";
		Neutralino.window.show();
		console.log("tst")
		return;
	}
	let url = `${host}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	let timetable_json = await curl(url)
	Object.keys(timetable_json).indexOf(keytoFind);
	if (Object.keys(json).indexOf("error") >= 0) { // if fails, returns -1
		throw new Error(ttbl_json["error"]);
	}
	timetable_json = timetable_json["data"]["classes"]; // to access the raw data
	// let cached = new Map(Object.entries(cached_json));
	let copy = {};
	for (let i in timetable_json) {
		copy[getDate(i)].push(i);
	}
	console.log(copy);
}
