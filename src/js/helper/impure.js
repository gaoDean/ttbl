//	== impure functions, contact with the outside world ==

const { appWindow } = window.__TAURI__.window;
const { writeTextFile, readTextFile, createDir, BaseDirectory } = window.__TAURI__.fs;
const invoke = window.__TAURI__.invoke;

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
		data = await readTextFile("ttbl/.storage." + key, { dir: BaseDirectory.Data });
	}	catch(err) {
		console.log(err);
		return undefined;
	}
	return data;
}

async function setData(key, value)
{
	try {
		await createDir("ttbl", { dir: BaseDirectory.Data, recursive: true });
		await writeTextFile("ttbl/.storage." + key, value, { dir: BaseDirectory.Data });
	}	catch(err) {
		console.log(err);
		throw new Error(err);
	}
}

// get from cache
export async function getTimetable()
{
	let timetable = await getData("timetable");
	if (!timetable) {
		console.log("msg: Timetable not found");
		// goLogin();
		return;
	}
	return JSON.parse(timetable);
}

// fetch from endpoint
export async function fetchToken(student_id, password)
{
	invoke("fetch_token", { studentId: student_id, password: password }).then((msg) => console.log(msg));
	return 0;
}

// fetch from endpoint
export async function fetchTimetable()
{
	invoke("fetch_timetable").then((msg) => console.log(msg));
	return 0;
}
