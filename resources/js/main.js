let datadir = '~/.local/share/ttbl'
let cachedir = '~/.cache/ttbl'

async function getClasses() {
	let classes = await Neutralino.os.execCommand('ttbl -3 -mro');
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

async function setClassesToTray() {
	let classes = await getClasses()
	let tray = {
		icon: '/resources/icons/trayIcon.png',
		menuItems: []
	};
	for (const cls in classes) {
		tray.menuItems.push({
				id: classes[cls]['period'],
				text: (classes[cls]['period'] + '  -  ' + classes[cls]['class'])
		}, {
				text: '-'
		});
	}
	tray.menuItems.push({
		text: '-'
	}, {
		id: 'opts',
		text: 'Options'
	}, {
		id: 'quit',
		text: 'Quit'
	});
	await Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
	let id = event.detail.id
	switch (id) {
		case 'quit':
			Neutralino.app.exit();
			break;
		case 'opts':
			break;
	}
}

Neutralino.init();
await Neutralino.window.hide();
setClassesToTray()
console.log(await Neutralino.window.isVisible());
await Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked);

// console.log(classes);
