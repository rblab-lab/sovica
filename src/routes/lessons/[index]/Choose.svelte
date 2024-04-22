<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { shuffle } from '$lib/model/engine'
	export let choices: string[]
	const dispatch = createEventDispatcher()
	export let selected: string
	$: {
		if (selected === '') {
			choices = shuffle(choices)
		}
	}

	function select(word: string) {
		selected = word

		dispatch('change', selected)
	}
</script>

<div class="choose">
	{#each choices as choice}
		<button
			class="choice"
			class:selected={choice === selected}
			on:click={(e) => {
				e.preventDefault()
				select(choice)
			}}>{choice}</button
		>
	{/each}
</div>

<style>
	.choose {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.choice {
		margin: 5px;
		padding: 10px 20px;
		background: #dbe0ee;
		color: rgb(39, 39, 39);
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}
	.selected {
		outline: 2px solid #5470bd;
	}
</style>
