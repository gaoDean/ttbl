const invoke = window.__TAURI__.invoke;

async function test() {
	invoke("fetch_timetable").then((msg) => console.log(msg));
}
test();
