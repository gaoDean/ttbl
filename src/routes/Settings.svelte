<script>
import { onMount } from 'svelte';
import { getData, clearData } from '$lib/helper.js';
import InfoModal from '$lib/InfoModal.svelte';
import ConfirmModal from '$lib/ConfirmModal.svelte';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
dayjs.extend(dayjsDuration);

const save = (settings) => console.log('test');

const timeToDuration = (timeString) =>
	dayjs.duration({
		hours: timeString.slice(0, timeString.indexOf(':')),
		minutes: timeString.slice(timeString.indexOf(':')),
	});

let settings;
let infoModal;
let confirmModal;

onMount(async () => {
	settings = await getData('settings');
	if (!settings)
		settings = [
			// defaults
			{
				name: 'Date and time',
				options: [
					{
						name: 'Set scheduled time to sync the timetable every day',
						type: 'time',
						value: '00:00',
						parse: timeToDuration,
					},
					{
						name: "Set the time after the day has ended when the tray menu should display the next day's classes",
						type: 'time',
						value: '17:00',
						parse: timeToDuration,
					},
				],
			},
			{
				name: 'User',
				options: [
					{
						name: 'Get user info',
						type: 'button',
						func: async () => {
							infoModal = {
								title: 'User info',
								body: JSON.stringify(await getData('info')),
							};
						},
					},
					{
						name: 'Logout and clear user data',
						type: 'button',
						func: async () => {
							confirmModal = {
								body: 'Are you sure you want to logout? This will clear all your user data, and you will need to go through the whole login process again if you want to log back in.',
								execute: clearData,
							};
						},
					},
				],
			},
		];
});
</script>

{#if settings}
	<form on:submit|preventDefault={save(settings)}>
		{#each settings as topic}
			<article>
				<hgroup>
					<h2>{topic.name}</h2>
					{#each topic.options as option}
						<label>
							{#if option.type === 'time'}
								{option.name}
								<input type="time" bind:value={option.value} />
							{:else if option.type === 'button'}
								<button class="outline" on:click={option.func}
									>{option.name}</button
								>
							{/if}
						</label>
					{/each}
				</hgroup>
			</article>
		{/each}
		<button type="submit">Submit</button>
	</form>
{/if}
{#if infoModal}
	<InfoModal bind:data={infoModal} />
{/if}
{#if confirmModal}
	<ConfirmModal bind:data={confirmModal} />
{/if}

<style>
</style>
