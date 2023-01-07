<script>
import { onMount } from 'svelte';
import { currentPage } from './stores.js';
import { getData, getDataRaw, setData, clearData } from '$lib/helper.js';
import InfoModal from '$lib/InfoModal.svelte';
import ConfirmModal from '$lib/ConfirmModal.svelte';

const prettifyJSON = (json) =>
	JSON.stringify(json, null, 4)
		.replace(/[",{}[\]]/g, '')
		.replace(/\\n/g, '\t\t');

const save = (settings) => setData('settings', settings);

let settings;
let infoModal;
let confirmModal;

const buttons = [
	{
		name: 'App data',
		options: [
			{
				name: 'View log',
				func: async () => {
					infoModal = {
						title: 'User info',
						body: (await getDataRaw('log')).split('\n').reverse().join('\n\n'),
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
							currentPage.set('login');
						},
					};
				},
			},
		],
	},
	{
		name: 'User info',
		options: [
			{
				name: 'View user info',
				func: async () => {
					infoModal = {
						title: 'User info',
						body: prettifyJSON(await getData('info'), null, 4),
					};
				},
			},
			{
				name: 'View token',
				func: async () => {
					infoModal = {
						title: 'Token',
						body: await getData('token'),
					};
				},
			},
			{
				name: 'View timetable',
				func: async () => {
					infoModal = {
						title: 'Timetable',
						body: prettifyJSON(await getData('timetable')),
					};
				},
			},
		],
	},
];

onMount(async () => {
	settings = await getData('settings');
	if (!settings) currentPage.set('login');
});
</script>

{#each buttons as topic}
	<article>
		<hgroup>
			<h2>{topic.name}</h2>
			{#each topic.options as option}
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
