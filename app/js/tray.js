import * as cli from "./cli.js";

async function setClassesToTray() {
	let classes = []
	try {
		classes = await cli.getClasses();
	}	catch(err) {
		console.log(err);
		window.location = "login.html";
		return;
	}
	let tray = {
		icon: "/app/img/trayIcon.png",
		menuItems: []
	};

	let msg = classes.shift()["period"];
	if (msg == "No token provided") {
		await Neutralino.app.exit()
	}
	// add the Here"s <date> part
	tray.menuItems.push({
			id: "date",
			text: msg
	}, {
			text: "-"
	});
	let padding = "       "
	// add all the other classes
	for (const cls in classes) {
		let rpad = padding.substring(classes[cls]["room"].length)
		tray.menuItems.push({
				id: classes[cls]["period"],
				text: `${classes[cls]["period"]}\t${classes[cls]["room"]}${rpad}\t${classes[cls]["class"]}`
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
			await Neutralino.app.exit();
			break;
		case "sync":
			try {
				await cli.fetchTimetable();
			}	catch(err) {
				console.log(err);
			}
			break;
		case "opts":
			await Neutralino.window.show(); // show the window
			break;
	}
});

setClassesToTray()
