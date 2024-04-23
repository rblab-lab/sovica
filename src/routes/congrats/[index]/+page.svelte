<script lang="ts">
	import { goto } from '$app/navigation'
	import { Engine } from '$lib/model/engine'
	import { getContext } from 'svelte'

	export let data
	const engine = getContext<Engine>('engine')
	const index = Number(data.index)
	let correct: number
	let xpGain: number
	engine.isReady.subscribe((isReady) => {
		if (isReady) {
			;({ correct, xpGain } = engine.getScores(index))
		}
	})
	let finished = false

	function next() {
		if (!engine.isThereLesson(index + 1)) {
			finished = true
			return
		}

		engine.updateUsersXP(xpGain)
		engine.initLesson(index + 1)
		engine.saveProgress()
		goto(`/lessons/${index + 1}`)
	}
</script>

<div class="frame">
	<enhanced:img
		src="../../../pics/congrats.webp?w=1024;512;256;128;64"
		sizes="300px"
		alt="congrats"
		style="width: 300px; height: 300px;"
	/>
	{#if !finished}
		<h2 class="congrats">Ура! Урок сделан!🎉</h2>
		<p>Правильно на: {Math.round(correct * 100)}%</p>
		<p>Опыта получено: {xpGain}</p>

		<button on:click={next} class="btn">next</button>
	{:else}
		<h2 class="congrats">А всё! ¯\_(ツ)_/¯</h2>
	{/if}
</div>

<style>
	.frame {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.congrats {
		text-align: center;
		margin-top: 10px;
	}
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
