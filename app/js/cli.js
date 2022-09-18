// many helper functions

// run a ttbl command
async function ttblRun(params) {
	let path = NL_PATH;
	// when building, the ttbl-cli binary gets put in ./
	if (NL_PATH == ".") {
		path += "/modules/ttbl-cli/src"; // when "neu run", ttbl is in that path
	}
	return await Neutralino.os.execCommand(path + "/ttbl " + params);
}

// fetch the timetable using ttbl-cli
export async function fetchTimetable() {
	let output = await ttblRun("--sync 14 2");
	if (output.exitCode > 0) {
		throw new Error("Couldn't fetch timetable");
	}
}

// fetch the token using ttbl-cli
export async function fetchToken(student_id, pass) {
	let output = await ttblRun(`--token "${student_id}" "${pass}"`);
	console.log(output.exitCode)
	if (output.exitCode > 0) {
		throw new Error("Couldn't fetch token");
	}
}

// get today's classes using ttbl-cli
export async function getClasses() {
	let classes = await ttblRun("-3 --mro")
	if (classes.exitCode > 0) {
		throw new Error("No token provided");
	}
	classes = classes.stdOut.split(/\r?\n/).filter(element => element); // split by newline
	for (let sub in classes) {
		classes[sub] = classes[sub].split(/;/).filter(element => element); // split by delimiting colons
		let subject = {};
		subject["period"] = classes[sub][0]; // use the split values
		subject["room"] = classes[sub][1];
		subject["class"] = classes[sub][2];
		classes[sub] = subject;
	}
	return classes;
}

// schedule syncing every day
// (string 00-23, string 00-59, string 00-59) [ must be two digits ]
export function scheduleSync(hours, minutes, seconds) {
	const ms_in_day = 86400000; // 1000(ms) * 60(s) * 60(m) * 24(h)
	const desired = dayjs(dayjs().format("YYYY-MM-DDT" + hours + ":" + minutes + ":" + seconds + "Z"));
	let delta_ms = dayjs(desired.diff(dayjs())); // diff between desired time and current time
	if (delta_ms < 0) {
		delta_ms = delta_ms.add(1, "day") // if desired time has already passed, move to next day
	}

	// the following will run fetchTimetable at the desired time every day
	setTimeout(setupInterval, delta_ms); // run setupInterval() in delta_ms milliseconds
	async function setupInterval() {
		// run fetchTimetable() every day
		setInterval(await fetchTimetable(), ms_in_day);
	}
}
