<script>
import Titlebar from './Titlebar.svelte';
import Bottombar from'./Bottombar.svelte';
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';

let page = 'login';
</script>

<Titlebar />
<main class="container">
	{#if page == 'login'}
		<Login bind:page />
	{:else}
		<Timetable bind:page />
	{/if}
</main>
<Bottombar />
