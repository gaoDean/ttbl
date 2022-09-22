/* requires { Neutralino }

	== the ui for the window == */

import { getTimetable } from "./helper/impure.js";
import { inThePast, getMessage } from "./helper/time.js";

// adds <tag> with <inner> to <parent_element>, returns the newly appended node
// attributes = { { <attr>, <value> }, { <attr>, <value> } };
function addElement(parent_element, tag, inner, attributes) {
	let element = document.createElement(tag);
	element.textContent = inner;
	for (let attr in attributes) {
		element.setAttribute(attributes[attr][0], attributes[attr][1]);
	}
	return parent_element.appendChild(element);
}

function addElementRecurse(parent_element, tag1, tag2, inner, attributes) {
	let element = addElement(parent_element, tag1);
	return addElement(element, tag2, inner, attributes);
}

async function setClassesToUI() {
	let date = dayjs().subtract(6, "day");
	let timetable = (await getTimetable())[date.format("YYYYMMDD")]; // the day's classes

	let main = document.getElementById("main");
	addElement(main, "h3", getMessage(!!timetable, date));

	// add all the other classer
	for (const i in timetable) {
		let cur_class = timetable[i];
		let classArt = addElement(main, "article", "");
		let classDiv = addElement(classArt, "hgroup", "");
		addElement(classDiv, "h4", cur_class["description"], [[ "style", "text-align: left; display: inline !important;" ]]);
		addElement(classDiv, "small", "Period " + cur_class["periodName"], [[ "style", "display: inline; float: right" ]]);
		addElement(classDiv, "h6", cur_class["room"]);
		addElement(classDiv, "p", cur_class["teacherName"]);
	}
}

setClassesToUI();

// i have nowhere else to put this
import { scheduleSync } from "./helper/time.js";
scheduleSync("08", "00", "00");
