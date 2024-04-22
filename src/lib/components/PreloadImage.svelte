<script lang="ts">
	// @ts-nocheck
	import WaitingImage from './WaitingImage.svelte'
	let loaded = false
	function onLoad() {
		loaded = true
	}
</script>

{#if !loaded}
	<div class="hidden">
		<WaitingImage on:load={onLoad} {...$$props} />
	</div>
{/if}

<style>
	.hidden {
		height: 0;
		width: 0;
		overflow: hidden;
	}
</style>
