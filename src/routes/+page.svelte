<script lang="ts">
	import { getContext } from 'svelte'
	import WaitingImage from '$lib/components/WaitingImage.svelte'
	import { loadImage, type Engine } from '$lib/model/engine'
	import PreloadImage from '$lib/components/PreloadImage.svelte'

	const engine = getContext<Engine>('engine')
	let lessons: ReturnType<Engine['getLessons']> = []
	let preloadImage: ReturnType<typeof loadImage> | undefined
	engine.isReady.subscribe((isReady) => {
		if (isReady) {
			lessons = engine.getLessons()
			const nextLesson = lessons.find((lesson) => lesson.isFuture)
			const nextIndex = nextLesson ? lessons.indexOf(nextLesson) : lessons.length
			const currentLesson = lessons[nextIndex - 1]
			if (!currentLesson.progress) {
				const exToPreload = engine.getNextExercise(nextIndex - 1)
				preloadImage = loadImage(exToPreload.img)
			}
		}
	})
</script>

<div class="container">
	<div class="grid">
		{#each lessons as lesson}
			<a class="lesson" href="/lessons/{lesson.index}" class:future={lesson.isFuture}>
				<div class="img-borders">
					<WaitingImage src={lesson.img} alt={lesson.title} width={100} height={100} />
				</div>
				<div class="progress">
					<div class="bar" style="width: {lesson.progress * 100}%"></div>
				</div>
				<div>{lesson.title}</div>
			</a>
		{/each}
	</div>
</div>
{#if preloadImage}
	<PreloadImage src={preloadImage} width={300} height={300} />
{/if}

<style>
	.lesson {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-size: 0.9em;
		color: #333;
		text-decoration: none;
	}

	.lesson.future {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.img-borders {
		border-radius: 10px;
		overflow: hidden;
	}

	.progress {
		width: 70%;
		margin: auto;
		height: 5px;
		background: #ddd;
		border-radius: 5px;
		margin-top: 5px;
	}
	.bar {
		height: 100%;
		background: #4caf50;
		border-radius: 5px;
	}

	.container {
		display: flex;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 10px;
		padding: 10px;
		width: 100%;
		max-width: 600px; /* Limit the max width for larger screens */
	}
</style>
