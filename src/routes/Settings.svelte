<script>
import { onMount } from 'svelte';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { getData, setData, clearData } from '$lib/helper.js';
import InfoModal from '$lib/InfoModal.svelte';
import ConfirmModal from '$lib/ConfirmModal.svelte';

dayjs.extend(dayjsDuration);

const save = (settings) => setData('settings', settings);

const timeToDuration = (timeString) =>
	dayjs.duration({
		hours: timeString.slice(0, timeString.indexOf(':')),
		minutes: timeString.slice(timeString.indexOf(':')),
	});

export let currentPage;

let settings;
let infoModal;
let confirmModal;

const buttons = [
	{
		name: 'User',
		options: [
			{
				name: 'Get user info',
				func: async () => {
					infoModal = {
						title: 'User info',
						body: JSON.stringify(await getData('info')),
					};
				},
			},
			{
				name: 'Logout and clear user data',
				func: async () => {
					confirmModal = {
						body: 'Are you sure you want to logout? This will clear all your user data, and you will need to go through the whole login process again if you want to log back in.',
						execute: () => {
							clearData();
							currentPage = 'login';
						},
					};
				},
			},
		],
	},
]

onMount(async () => {
	settings = await getData('settings');
	if (!settings)
		settings = {
			// defaults
			datetime: {
				name: 'Date and time',
				options: {
					syncTime: {
						name: 'Set scheduled time to sync the timetable every day',
						type: 'time',
						value: '00:00',
						parse: timeToDuration,
					},
					dayRolloverTime: {
						name: 'Set the time after the day has ended when the tray menu should display the next day\'s classes',
						type: 'time',
						value: '17:00',
						parse: timeToDuration,
					},
				},
			},
		};
});
</script>

{#each buttons as topic}
	<article>
		<hgroup>
			<h2>{topic.name}</h2>
			{#each (topic.options) as option}
				<button class="outline button" on:click={option.func}
					>{option.name}</button
				>
			{/each}
		</hgroup>
	</article>
{/each}
{#if settings}
	<form on:submit|preventDefault={save(settings)}>
		{#each Object.values(settings) as topic}
			<article>
				<hgroup>
					<h2>{topic.name}</h2>
					{#each Object.values(topic.options) as option}
						<label>
							{option.name}
							{#if option.type === 'time'}
								<input type="time" bind:value={option.value} />
							{/if}
						</label>
					{/each}
				</hgroup>
			</article>
		{/each}
		<button type="submit" class="outline button">Save</button>
	</form>
{/if}
{#if infoModal}
	<InfoModal bind:data={infoModal} />
{/if}
{#if confirmModal}
	<ConfirmModal bind:data={confirmModal} />
{/if}

<style>
.button {
	width: 50%;
	margin-left: auto;
	margin-right: auto;
}
</style>
