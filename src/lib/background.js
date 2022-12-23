import dayjs from 'dayjs';
import { getData } from './helper.js';
import { fetchTimetable } from './fetch.js';

// target is just hms not ymd
export const syncTimetableProcess = async (targetTime) =>
		setTimeout(async () => {
			fetchTimetable(
				await getData('token'),
				(await getData('info')).id,
				await getData('timetable'),
			);
			syncTimetableProcess(targetTime);
		}, dayjs().diff(dayjs().startOf('day').add(targetTime), 'millisecond'));
