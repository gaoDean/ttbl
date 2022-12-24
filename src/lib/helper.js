import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';

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

export const getSetting = async (topic, optionName) => {
	const opt = (await getData('settings'))[topic].options[optionName];
	return opt.parse(opt.value);
};

export const timeToDuration = (timeString) =>
	dayjs.duration({
		hours: timeString.slice(0, timeString.indexOf(':')),
		minutes: timeString.slice(timeString.indexOf(':')),
	});
