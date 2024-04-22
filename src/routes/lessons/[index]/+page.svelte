<script lang="ts">
	import { getContext } from 'svelte'
	import { goto } from '$app/navigation'
	import WaitingImage from '$lib/components/WaitingImage.svelte'
	import { Engine, loadImage } from '$lib/model/engine'
	import PreloadImage from '$lib/components/PreloadImage.svelte'
	import Choose from './Choose.svelte'
	import Construct from './Construct.svelte'
	import Translate from './Translate.svelte'

	export let data
	const engine = getContext<Engine>('engine')
	const index = Number(data.index)
	let answer = ''
	let isCorrect: boolean | null = null
	let exercise: ReturnType<Engine['getNextExercise']> | null = null
	let img: ReturnType<typeof loadImage>
	let img2Preload: ReturnType<typeof loadImage>

	engine.isReady.subscribe((isReady) => {
		if (isReady) {
			next(true)
		}
	})
	let choices = engine.getVocabularyChoices(index)

	function check(e: Event) {
		e.preventDefault()
		if (isCorrect !== null) {
			// Ладно! clicked
			next()
			return
		}
		isCorrect = engine.checkAnswer(index, answer)
		engine.saveProgress()
		// preload next exercise
		const nextExercise = engine.getNextExercise(index)
		if (nextExercise) {
			console.log(nextExercise.rus)
			img2Preload = loadImage(nextExercise.img)
		}
		// TODO preload congrats image
	}
	function next(force?: true) {
		if (engine.isLessonDone(index) && !force) {
			goto(`/congrats/${index}`)
			return
		}
		exercise = engine.getNextExercise(index)
		img = loadImage(exercise.img)
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
				{isCorrect === null ? 'Проверить' : 'Ладно!'}
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
