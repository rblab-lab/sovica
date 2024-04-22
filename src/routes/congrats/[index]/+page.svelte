<script lang="ts">
	import { goto } from '$app/navigation'
	import { Engine } from '$lib/model/engine'
	import { getContext } from 'svelte'
	import congrats from '../../../pics/congrats.webp'

	export let data
	const engine = getContext<Engine>('engine')
	const index = Number(data.index)
	let correct: number
	let xpGain: number
	let isReady = engine.isReady
	$: {
		if ($isReady) {
			;({ correct, xpGain } = engine.getScores(index))
		}
	}

	function next() {
		engine.updateUsersXP(xpGain)
		engine.saveProgress()
		goto(`/lessons/${index + 1}`)
	}
</script>

<div class="frame">
	<img src={congrats} alt="congrats" width="300" height="300" />
	<h2 class="congrats">Ура! Урок сделан!🎉</h2>
	<p>Правильно на: {Math.round(correct * 100)}%</p>
	<p>Опыта получено: {xpGain}</p>

	<button on:click={next} class="btn">next</button>
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
