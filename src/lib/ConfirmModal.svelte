<script>
export let data;
const { body, htmlBody, execute } = data;
</script>

<dialog open>
	<article>
		<h3>Confirm your action!</h3>
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
