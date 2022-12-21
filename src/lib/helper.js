import { invoke } from '@tauri-apps/api/tauri';

export const getData = async (key) =>
	JSON.parse(await invoke('get_data', { key }));
export const setData = (key, data) =>
	invoke('set_data', { key, data: JSON.stringify(data) });
