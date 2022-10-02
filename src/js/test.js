const invoke = window.__TAURI__.invoke;

async function test() {
	invoke("add_timetable_to_tray", { date: 20221302 }).then((msg) => console.log(msg));
}
test();
