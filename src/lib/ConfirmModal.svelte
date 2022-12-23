<script>
export let data;
const { title, body, htmlBody, execute } = data;
</script>

<dialog open>
	<article>
		<header>
			<h3>{title}</h3>
		</header>
		<p>{body}</p>
		{#if htmlBody}
			{@html htmlBody}
		{/if}
		<footer>
			<a
				href="#cancel"
				role="button"
				class="secondary"
				on:click={() => {
					data = undefined;
				}}>Cancel</a
			>
			<a
				href="#confirm"
				role="button"
				on:click={() => {
					execute();
					data = undefined;
				}}>Confirm</a
			>
		</footer>
	</article>
</dialog>
