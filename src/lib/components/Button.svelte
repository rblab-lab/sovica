<script lang="ts">
	export let tag: 'button' | 'a' = 'button'
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let variant: 'primary' | 'secondary' | 'ghost' = 'primary'
	export let node: any = undefined
</script>

<svelte:element
	this={tag}
	class={['btn', variant, size].join(' ')}
	{...$$restProps}
	on:click
	role="button"
	tabindex={0}
	bind:this={node}
>
	<slot />
</svelte:element>

<style>
	.btn {
		margin: auto;
		margin-top: 10px;
		padding: 10px 30px;
		display: block;
		max-width: 200px;
		background: #5470bd;
		color: rgb(255, 255, 255);
		border: 1px solid #1b3681;
		border-radius: 5px;
		font-size: large;
		cursor: pointer;
		text-transform: uppercase;
	}
</style>
