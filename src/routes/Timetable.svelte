<script>
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import 'sticksy';
import { bucket } from '$lib/functional.js';
import { fetchTimetable } from '$lib/fetch.js';

let parsedTimetable;
let nextClass;
let title;

dayjs.extend(dayjsAdvancedFormat);

export let needsLogin;

const getCurrentHoveredDay = (selected, timetable) => {
	const elementsAtCenter = document.elementsFromPoint(
		window.innerWidth / 2,
		window.innerHeight / 2,
	);
	if (elementsAtCenter.length > 0) {
		const dayElement = elementsAtCenter.find((x) =>
			x.hasAttribute('data-timetablekey'),
		);
		const key = dayElement
			? dayElement.getAttribute('data-timetablekey')
			: undefined;
		return key ? timetable[key][0] : selected;
	}
	return selected;
};

const getDisplayDate = (selected) => {
	const selectedDate = dayjs.isDayjs(selected)
		? selected
		: dayjs(selected.startTime);
	return selectedDate.format('dddd, MMMM Do');
};

let timetable;
let selectedDay;
let timetableRes;
/* let currentTime = dayjs('2022-09-13T23:35:00.000Z'); */
let currentTime = dayjs();

const reloadData = () => {
	// sets off chain reaction of the redefining of reactive statements
	currentTime = dayjs();
};

$: title = selectedDay ? getDisplayDate(selectedDay) : 'Loading...';
$: parsedTimetable = timetableRes
	? timetableRes.map((subject) => ({
			...subject,
			done: currentTime.isAfter(dayjs(subject.startTime)),
			room: subject.room || 'N/A',
	  }))
	: undefined;
$: timetable = parsedTimetable
	? bucket(parsedTimetable, (subject) =>
			dayjs(subject.startTime).format('YYYYMMDD'),
	  )
	: undefined;
$: nextClass = parsedTimetable
	? parsedTimetable.find((x) => !x.done)
	: undefined;
$: invoke('add_to_tray', {
	items:
		(timetable ? timetable[currentTime.format('YYYYMMDD')] : undefined) || [],
	date: getDisplayDate(currentTime),
});
$: if (nextClass)
	setTimeout(reloadData, currentTime.diff(dayjs(nextClass.startTime)));

onMount(async () => {
	timetableRes = await invoke('get_timetable');
	if (!timetableRes) {
		needsLogin = true;
		return;
	}

	selectedDay = getCurrentHoveredDay(selectedDay, timetable);
	window.addEventListener('scroll', () => {
		selectedDay = getCurrentHoveredDay(selectedDay, timetable);
	});

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
				`article[data-startTime="${closestClassToCurrentTime.startTime}"]`,
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
			await invoke('get_token'),
			await invoke('get_timetable'),
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
