<script>
import Timetable from './Timetable.svelte';
import Login from './Login.svelte';

let needsLogin = true;
</script>

{#if needsLogin}
	<Login bind:needsLogin />
{:else}
	<Timetable bind:needsLogin />
{/if}
