async function ttblRun(params) {
	let path = NL_PATH;
	if (NL_PATH == ".") {
		path += "/modules/ttbl-cli/src";
	}
	return await Neutralino.os.execCommand(path + "/ttbl " + params);
}

export async function fetchTimetable() {
	let output = await ttblRun("--sync 14 2");
	if (output.exitCode > 0) {
		throw new Error("Couldn't fetch timetable");
	}
}

export async function fetchToken(student_id, pass) {
	let output = await ttblRun(`--token "${student_id}" "${pass}"`);
	console.log(output.exitCode)
	if (output.exitCode > 0) {
		throw new Error("Couldn't fetch token");
	}
}

export async function getClasses() {
	let classes = await ttblRun("-3 --mro")
	if (classes.exitCode > 0) {
		throw new Error("No token provided");
	}
	classes = classes.stdOut.split(/\r?\n/).filter(element => element);
	for (let sub in classes) {
		classes[sub] = classes[sub].split(/;/).filter(element => element);
		let subject = {};
		subject["period"] = classes[sub][0];
		subject["room"] = classes[sub][1];
		subject["class"] = classes[sub][2];
		classes[sub] = subject;
	}
	return classes;
}
