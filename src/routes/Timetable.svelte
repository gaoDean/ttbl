<script>
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api/tauri';
import { chunk } from '$lib/functional';
import { fetchTimetable } from '$lib/fetch';
import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(dayjsAdvancedFormat);

export let needsLogin;

let timetable;
let timetableElement;
let timetableBoundaryCenterPoint;
let selectedClass;
$: title = selectedClass ? getDisplayDate(selectedClass) : 'Loading...';

const refreshSelectedClass = () => {
	console.log('test');
	selectedClass = timetableElement.getElementFromPoint(
		timetableBoundarySize.x / 2,
		timetableBoundarySize.y / 2,
	);
};

const getDisplayDate = (selected) => {
	const selectedDate = dayjs(selected.startTime);
	return selectedDate.format('dddd, MMMM Do');
};

onMount(async () => {
	const res = await invoke('get_timetable');
	if (!res) {
		needsLogin = true;
		return;
	}
	timetable = chunk(res, (subject) =>
		dayjs(subject.startTime).format('YYYYMMDD'),
	);

	console.log(timetable);

	const boundary = timetableElement.getBoundingClientRect();
	timetableBoundaryCenterPoint = {
		x: (boundary.left + boundary.right) / 2,
		y: (boundary.top + boundary.bottom) / 2,
	};
	selectedClass = document.elementFromPoint(
		timetableBoundaryCenterPoint.x,
		timetableBoundaryCenterPoint.y,
	);
});

// setInterval(updateUI, 5 * 60 * 1000); // every five mins
// const time = new Date();
// const secondsRemaining = (60 - time.getSeconds()) * 1000;
</script>

<h3 style="line-height: 56px">{title}</h3>
<div bind:this={timetableElement} style="padding-top: 20px">
	{#if timetable}
		{#each timetable as day}
			<div class="fullDayContainer">
				<h4 class="dayText" >{getDisplayDate(day[0])}</h4>
				<div class="classesContainer">
				{#each day as item}
						<article
							class={Number(item.periodName) <= 0 ? 'disabled' : ''}
							>
							<hgroup>
								<h4 style="display: inline">{item.description}</h4>
								<small style="display: inline; float: right"
									>Period {item.periodName}</small
								>
								<h6>{item.room}</h6>
								<p>{item.teacherName}</p>
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

.message {
	text-align: center;
	margin: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}
.disabled {
	opacity: 0.5;
}

.fullDayContainer {
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

.classesContainer {
	width: 100%;
}

.dayText {
	margin-top: 2rem;
	width: 18rem;
}
</style>
