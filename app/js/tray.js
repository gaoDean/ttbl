/* requires { Neutralino, dayjs }

	== sets up the tray menu == */

// import { getClasses, fetchTimetable } from "./helper/cli.js";
import { fetchTimetable, getTimetable } from "./helper/impure.js";
import { inThePast, getMessage } from "./helper/time.js";

const FUTURE_MAX = 10;
const PAST_MAX = 10;

async function setClassesToTray() {
	let date = dayjs().subtract(6, "day");
	let timetable = (await getTimetable())[date.format("YYYYMMDD")]; // the day's classes
	let tray = {
		icon: "/app/img/trayIcon.png",
		menuItems: []
	};

	tray.menuItems.push({
		id: "date",
		text: await getMessage(!!timetable, date)
	}, {
		text: "-"
	});

	let padding = "       ";
	// add all the other classes
	for (const i in timetable) {
		let ptr_class = timetable[i];
		let rpad = padding.substring(ptr_class["room"].length);
		let shownText = `${ptr_class["periodName"]}\t` // join
			+ `${ptr_class["room"]}${rpad}\t`
			+ `${ptr_class["description"]}`;
		// this adds the class to the tray menu
		tray.menuItems.push({
				id: ptr_class["periodName"],
				text: shownText,
				isDisabled: inThePast(ptr_class["endTime"])
		});
	}
	// the preferences and quit options
	tray.menuItems.push({
		text: "-"
	}, {
		id: "opts",
		text: "More..."
	}, {
		id: "sync",
		text: "Sync Timetable"
	}, {
		id: "quit",
		text: "Quit Timetable"
	});
	await Neutralino.os.setTray(tray);
}

// handle the preferences and quit events
await Neutralino.events.on("trayMenuItemClicked", async () => {
	let id = event.detail.id;
	switch (id) {
		case "quit":
			Neutralino.app.exit();
			break;
		case "sync":
			try {
				await fetchTimetable();
			}	catch(err) {
				console.log(err);
			}
			setClassesToTray();
			break;
		case "opts":
			await Neutralino.window.show(); // show the window
			break;
	}
});

setClassesToTray();
