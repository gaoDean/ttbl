const invoke = window.__TAURI__.invoke

async function test() {
	console.log("started");
	invoke("add_timetable_to_tray", { timetableJson: JSON.stringify([ {
		id: "258336-20220912",
		title: "W09HTULA2",
		description: "House Tutor",
		startTime: "2022-09-11T22:30:00.000Z",
		endTime: "2022-09-11T22:40:00.000Z",
		dayOrder: 1,
		periodOrder: 2,
		periodName: "0",
		colour: "#FF0000",
		room: "F3",
		teacherName: "Mr Sebastian Hales, Mr Robert Bishop",
		__typename: "Class",
		detailedName: "HOUSE TUTOR W09"} ]), msg: "test", extraMsg: "test" });
	console.log("ended");
}

test();
