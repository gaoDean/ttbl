<script>
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import { bucket } from '$lib/functional.js';
import { fetchTimetable } from '$lib/fetch.js';

let parsedTimetable;
let nextClass;
let classesToday;

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
	  }))
	: undefined;
$: timetable = parsedTimetable
	? bucket(parsedTimetable, (subject) =>
			dayjs(subject.startTime).format('YYYYMMDD'),
	  )
	: undefined;
$: classesToday = timetable
	? timetable[currentTime.format('YYYYMMDD')]
	: undefined;
$: nextClass = parsedTimetable
	? parsedTimetable.find((x) => !x.done)
	: undefined;
$: if (classesToday)
	invoke('add_to_tray', {
		items: classesToday || [],
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
				const difference = currentTime.diff(subject.startTime);
				if (currentTime.diff(subject.startTime) < closest.difference) {
					return {
						difference,
						subject,
					};
				}
				return closest;
			},
			{ difference: Infinity },
		).subject;

		document
			.querySelector(
				`article[data-startTime="${closestClassToCurrentTime.startTime}"]`,
			)
			.scrollIntoView();
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

// setInterval(updateUI, 5 * 60 * 1000); // every five mins
// const time = new Date();
// const secondsRemaining = (60 - time.getSeconds()) * 1000;
</script>

<h2 class="title">{title}</h2>
<div class="title-background" />
<div class="timetable-container" style="padding-top: 20px">
	{#if timetable}
		{#each Object.entries(timetable) as [key, day] (key)}
			<div class="full-day" data-timetablekey={key}>
				<h5 class="day-text">{getDisplayDate(day[0])}</h5>
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

.day-text {
	margin-top: 2rem;
	width: 18rem;
}

.timetable-container {
	z-index: -5;
}

.title-background {
	position: fixed;
	width: 60%;
	height: 80px;
	z-index: 1;
	background-color: #000000ff;
	filter: blur(40px);
}

.title {
	line-height: 100px;
	width: 60%;
	position: fixed;
	z-index: 2;
}
</style>
