import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import { dedup, sort, map, concat, pipe } from './functional';

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

	const { token } = await res.json();
	if (!token) return serverError;

	invoke('set_data', {
		key: 'token',
		data: token,
	});
	invoke('set_login_details', {
		id: studentId,
		password,
	});

	return { ok: true, status: 200, data: token };
};

export const fetchTimetable = async (token, oldTimetable) => {
	if (!token || Number.isInteger(token)) return serverError;

	const bias = -30; // TODO: remove this after the holidays
	const backward = 15 + bias;
	const forward = 15 + bias;

	const url = `${hostUrl}/timetable/${token}?dayMinus=${backward}&dayPlus=${forward}&shorten=true`;

	const res = await fetch(url);

	if (!res.ok) {
		if (oldTimetable === undefined) {
			return res; // first time logging in
		}
		return fetchTimetable(fetchToken(invoke('get_login_details')), undefined);
	}

	const timetable = (await res.json()).data.classes;
	if (!timetable) return serverError;

	const mergedTimetable = pipe(
		timetable,
		map((x) => formatValues(x)),
		concat(oldTimetable),
		sort((a, b) => !dayjs(a.startTime).isBefore(dayjs(b.startTime))),
		dedup((a, b) => a.id !== b.id),
	);

	invoke('set_data', {
		key: 'timetable',
		data: JSON.stringify(mergedTimetable),
	});

	return res;
};
