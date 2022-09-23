/* requires { Neutralino, dayjs }

	== the user interface == */

import { getTimetable, fetchTimetable } from "./helper/impure.js";
import { inThePast, getMessage } from "./helper/time.js";

let date = dayjs();
let centered = true;

function changeDate(offset) {
	date = date.add(offset, "day");
	updateUI();
	centered = false;
}

// adds <tag> with <inner> to <parent_element>, returns the newly appended node
// attributes = { { <attr>, <value> }, { <attr>, <value> } };
function addElement(parent_element, tag, inner, attributes)
{
	let element = document.createElement(tag);
	element.textContent = inner;
	for (let attr in attributes) {
		element.setAttribute(attributes[attr][0], attributes[attr][1]);
	}
	return parent_element.appendChild(element);
}

function addNestedElement(parent_element, tag1, tag2, inner, attributes)
{
	let element = addElement(parent_element, tag1);
	return addElement(element, tag2, inner, attributes);
}

async function updateUI()
{
	let ymd = date.format("YYYYMMDD");
	let main = document.getElementById("main");

	let timetable = await getTimetable();
	if (!timetable) {
		return;
	}
	let msg = getMessage(timetable, ymd);
	timetable = timetable[ymd];

	setClassesToGui(timetable, msg);
	setClassesToTray(timetable, msg);
}

async function setClassesToGui(timetable, msg) {
	let main = document.getElementById("main");
	main.innerHTML = "";
	addElement(main, "h3", msg);

	// add all the other classes
	for (const i in timetable) {
		let cur_class = timetable[i];
		let classGroup = addNestedElement(main, "article", "hgroup", "");

		addElement(classGroup, "h4", cur_class["description"], [[ "style", "display: inline" ]]);
		addElement(classGroup, "small", "Period " + cur_class["periodName"], [[ "style", "display: inline; float: right" ]]);
		addElement(classGroup, "h6", cur_class["room"]);
		addElement(classGroup, "p", cur_class["teacherName"]);
	}
}

async function setClassesToTray(timetable, msg) {
	let tray = {
		icon: "/app/img/trayIcon.png",
		menuItems: []
	};

	tray.menuItems.push({
		id: "date",
		text: msg
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
		id: "more",
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
			fetchTimetable().then(updateUI());
			break;
		case "more":
			await Neutralino.window.show(); // show the window
			break;
	}
});

function addListeners() {
	window.addEventListener("scroll", () => {
		let x = window.pageXOffset;
		let threshold = 1;
		if (centered) {
			if (x < -(threshold)) {
				changeDate(-1);
			}	else if (x > threshold) {
				changeDate(1);
			}
		}	else if (x > -(threshold) && x < threshold) {
			centered = true;
		}
		console.log(x);
	});
}

updateUI();
addListeners();

// i have nowhere else to put this
import { scheduleSync } from "./helper/time.js";
scheduleSync("08", "00", "00"); // run in background
