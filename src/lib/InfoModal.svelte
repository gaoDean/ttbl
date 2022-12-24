<script>
export let data;
const { title, body, htmlBody } = data;
</script>

<dialog open>
	<article>
		<header style="margin-bottom: 0px">
			<button
				class="secondray outline close"
				on:click={() => {
					data = undefined;
				}}
			/>
			<h3 style="margin-bottom: 0px">{title}</h3>
		</header>
		<span style="white-space: pre-wrap">{body}</span>
		{#if htmlBody}
			{@html htmlBody}
		{/if}
	</article>
</dialog>

<style>
.close {
	border: none;
	box-shadow: none;
}
</style>
