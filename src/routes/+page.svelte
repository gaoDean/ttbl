<script>
import Titlebar from '$lib/Titlebar.svelte';
import Bottombar from '$lib/Bottombar.svelte';
import Settings from './Settings.svelte';
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';
import { currentPage } from './stores.js';
import { syncTimetableProcess } from '$lib/fetch.js';

let selectedDate;
</script>

<Titlebar />
<main class="container">
	{#if $currentPage === 'timetable'}
		<Timetable bind:selectedDate />
	{:else if $currentPage === 'settings'}
		<Settings />
	{:else}
		<Login />
	{/if}
</main>
{#if $currentPage !== 'login'}
	{syncTimetableProcess() && ''}
	<Bottombar bind:selectedDate />
{/if}
