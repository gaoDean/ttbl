<script>
import { onMount } from 'svelte';
import { getData, setData, clearData } from '$lib/helper.js';
import InfoModal from '$lib/InfoModal.svelte';
import ConfirmModal from '$lib/ConfirmModal.svelte';

const save = (settings) => setData('settings', settings);

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
];

onMount(async () => {
	settings = await getData('settings');
	if (!settings) currentPage = 'login';
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
