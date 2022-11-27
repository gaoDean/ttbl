<script>
import { invoke } from '@tauri-apps/api/tauri';

export let needsLogin;

let title = '';
let message = '';
let periodsPassed = -1;
let timetable;

// YYYYMMDD in integer form
let ymd;

const isCurrentDate = async () => ymd === (await invoke('get_ymd'));

const updateUI = async () => {
	let ret;
	try {
		console.log(ymd);
		ret = await invoke('add_timetable_to_tray', {
			date: ymd,
			dryRun: !(await isCurrentDate()),
		});
	} catch (err) {
		// theres probably no token but try to fetch the timetable anyway
		console.log(err);
		try {
			title = 'Give us a sec, something went wrong...';
			await invoke('fetch_timetable');
			ret = await invoke('add_timetable_to_tray', { date: ymd });
		} catch (err2) {
			// couldn't fetch the timetable probs cus theres no token, go to the login screen
			console.log(err2);
			needsLogin = true;
			return;
		}
	}
	timetable = ret[0];
	title = ret[1];
	message = ret[2];
	periodsPassed = ret[3];
	console.log(ret);
};

const changeDate = async (offset) => {
	ymd = await invoke('ymd_add', { ymd, durInDays: offset });
	updateUI();
};

const setYmd = async () => (ymd = await invoke('get_ymd'));

setYmd();
updateUI();
invoke('spawn_sync_thread');

// setInterval(updateUI, 5 * 60 * 1000); // every five mins
// const time = new Date();
// const secondsRemaining = (60 - time.getSeconds()) * 1000;
</script>

<div class="grid" style="min-width: 160px; display: inline !important;">
	<h3 style="display: inline; line-height: 56px">{title}</h3>
	<div style="min-width: 120px; display: inline; float: right;">
		<button
			class="secondary"
			style="display: inline-block; max-width: 56px;"
			on:click={changeDate(-1)}>&larr;</button
		>
		<button
			class="secondary"
			style="display: inline-block; max-width: 56px;"
			on:click={changeDate(1)}>&rarr;</button
		>
	</div>
</div>
<div style="padding-top: 20px">
	{#each timetable as item}
		<article class={Number(item.periodName) <= periodsPassed ? 'disabled' : ''}>
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
<p class="message">
	{message}
</p>

<style>
article {
	padding-top: calc(var(--spacing)) !important;
	padding-bottom: calc(var(--spacing) / 2) !important;
	margin-top: var(--spacing) !important;
	margin-bottom: var(--spacing) !important;
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
</style>
