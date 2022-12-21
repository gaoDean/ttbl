import { invoke } from '@tauri-apps/api/tauri';
import { getData, setData } from './helper';
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

	setData('student_id', studentId);
	setData('password', password);
	setData('token', token);

	return { ok: true, status: res.status, data: token };
};

export const fetchUserInfo = async (token) => {
	const url = `${hostUrl}/token?username=${studentId}&password=${password}`;

	const res = await fetch(url);
	if (!res.ok) return res;

	const info = await res.json();
	if (!info) return serverError;

	setData('info', info);

	return { ok: true, status: res.status, data: info };
}

export const fetchTimetable = async (token, userId, oldTimetable) => {
	if (!token || Number.isInteger(token)) return serverError;

	const backward = 15;
	const forward = 15;

	const url = `${hostUrl}/timetable/${token}/${userId}?dayMinus=${backward}&dayPlus=${forward}&shorten=true`;

	const res = await fetch(url);

	if (!res.ok) {
		if (oldTimetable === undefined) {
			return res; // first time logging in
		}
		return fetchTimetable(
			fetchToken(getData('student_id'), getData('password')),
			userId,
			[],
		);
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

	setData('timetable', mergedTimetable);

	return res;
}

export const fetchEvents = async (token, userId, oldEvents) => {
	if (!token || Number.isInteger(token)) return serverError;

	const backward = 15;
	const forward = 15;

	const url = `${hostUrl}/events/${token}/${userId}?dayMinus=${backward}&dayPlus=${forward};

	const res = await fetch(url);

	if (!res.ok) {
		if (oldEvents === undefined) {
			return res; // first time logging in
		}
		return fetchEvents(
			fetchToken(getData('student_id'), getData('password')),
			userId,
			[],
		);
	}

	const events = (await res.json()).data.events;
	if (!events) return serverError;

	const mergedEvents = pipe(
		events,
		map((x) => formatValues(x)),
		concat(oldEvents),
		sort((a, b) => !dayjs(a.startTime).isBefore(dayjs(b.startTime))),
		dedup((a, b) => a.id !== b.id),
	);

	setData('events', mergedEvents);

	return res;
}
