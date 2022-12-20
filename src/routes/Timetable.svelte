<script>
import { onMount, onDestroy } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { bucket } from '$lib/functional';
import { fetchTimetable } from '$lib/fetch';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
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
};

const getDisplayDate = (selected) => {
	const selectedDate = dayjs.isDayjs(selected)
		? selected
		: dayjs(selected.startTime);
	return selectedDate.format('dddd, MMMM Do');
};

let fetchListenerUnsubscribe;
let timetable;
let selectedDay;
$: title = selectedDay ? getDisplayDate(selectedDay) : 'Loading...';

onMount(async () => {
	const res = await invoke('get_timetable');
	if (!res) {
		needsLogin = true;
		return;
	}

	const currentTime = dayjs();
	timetable = bucket(
		res.map((subject) => ({
			...subject,
			done: currentTime.isAfter(dayjs(subject.startTime)),
		})),
		(subject) => dayjs(subject.startTime).format('YYYYMMDD'),
	); // splits array into 'buckets'

	selectedDay = getCurrentHoveredDay(selectedDay, timetable);

	window.addEventListener('scroll', () => {
		selectedDay = getCurrentHoveredDay(selectedDay, timetable);
	});

	const classesToday = timetable[currentTime.format('YYYYMMDD')];
	invoke('add_to_tray', {
		items: classesToday || [],
		date: getDisplayDate(currentTime),
	});

	fetchListenerUnsubscribe = await listen('fetch-timetable', async (event) => {
		try {
			const res = await fetchTimetable(
				await invoke('get_token'),
				await invoke('get_timetable'),
			);
			if (res.ok) {
				invoke('create_notification', { msg: 'Sync successful' });
			} else {
				invoke('create_notification', {
					msg: 'Sync unsuccessful, error ' + res.status,
				});
			}
		} catch (err) {
			console.log(err);
			invoke('create_notification', { msg: 'Sync unsuccessful, error ' + err });
		}
	});
});

onDestroy(() => {
	// with HMR, it resubscribes every time the window loads
	fetchListenerUnsubscribe();
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
						<article class={subject.done ? 'disabled' : ''}>
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
	height: 70px;
	z-index: 1;
	background-color: #000000dd;
	filter: blur(20px);
}

.title {
	line-height: 100px;
	width: 60%;
	position: fixed;
	z-index: 2;
}
</style>
