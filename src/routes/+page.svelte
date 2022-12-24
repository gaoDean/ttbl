<script>
import Titlebar from '$lib/Titlebar.svelte';
import Bottombar from '$lib/Bottombar.svelte';
import Settings from './Settings.svelte';
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';
import { syncTimetableProcess } from '$lib/fetch.js';

let currentPage = 'timetable';
let selectedDate;
</script>

<Titlebar />
<main class="container">
	{#if currentPage === 'timetable'}
		<Timetable bind:currentPage bind:selectedDate />
	{:else if currentPage === 'settings'}
		<Settings bind:currentPage />
	{:else}
		<Login bind:currentPage />
	{/if}
</main>
{#if currentPage !== 'login'}
	{syncTimetableProcess() && ''}
	<Bottombar bind:currentPage bind:selectedDate />
{/if}
