import * as cli from "./cli.js"
const ms_in_day = 86400000; // 1000(ms) * 60(s) * 60(m) * 24(h)

const hours = "05"; 		// 00-23
const minutes = "00"; 	// 00-59
const seconds = "00"; 	// 00-59

const current_ms = dayjs()
const desired_iso = dayjs(dayjs().format("YYYY-MM-DDT" + hours + ":" + minutes + ":" + seconds + "Z"));

let delta_ms = dayjs(desired_iso.diff(current_ms));
if (delta_ms < 0) {
	delta_ms = delta_ms.add(1, "day")
}

setTimeout(setupInterval, delta_ms);
async function setupInterval() {
	setInterval(await cli.fetchTimetable(), ms_in_day);
}
