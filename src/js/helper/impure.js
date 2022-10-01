//	== impure functions, contact with the outside world ==

const { appWindow } = window.__TAURI__.window;
const { writeTextFile, readTextFile } = window.__TAURI__.fs;
const invoke = window.__TAURI__.invoke;


function goLogin()
{
	if (window.location != "login.html") {
		window.location = "login.html";
		appWindow.show();
	}
}

// get from cache
export async function getTimetable()
{
	let timetable = invoke("get_timetable");
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
	await invoke("fetch_token", { studentId: student_id, password: password }).then((msg) => console.log(msg));
	return 0;
}

// fetch from endpoint
export async function fetchTimetable()
{
	await await invoke("fetch_timetable").then((msg) => console.log(msg));
	return 0;
}
