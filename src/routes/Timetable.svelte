<script>
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import 'sticksy';
import { group } from '$lib/functional.js';
import { fetchTimetable } from '$lib/fetch.js';
import { getData, getSetting } from '$lib/helper.js';
import { currentPage } from './stores.js';

dayjs.extend(dayjsAdvancedFormat);

export let selectedDate;

const getClosestClass = (datetime, nonGroupedTimetable) =>
	nonGroupedTimetable.reduce(
		(closest, subject) => {
			const difference = Math.abs(datetime.diff(subject.startTime));
			if (difference < closest.difference) {
				return {
					difference,
					subject,
				};
			}
			return closest;
		},
		{ difference: Infinity },
	).subject;

const findClassElement = (classid) =>
	document.querySelector(`article[data-classid="${classid}"]`);

const scrollToClassElement = (classid) =>
	findClassElement(classid).scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'center',
	});

const getTrayText = (classes) =>
	classes
		? classes.reduce((acc, val) => {
				const padding = '        ';
				if (val.__typename !== 'Class') return acc;
				const roomPadding = padding.slice(-(padding.length - val.room.length));
				const text = `${val.periodName}\t${val.room}${roomPadding}\t${val.description}`;
				return [...acc, { done: val.done, id: val.id, text }];
		  }, [])
		: [];

const getDisplayTimeRange = (a, b) =>
	`${dayjs(a).format('h:mm A')} to ${dayjs(b).format('h:mm A')}`;

const getDisplayDate = (subjectOrDate) =>
	(dayjs.isDayjs(subjectOrDate)
		? subjectOrDate
		: dayjs(subjectOrDate.startTime)
	).format('dddd, MMMM Do');

let dayRolloverTime;
let parsedTimetable;
let nextClass;
let timetable;
let timetableRes;
let currentTime = dayjs();

$: {
	parsedTimetable = timetableRes
		? timetableRes.map((subject) => ({
				...subject,
				done: currentTime.isAfter(dayjs(subject.endTime)),
				room: subject.room || 'N/A',
				periodName: subject.periodName == 'Community_Life' ? 'L' : subject.periodName,
		  }))
		: undefined;
	timetable = parsedTimetable
		? group(parsedTimetable, (subject) =>
				dayjs(subject.startTime).format('YYYYMMDD'),
		  )
		: undefined;
	nextClass = parsedTimetable
		? parsedTimetable.find((x) => !x.done)
		: undefined;
	if (nextClass) {
		// sets off chain reaction of the redefining of reactive statements
		// reload data at the end of nextClass
		setTimeout(
			() => {
				currentTime = dayjs();
			},
			dayjs(nextClass.endTime)
				.add(100, 'millisecond') // 100 millisecond buffer
				.diff(currentTime),
		);
	}
	invoke('add_to_tray', {
		items:
			(timetable && dayRolloverTime
				? getTrayText(
						timetable[
							(currentTime.isAfter(
								currentTime.startOf('day').add(dayRolloverTime),
							) // is after dayRolloverTime
								? currentTime.add(1, 'day') // display next day
								: currentTime
							).format('YYYYMMDD')
						],
				  )
				: []) || [],
		date: getDisplayDate(
			currentTime.isAfter(currentTime.startOf('day').add(dayRolloverTime)) // is after dayRolloverTime
				? currentTime.add(1, 'day') // display next day
				: currentTime,
		),
	});
}
$: if (selectedDate && parsedTimetable)
	scrollToClassElement(
		getClosestClass(dayjs(selectedDate), parsedTimetable).id,
	);

onMount(async () => {
	timetableRes = await getData('timetable');
	if (!timetableRes) {
		$currentPage = 'login';
		return;
	}

	dayRolloverTime = await getSetting('datetime', 'dayRolloverTime');

	window.setTimeout(() => {
		scrollToClassElement(getClosestClass(currentTime, parsedTimetable).id);
		window.Sticksy.initializeAll('.date', { topSpacing: 40 });
	}, 1); // needs small delay for dom to update
});

listen('sync-timetable-clicked', async () => {
	let notif;
	try {
		const status = await fetchTimetable(
			await getData('token'),
			(
				await getData('info')
			).id,
			await getData('timetable'),
		);
		if (status.ok) {
			notif = 'Sync successful';
			window.location.reload(true);
		} else {
			notif = `Sync unsuccessful, error ${status.status}`;
		}
	} catch (err) {
		notif = `Sync unsuccessful, error ${err}`;
	}
	invoke('create_notification', { msg: notif });
});

listen('tray-class-clicked', (event) => {
	appWindow.show();
	appWindow.setFocus();
	scrollToClassElement(event.payload.data);
});
</script>

<div class="timetable-container" style="padding-top: 20px">
	{#if timetable}
		{#each Object.entries(timetable) as [key, day] (key)}
			<div class="full-day" data-timetablekey={key}>
				<div class="date-container">
					<h4 class="date">{getDisplayDate(day[0])}</h4>
				</div>
				<div class="classes-container">
					{#each day as subject}
						{#if subject.__typename === 'Class'}
							<article
								class={subject.done ? 'disabled' : ''}
								data-classid={subject.id}
							>
								<hgroup>
									<h4 style="display: inline">{subject.description}</h4>
									<small style="display: inline; float: right"
										>{getDisplayTimeRange(
											subject.startTime,
											subject.endTime,
										)}</small
									>
									<h6>{subject.room + ' Period ' + subject.periodName + ''}</h6>
									<p>{subject.teacherName}</p>
								</hgroup>
							</article>
						{:else}
							<article
								class={subject.done ? 'disabled' : ''}
								data-classid={subject.id}
								style="padding-bottom: 1rem"
							>
								<hgroup>
									<h4 style="display: inline">{subject.title}</h4>
									<small style="display: inline; float: right"
										>{getDisplayTimeRange(
											subject.startTime,
											subject.endTime,
										)}</small
									>
									<h6>
										{subject.location
											? subject.location.details
											: '(No suggested location)'}
									</h6>
									<span style="white-space: pre-line"
										>{subject.description}</span
									>
								</hgroup>
							</article>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
article {
	padding-top: calc(var(--spacing));
	padding-bottom: 1px;
	margin-top: var(--spacing);
	margin-bottom: calc(var(--spacing) / 2);
}

hgroup {
	margin: 0px !important;
}

.disabled {
	opacity: 0.5;
}

.full-day {
	display: flex;
	flex-direction: row;

	margin-bottom: 5rem;

	scroll-snap-type: x mandatory;
	scroll-snap-type: mandatory;
	-ms-scroll-snap-type: mandatory;
	-webkit-scroll-snap-type: mandatory;
	-webkit-scroll-snap-destination: 0% 0%;
	-webkit-overflow-scrolling: touch;
}

.classes-container {
	width: 100%;
}

.date-container {
	width: 20rem;
	padding-left: 4px;
}

.date {
	width: 90%;
}
</style>
