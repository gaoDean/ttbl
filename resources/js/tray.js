import * as cli from "./cli.js";

export async function setClassesToTray() {
	let classes = await cli.getClasses();
	let tray = {
		icon: '/resources/img/trayIcon.png',
		menuItems: []
	};
	// add the Here's <date> part
	tray.menuItems.push({
			id: 'date',
			text: classes.shift().period
	}, {
			text: '-'
	});
	// add all the other classes
	for (const cls in classes) {
		tray.menuItems.push({
				id: classes[cls]['period'],
				text: (classes[cls]['period'] + '  -  ' + classes[cls]['class'])
		});
	}
	// the preferences and quit options
	tray.menuItems.push({
		text: '-'
	}, {
		id: 'opts',
		text: 'More...'
	}, {
		id: 'sync',
		text: 'Sync Timetable'
	}, {
		id: 'quit',
		text: 'Quit Timetable'
	});
	await Neutralino.os.setTray(tray);
}

// handle the preferences and quit events
await Neutralino.events.on('trayMenuItemClicked', async () => {
	let id = event.detail.id;
	switch (id) {
		case 'quit':
			await Neutralino.app.exit();
			break;
		case 'sync':
			await cli.sync();
			break
		case 'opts':
			await Neutralino.window.show(); // show the window
			break;
	}
});
