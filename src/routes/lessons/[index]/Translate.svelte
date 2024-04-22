<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let answer = ''

	function handleInput(event: Event) {
		const elem = event.target as HTMLInputElement

		dispatch('change', elem.value)
	}
</script>

<div class="translate">
	<h3>Переведите на черногорский:</h3>
	<input type="text" placeholder="Перевод" on:input={handleInput} value={answer} />
</div>

<style>
	.translate {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input {
		margin: 5px;
		padding: 10px 20px;
		background: #fbfbfb;
		color: #242424;
		border: 1px solid #979595;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1.2em;
	}
</style>
