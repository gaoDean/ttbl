import * as timetable from "./timetable.js";

export async function setClassesToTray() {
	let classes = await timetable.getClasses();
	let tray = {
		icon: '/resources/img/trayIcon.png',
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
		text: 'Preferences...'
	}, {
		id: 'quit',
		text: 'Quit Timetable'
	});
	await Neutralino.os.setTray(tray);
}
await Neutralino.events.on('trayMenuItemClicked', async () => {
	let id = event.detail.id;
	switch (id) {
		case 'quit':
			Neutralino.app.exit();
			break;
		case 'opts':
			await Neutralino.window.show();
			break;
	}
});
