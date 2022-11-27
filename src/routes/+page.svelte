<script>
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';

let needsLogin = true;
</script>

<main class="container">
	{#if needsLogin}
		<Login bind:needsLogin />
	{:else}
		<Timetable bind:needsLogin />
	{/if}
</main>
