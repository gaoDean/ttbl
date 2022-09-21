/* requires { Neutralino, dayjs }

	== sets up the tray menu == */

// import { getClasses, fetchTimetable } from "./helper/cli.js";
import { fetchTimetable } from "./helper/impure.js";
import { inThePast } from "./helper/time.js";

const FUTURE_MAX = 10;
const PAST_MAX = 10;

async function overview(classes, date) {
	let msg;
	if (!classes) { // if there are no classes on that day
		if (date.format("d") != 0 && date.format("d") != 6) {
			msg = "It's " + date.format("dddd") + ". If it's not a holiday then something went wrong, try syncing the timetable again";
		}	else {
			// its a weekend
			msg = "It's " + date.format("dddd") + ". There's no classes today, go do something productive.";
		}
	}	else {
		msg = "It's " + date.format("dddd") + ".";
	}
	return msg;
}

async function setClassesToTray() {
	let classes = [];
	let date = dayjs().subtract(6, "day")
	try {
		classes = JSON.parse(await Neutralino.storage.getData("timetable"));
	}	catch(err) {
		console.log("msg: Timetable not found");
		try {
			fetchTimetable(FUTURE_MAX, PAST_MAX);
		}	catch(err) {
			console.log(err);
		}
		return;
	}
	console.log(classes);
	console.log(date.format("YYYYMMDD"))
	classes = classes[date.format("YYYYMMDD")]; // the day's classes

	let tray = {
		icon: "/app/img/trayIcon.png",
		menuItems: []
	};

	tray.menuItems.push({
		id: "date",
		text: await overview(!!classes, date)
	}, {
		text: "-"
	});

	let padding = "       ";
	// add all the other classes
	for (const cls in classes) {
		let cur_class = classes[cls];
		let rpad = padding.substring(classes[cls]["room"].length);
		let shownText = `${classes[cls]["periodName"]}\t` // join
			+ `${classes[cls]["room"]}${rpad}\t`
			+ `${classes[cls]["description"]}`;
		// this adds the class to the tray menu
		tray.menuItems.push({
				id: classes[cls]["periodName"],
				text: shownText,
				isDisabled: inThePast(cur_class["endTime"])
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
				await fetchTimetable(FUTURE_MAX, PAST_MAX);
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
