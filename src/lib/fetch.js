import { invoke } from '@tauri-apps/api/tauri';
import { dedup, sort, filter, map, concat, pipe } from './functional';
import dayjs from 'dayjs';

const hostUrl = 'https://caulfieldsync.vercel.app/api';
const serverError = {
	ok: false,
	status: 500,
};

const formatValues = (classValues) => ({
	...classValues,
	room: classValues.room ? classValues.room : 'N/A',
});

export const fetchToken = async (studentId, password) => {
	const url = `${hostUrl}/token?username=${studentId}&password=${password}`;

	const res = await fetch(url);
	if (!res.ok) return res;

	const token = (await res.json())['token'];
	if (!token) return serverError;

	invoke('set_data', {
		key: 'token',
		data: token,
	});
	invoke('set_login_details', {
		id: studentId,
		password: password,
	});

	return { ok: true, status: 200, data: token };
};

export const fetchTimetable = async (token, oldTimetable) => {
	if (!token || !isNaN(token)) return serverError;

	const bias = -30; // TODO: remove this after the holidays
	const backward = 15 + bias;
	const forward = 15 + bias;

	const url = `${hostUrl}/timetable/${token}?dayMinus=${backward}&dayPlus=${forward}&shorten=true`;

	console.log(url);

	const res = await fetch(url);

	if (!res.ok) {
		if (oldTimetable === undefined) {
			return res; // first time logging in
		} else {
			return fetchTimetable(fetchToken(invoke('get_login_details')), undefined);
		}
	}

	const timetable = (await res.json())['data']['classes'];
	if (!timetable) return serverError;

	const merged_timetable = pipe(
		timetable,
		map((x) => format_values(x)),
		concat(oldTimetable),
		sort((a, b) => !dayjs(a.startTime).isBefore(dayjs(b.startTime))),
		dedup((a, b) => a.id !== b.id),
	);

	invoke('set_data', {
		key: 'timetable',
		data: JSON.stringify(merged_timetable),
	});

	return res;
};
