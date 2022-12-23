<script>
export let page;
</script>

<div style="height: 30px">
	<div class="bar">
		<input class="date-input button" type="date" />
		<div class="settings button" />
	</div>
	<div style="width: 100%" />
</div>

<style>
.bar {
	display: flex;
	flex-direction: column;
	position: fixed;
	z-index: 3;
	bottom: 1rem;
	left: 8px;
	right: 0;
}

.date-input {
	height: 0px;
	width: 0px;
	border: none;
	padding-left: 10px !important;
	box-shadow: none;
}

.settings {
	background-image: var(--icon-search);
	background-size: 18px;
	height: 18px;
	width: 18px;
	margin-left: 10px;
}

.button {
	opacity: 0.4;
}

.button:hover {
	opacity: 1;
}
</style>
