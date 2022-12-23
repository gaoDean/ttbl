<script>
export let data;
const { title, body, htmlBody } = data;
</script>

<dialog open>
	<article>
		<header>
			<button
				class="secondray outline close"
				on:click={() => {data = undefined}}
			/>
			<h3>{title}</h3>
		</header>
		<p>{body}</p>
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
