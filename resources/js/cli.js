async function ttblCli(params) {
	let path = NL_PATH;
	if (NL_PATH == '.') {
		path += '/modules/ttbl-cli/src';
	}
	return await Neutralino.os.execCommand(path + '/ttbl ' + params);
}

export async function ttblSync() {
	let output = await ttblCli('--sync 14 2');
	return output.stdOut;
}

export async function getClasses() {
	let classes = await ttblCli('-0 --mro')
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
