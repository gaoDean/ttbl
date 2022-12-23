<script>
import Titlebar from '$lib/Titlebar.svelte';
import Bottombar from '$lib/Bottombar.svelte';
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
{#if currentPage !== 'login'}
	<Bottombar bind:currentPage bind:selectedDate />
{/if}

<style>
main {
	margin-left: 3rem;
}
</style>
