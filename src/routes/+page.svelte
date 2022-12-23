<script>
import Titlebar from './Titlebar.svelte';
import Bottombar from './Bottombar.svelte';
import Settings from './Settings.svelte';
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';

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
<Bottombar bind:currentPage bind:selectedDate />
