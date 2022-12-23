<script>
import '$lib/css/main.scss';
</script>

<svelte:head>
	<title>ttbl</title>
</svelte:head>

<slot />

<style>
/* :root { */
/* 	--primary: #3fb8be !important; */
/* 	--primary-hover: #3aacb2 !important; */
/* } */
::-webkit-scrollbar {
	height: 1px;
	width: 1px;
}

::-webkit-scrollbar:hover {
	height: 4px;
	width: 4px;
}
</style>
