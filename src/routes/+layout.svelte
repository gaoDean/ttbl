<script>
import '$lib/css/main.scss';
import Titlebar from '$lib/Titlebar.svelte';
</script>

<svelte:head>
	<title>ttbl</title>
</svelte:head>

<Titlebar />
<slot />

<style>
/* :root { */
/* 	--primary: #3fb8be !important; */
/* 	--primary-hover: #3aacb2 !important; */
/* } */
</style>
