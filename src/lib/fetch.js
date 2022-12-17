import { invoke } from '@tauri-apps/api/tauri';
import { filter, map, concat, pipe } from './functional';

const hostUrl = 'https://caulfieldsync.vercel.app/api';

const formatValues = (classValues) => ({
	...classValues,
	room: classValues.room ? classValues.room : 'N/A',
});

export const fetchToken = async (studentId, password) => {
	const url = `${hostUrl}/token?username=${studentId}&password=${password}`;

	console.log(url);

	const res = await fetch(url);
	if (res.status !== 200) return res.status;

	const token = (await res.json())['token'];
	if (!token) return 500;

	invoke('set_login_details', {
		id: studentId,
		password: password,
	});

	return token;
};

export const fetchTimetable = async (token, oldTimetable) => {
	if (!token || !isNaN(token)) return 500;

	const backward = 15;
	const forward = 15;

	const url = `${hostUrl}/timetable/${token}?dayMinus=${backward}&dayPlus=${forward}&shorten=true`;

	const res = await fetch(url);
	if (res.status != 200) {
		if (oldTimetable === undefined) {
			return res.status; // first time logging in
		} else {
			fetchTimetable(fetchToken(invoke('get_login_details')), undefined);
			return;
		}
	}

	const timetable = (await res.json())['data']['classes'];
	if (!timetable) return 500;

	const merged_timetable = pipe(
		timetable,
		map((x) => format_values(x)),
		concat(oldTimetable),
		filter((x, index) => arr.indexOf(x) === index),
	);

	invoke('set_data', {
		key: 'timetable',
		data: JSON.stringify(merged_timetable),
	});

	return merged_timetable;
};
