<script>
let clearDataEnabled = false;
let clearData = false;
</script>

<h3>Settings</h3>

<label>
	<input type="checkbox" role="switch" bind:value={clearDataEnabled} />
	Yes, I know that it will be a pain in the ass to log back in.
</label>
<label>
	<input type="checkbox" disabled={!clearDataEnabled} bind:value={clearData} />
	Clear user data
</label>
