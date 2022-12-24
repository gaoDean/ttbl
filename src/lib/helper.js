import { invoke } from '@tauri-apps/api/tauri';
import { fetchTimetable } from './fetch.js';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

export const log = (msg) => invoke('log', { time: dayjs().format(), msg });

export const getData = async (key) => {
	try {
		const data = await invoke('get_data', { key });
		return JSON.parse(data);
	} catch {
		return undefined;
	}
};

export const setData = (key, data) =>
	invoke('set_data', { key, data: JSON.stringify(data) });

export const clearData = () => invoke('clear_all_data');

export const timeToDuration = (timeString) =>
	dayjs.duration({
		hours: Number(timeString.slice(0, timeString.indexOf(':'))),
		minutes: Number(timeString.slice(timeString.indexOf(':') + 1)),
	});

export const getSetting = async (topic, optionName) => {
	const opt = (await getData('settings'))[topic].options[optionName];
	switch (opt.type) {
		case 'time':
			return timeToDuration(opt.value)
		default:
			return undefined;
	}
};


export const syncTimetableProcess = async () => {
	const time = dayjs().startOf('day').add(await getSetting('datetime', 'syncTime'));
	const checkedTime = time.isBefore(dayjs()) ? time.add(1, 'day') : time;
	const msUntilTime = checkedTime.diff(dayjs());
	log(`Syncing timetable at ${checkedTime.format()}, in ${msUntilTime}ms`);
	setTimeout(async () => {
		fetchTimetable(
			await getData('token'),
			(await getData('info')).id,
			await getData('timetable'),
		);
		syncTimetableProcess();
	}, msUntilTime);
}
