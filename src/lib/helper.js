import { invoke } from '@tauri-apps/api/tauri';

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
