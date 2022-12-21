<script>
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import 'sticksy';
import { group } from '$lib/functional.js';
import { fetchTimetable } from '$lib/fetch.js';
import { getData } from '$lib/helper.js';

dayjs.extend(dayjsAdvancedFormat);

export let needsLogin;

const getTrayText = (classes) =>
	classes
		? classes.reduce((acc, val) => {
				const padding = '        ';
				if (val.__typename !== 'Class') return acc;
				const roomPadding = padding.slice(-(padding.length - val.room.length));
				const text = `${val.periodName}\t${val.room}${roomPadding}\t${val.description}`;
				return [...acc, { done: val.done, id: val.periodName, text }];
		  }, [])
		: [];

const getDisplayTimeRange = (a, b) =>
	`${dayjs(a).format('h:mm A')} to ${dayjs(b).format('h:mm A')}`;

const getDisplayDate = (selected) => {
	const selectedDate = dayjs.isDayjs(selected)
		? selected
		: dayjs(selected.startTime);
	return selectedDate.format('dddd, MMMM Do');
};

let parsedTimetable;
let nextClass;
let timetable;
let timetableRes;
/* const currentTime = dayjs('2022-09-14T01:49:59.000Z'); */
let currentTime = dayjs();

const reloadData = () => {
	// sets off chain reaction of the redefining of reactive statements
	currentTime = dayjs();
};

$: {
	parsedTimetable = timetableRes
		? timetableRes.map((subject) => ({
				...subject,
				done: currentTime.isAfter(dayjs(subject.endTime)),
				room: subject.room || 'N/A',
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
	invoke('add_to_tray', {
		items:
			(timetable
				? getTrayText(timetable[currentTime.format('YYYYMMDD')])
				: []) || [],
		date: getDisplayDate(currentTime),
	});
	if (nextClass) {
		const nextClassEnd = dayjs(nextClass.endTime).add(100, 'millisecond'); // 100 millisecond buffer
		const diff = nextClassEnd.diff(currentTime);
		setTimeout(reloadData, diff);
	}
}

onMount(async () => {
	timetableRes = await getData('timetable');
	if (!timetableRes) {
		needsLogin = true;
		return;
	}

	window.setTimeout(() => {
		const closestClassToCurrentTime = parsedTimetable.reduce(
			(closest, subject) => {
				const difference = Math.abs(currentTime.diff(subject.startTime));
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

		const elem = document
			.querySelector(
				`article[data-starttime="${closestClassToCurrentTime.startTime}"]`,
			)
			.getBoundingClientRect();

		window.scroll(elem.left, elem.top - window.innerHeight / 2);
		window.Sticksy.initializeAll('.date');
	}, 0); // needs small delay for dom to update
});

listen('fetch-timetable', async () => {
	let notif;
	try {
		const status = await fetchTimetable(
			await getData('token'),
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
</script>

<div class="timetable-container" style="padding-top: 20px">
	{#if timetable}
		{#each Object.entries(timetable) as [key, day] (key)}
			<div class="full-day" data-timetablekey={key}>
				<div>
					<h4 class="date">{getDisplayDate(day[0])}</h4>
				</div>
				<div class="classes-container">
					{#each day as subject}
						{#if subject.__typename === 'Class'}
							<article
								class={subject.done ? 'disabled' : ''}
								data-starttime={subject.startTime}
							>
								<hgroup>
									<h4 style="display: inline">{subject.description}</h4>
									<small style="display: inline; float: right"
										>Period {subject.periodName}</small
									>
									<h6>{subject.room}</h6>
									<p>{subject.teacherName}</p>
								</hgroup>
							</article>
						{:else}
							<article
								class={subject.done ? 'disabled' : ''}
								data-starttime={subject.startTime}
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

.date {
	margin-top: 2rem;
	width: 90%;
}

.timetable-container {
	z-index: -5;
}
</style>
