<script lang="ts">
	import { getContext } from 'svelte'
	import { goto } from '$app/navigation'
	import WaitingImage from '$lib/components/WaitingImage.svelte'
	import { Engine, loadImage, type ExerciseData } from '$lib/model/engine'
	import PreloadImage from '$lib/components/PreloadImage.svelte'
	import Choose from './Choose.svelte'
	import Construct from './Construct.svelte'
	import Translate from './Translate.svelte'
	import type { Writable } from 'svelte/store'

	export let data
	const engine = getContext<Engine>('engine')
	const index = Number(data.index)
	let answer = ''
	let isCorrect: boolean | null = null
	let exercise: ExerciseData | null = null
	let img: Writable<string>
	let img2Preload: Writable<string>

	engine.isReady.subscribe((isReady) => {
		if (isReady && !exercise) {
			loadExercise(true)
		}
	})
	let choices = engine.getVocabularyChoices(index)

	function check(e: Event) {
		e.preventDefault()
		if (isCorrect !== null) {
			// Ладно! clicked
			loadExercise()
			return
		}
		isCorrect = engine.checkAnswer(index, answer)
		engine.incrementExercise(index)
		engine.saveProgress()
		// preload next exercise
		const nextExercise = engine.getCurrentExercise(index)
		if (nextExercise) {
			img2Preload = loadImage(nextExercise.img)
		}
		// TODO preload congrats image
	}
	function loadExercise(force?: true) {
		if (engine.isLessonDone(index)) {
			if (force) {
				engine.initLesson(index)
			} else {
				goto(`/congrats/${index}`)
				return
			}
		}
		exercise = engine.getCurrentExercise(index)
		if (exercise) {
			img = loadImage(exercise.img)
		}
		answer = ''
		isCorrect = null
	}
	function setAnswer(e: CustomEvent<string>) {
		answer = e.detail
	}
</script>

<form on:submit={check}>
	<div class="exercise">
		{#if exercise}
			<div class="progress">
				<div class="bar" style="width: {exercise.progress * 100}%"></div>
			</div>
			<WaitingImage src={img} alt={exercise.mne} width={300} height={300} />
			<h2 class="question">{exercise.rus}</h2>
			{#if exercise.ui === 'choose'}
				<Choose {choices} on:change={setAnswer} selected={answer} />
			{:else if exercise.ui === 'construct'}
				<Construct vocabulary={choices} sentence={exercise.mne} on:change={setAnswer} {answer} />
			{:else if exercise.ui === 'translate'}
				<Translate on:change={setAnswer} {answer} />
			{/if}

			{#if isCorrect === true}
				<p class="result right">Верно!</p>
			{:else if isCorrect === false}
				<p class="result wrong">Неверно, на самом деле: {exercise.mne}</p>
			{/if}

			<button type="submit" on:click={check} class="btn">
				{isCorrect === null ? 'Проверить' : isCorrect ? 'Супер!' : 'Ладно!'}
			</button>
		{/if}
	</div>
</form>
{#if img2Preload}
	<PreloadImage src={img2Preload} width={300} height={300} />
{/if}

<style>
	.exercise {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.progress {
		width: 100vw;
		height: 5px;
		background: #ddd;
		margin-top: 5px;
		position: relative;
		top: calc(-1 * (1rem + 5px));
	}
	.bar {
		height: 100%;
		background: #4e9ef9;
		border-radius: 5px;
	}
	.question {
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
	.result {
		margin-top: 10px;
		font-size: 1.2em;
		border: 1px solid;
		padding: 10px;
		border-radius: 10px;
	}
	.result.right {
		color: #4caf50;
		background-color: #e2fde3;
	}
	.result.wrong {
		color: #f44336;
		background-color: #fbe0de;
	}
</style>
