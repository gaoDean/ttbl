import { invoke } from '@tauri-apps/api/tauri';
import { getData, setData } from './helper';
import dayjs from 'dayjs';
import { dedup, sort, map, concat, flat, pipe } from './functional';

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

	setData('student_id', studentId);
	setData('password', password);
	setData('token', token);

	return { ok: true, status: res.status, data: token };
};

export const fetchUserInfo = async (token) => {
	const url = `${hostUrl}/userInfo/${token}`;

	const res = await fetch(url);
	if (!res.ok) return res;

	const info = await res.json();
	if (!info) return serverError;

	setData('info', info);

	return { ok: true, status: res.status, data: info };
};

export const fetchTimetable = async (token, userID, oldTimetable) => {
	if (!token || Number.isInteger(token)) return serverError;

	const backward = 30;
	const forward = 15;

	const fetches = [
		fetch(
			`${hostUrl}/timetable/${token}/${userID}?dayMinus=${backward}&dayPlus=${forward}&shorten=true`,
		),
		fetch(
			`${hostUrl}/events/${token}/${userID}?dayMinus=${backward}&dayPlus=${forward}`,
		),
	];

	const res = await Promise.all(fetches);

	res.forEach((response) => {
		if (!response.ok) {
			if (oldTimetable === undefined) {
				return response; // first time logging in
			}
			return fetchTimetable(
				fetchToken(getData('student_id'), getData('password')),
				userID,
				[],
			);
		}
	});

	const data = await res.reduce(
		async (acc, val, idx) => [
			...(await acc),
			(await val.json()).data[idx === 0 ? 'classes' : 'events'],
		],
		[],
	);
	console.log(data);
	if (!data[0] || !data[1]) return serverError;

	const mergedTimetable = pipe(
		data,
		flat(1), // merge timetable and events
		map((x) => formatValues(x)),
		concat(oldTimetable),
		sort((a, b) => !dayjs(a.startTime).isBefore(dayjs(b.startTime))),
		dedup((a, b) => a.id !== b.id),
	);

	setData('timetable', mergedTimetable);

	return { ok: true, status: res[0].status, data: mergedTimetable };
};
