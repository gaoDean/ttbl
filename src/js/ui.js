//	== the user interface ==

import { getTimetable, fetchTimetable } from "./helper/impure.js";
import { inThePast, getMessage } from "./helper/time.js";

const invoke = window.__TAURI__.invoke;

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

	let timetable = await getTimetable();
	let message = getMessage(timetable, ymd);
	timetable = timetable[ymd] ? timetable[ymd] : [];

	invoke("add_timetable_to_tray", {
		timetableJson: JSON.stringify(timetable),
		msg: message["msg"],
		extraMsg: message["extra"]
	});

	setClassesToGui(timetable,
		message["msg"],
		message["extra"]
	);

}

async function setClassesToGui(timetable, msg, extra) {
	let main = document.getElementById("timetable");
	main.innerHTML = "";
	document.getElementById("message").innerText = msg;

	if (extra) {
		main.innerHTML += `<p style="text-align: center; margin: 0; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">${extra}</p>`;
	}

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

function addListeners() {
	// window.addEventListener("scroll", () => {
	// 	let x = window.pageXOffset;
	// 	let threshold = 1;
	// 	if (centered) {
	// 		if (x < -(threshold)) {
	// 			changeDate(-1);
	// 		}	else if (x > threshold) {
	// 			changeDate(1);
	// 		}
	// 	}	else if (x > -(threshold) && x < threshold) {
	// 		centered = true;
	// 	}
	// });
	document.getElementById("date-past").addEventListener("click", () => changeDate(-1));
	document.getElementById("date-future").addEventListener("click", () => changeDate(1));
}

updateUI();
addListeners();

// i have nowhere else to put this
import { scheduleSync } from "./helper/time.js";
scheduleSync("08", "00", "00"); // run in background
