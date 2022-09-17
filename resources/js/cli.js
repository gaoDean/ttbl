async function ttblCli(params) {
	return await Neutralino.os.execCommand(NL_PATH + '/ttbl ' + params);
}

export async function ttblSync() {
	await ttblCli('-sync 14 2')
}

export async function getClasses() {
	let classes = await ttblCli('-3 -mro')
	classes = classes.stdOut.split(/\r?\n/).filter(element => element);
	for (let sub in classes) {
		classes[sub] = classes[sub].split(/;/).filter(element => element);
		let subject = {};
		subject['period'] = classes[sub][0];
		subject['room'] = classes[sub][1];
		subject['class'] = classes[sub][2];
		classes[sub] = subject;
	}
	return classes;
}
