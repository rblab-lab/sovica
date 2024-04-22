<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let sentence = ''
	let words: string[] = []
	let constructed: string[] = []
	$: {
		words = sentence.split(' ').sort(() => Math.random() - 0.5)
		constructed = []
	}
	const dispatch = createEventDispatcher()

	function select(word: string) {
		constructed = [...constructed, word]
		dispatch('change', constructed.join(' '))
	}
	function undo(word: string) {
		constructed = constructed.filter((w) => w !== word)
		dispatch('change', constructed.join(' '))
	}
</script>

<div class="construct">
	<div class="choices">
		{#each words as word}
			<button
				class="word"
				class:taken={constructed.includes(word)}
				on:click={(e) => {
					e.preventDefault()
					select(word)
				}}
			>
				{word}
			</button>
		{/each}
	</div>
	<div class="slot">
		{#each constructed as word}
			<button
				class="word"
				on:click={(e) => {
					e.preventDefault()
					undo(word)
				}}>{word}</button
			>
		{/each}
	</div>
</div>

<style>
	.construct {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.word {
		margin: 5px;
		padding: 10px 20px;
		background: #e8ebf4;
		color: rgb(39, 39, 39);
		border: 1px solid #ccc;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
	.word.taken {
		background: rgb(235, 238, 247);
		color: rgb(235, 238, 247);
	}

	.slot {
		margin-top: 1em;
		min-height: 3em;
		min-width: 80%;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
