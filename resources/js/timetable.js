export async function getClasses() {
	let classes = await Neutralino.os.execCommand('resources/modules/ttbl-cli/src/ttbl -3 -mro');
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
