// == sets up background syncing of timetable ==

import { fetchTimetable } from "./impure.js";

// if <time> is in the past, return true
export function inThePast(time)
{
	return dayjs(time).diff(dayjs()) < 0;
}

// YYYYMMDD
export function getMessage(timetable, ymd)
{
	if (!timetable) {
		return undefined
	}
	let date = dayjs(ymd);
	let msg = `It's ${date.format("dddd")}, ${date.format("D")} ${date.format("MMMM")}.`;
	let extra = null;

	// If there are no classes today
	if (timetable[ymd] === undefined || timetable[ymd].length === 0) {
		// If the day is a weekend, i.e. Saturday or Sunday
		if (date.format("d") === '0' || date.format("d") === '6') {
			extra = "There's no classes today, go do something productive.";
		}	else {
			extra = "It's a holiday! (or something broke and syncing didn't work)";
		}
	}

	return {msg: msg, extra: extra}
}

// schedule syncing every day
// (string 00-23, string 00-59, string 00-59) [ must be two digits ]
export function scheduleSync(hours, minutes, seconds)
{
	const ms_in_day = 86400000; // 1000(ms) * 60(s) * 60(m) * 24(h)
	const desired = dayjs(dayjs().format("YYYY-MM-DDT" + hours + ":" + minutes + ":" + seconds + "Z"));
	let delta_ms = dayjs(desired.diff(dayjs())); // diff between desired time and current time
	if (delta_ms < 0) {
		delta_ms = delta_ms.add(1, "day"); // if desired time has already passed, move to next day
	}
	console.log("scheduled to run at " + dayjs(delta_ms).add(dayjs()).format());

	// the following will run fetchTimetable at the desired time every day
	setTimeout(setupInterval, delta_ms); // run setupInterval() in delta_ms milliseconds
	async function setupInterval() {
		// run fetchTimetable() every day
		setInterval(await fetchTimetable(), ms_in_day);
	}
}
