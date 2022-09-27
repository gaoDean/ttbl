//	== impure functions, contact with the outside world ==

const { appWindow } = window.__TAURI__.window
const { writeTextFile, readTextFile, BaseDirectory } = fs.__TAURI__.fs

let host="https://caulfieldsync.vercel.app/api";


function goLogin()
{
	if (window.location != "login.html") {
		window.location = "login.html";
		appWindow.show();
	}
}

// get from cache
async function getData(key)
{
	let data;
	try {
		data = readTextFile(".storage." + key, { dir: BaseDirectory.Data });
	}	catch(err) {
		console.log(err);
		return undefined;
	}
	return data;
}

async function setData(key, value)
{
	try {
		writeTextFile(".storage." + key, value, { dir: BaseDirectory.Data });
	}	catch(err) {
		console.log(err);
		throw new Error(err);
	}
}

// get from cache
export async function getTimetable()
{
	let timetable = getData("timetable");
	if (!timetable) {
		console.log("msg: Timetable not found");
		goLogin();
		return;
	}
	return JSON.parse(timetable);
}

// fetch from endpoint
export async function fetchToken(student_id, password)
{
	console.log("msg: Fetching token");
	const url = `${host}/token?username=${student_id}&password=${password}`;
	const res = await fetch(url);

	if (res.status == 401) {
		console.log("401")
		return 1;
	}	else if (res.status != 200) {
		throw new Error(`${res.status}: Could not fetch token due to an unknown reason`);
	}

	const token = (await res.json())["token"];
	if (!token) {
		console.log("msg: Token empty");
		return 1;
	}
	try {
		setData("token", token);
	}	catch {
		throw new Error("Could not store token");
	}
	console.log("msg: Token fetched");
	return 0;
}

// fetch from endpoint
export async function fetchTimetable(pastDays = 15, futureDays = 15)
{
	console.log("msg: Fetching timetable");

	// function to extract date from class object
	let getDate = (subject) => (subject["id"].substring(7));

	const token = await getData("token");
	if (token == undefined) {
		goLogin();
		return;
	}
	const url = `${host}/timetable/${token}?dayMinus=${pastDays}&dayPlus=${futureDays}&shorten=true`;
	const res = await fetch(url);
	if (res.status == 403) {
		return 1;
	}	else if (res.status != 200) {
		throw new Error(`${res.status}: Could not fetch the timetable due to an unknown reason`);
	}

	// the info is stored in .data.classes
	const fetched_timetable = (await res.json())["data"]["classes"]; // if status 200

	// get cached timetable data or if that's null an empty object
	let new_timetable = getData("timetable")
		.then((ret) => (JSON.parse(ret)), () => ({}));

	// it leaves unchanged new_timetable values untouched, updates new ones
	for (let i in fetched_timetable) {
		let val = fetched_timetable[i];
		let date = getDate(val);

		// if empty, init with <val> otherwise add val to array
		if (!new_timetable[date]) { // if null
			new_timetable[date] = [];
		}
		// key is date, value is array of classes for that day
		new_timetable[date].push(val)
	}

	try {
		setData("timetable", JSON.stringify(new_timetable));
	}	catch {
		throw new Error("Could not store timetable");
	}

	console.log("msg: Timetable fetched");

	return 0;
}
