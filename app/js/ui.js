/* requires { Neutralino }

	== the ui for the window == */

import { getClasses } from "./cli.js";
import { inThePast } from "./time.js";

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
	let classes = [];
	try {
		classes = await getClasses();
	}	catch(err) {
		console.log(err);
		window.location = "login.html";
		return;
	}
	let msg = classes.shift()["period"];
	if (msg == "No token provided") {
		await Neutralino.app.exit();
	}

	let main = document.getElementById("main");
	addElement(main, "h3", msg);

	let padding = "       ";
	// add all the other classes
	for (const cls in classes) {
		let cur_class = classes[cls];
		let classDiv = addElement(main, "div", "", [[ "class", "grid" ]]);
		addElement(classDiv, "div", cur_class["period"]);
		addElement(classDiv, "div", cur_class["room"]);
		addElement(classDiv, "div", cur_class["class"]);
	}
}

setClassesToUI();
