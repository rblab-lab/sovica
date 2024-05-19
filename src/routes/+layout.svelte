<script lang="ts">
	import { onMount, setContext } from 'svelte'
	import { Engine } from '$lib/model/engine'
	import { browser } from '$app/environment'
	import SvelteMarkdown from 'svelte-markdown'
	import Button from '$lib/components/Button.svelte'
	import { slide } from 'svelte/transition'
	import { escape } from '$lib/directives/escape'
	export let data

	const engine = new Engine(data.lessons)
	let xp = engine.getXp()
	setContext('engine', engine)

	onMount(() => {
		if (browser) {
			const user = JSON.parse(localStorage.getItem('user') || 'null') || undefined
			engine.setUser(user)
		}
	})

	let inLesson = engine.inLesson
	let popupContent = ''
	function hint() {
		const lessonId = window.location.pathname.split('/').pop()
		popupContent = engine.getHelp(Number(lessonId))
	}
	function about() {
		// cspell:disable
		popupContent =
			'Изучаем\n Черногорский вместе с Sovica!\n\n' +
			'Вдохоновлено [Duolingo](https://www.duolingo.com/).\n' +
			'### Авторы:\n' +
			'- [Роман Беккиев](https://t.me/rombek)\n' +
			'Бесплатно, без регистрации и смс. Навсегда. [Исходники доступны на GitHub](https://github.com/rblab-lab/sovica)\n'
		// cspell:enable
	}

	function closePopup() {
		popupContent = ''
	}
</script>

<div class="app-container">
	<div class="header">
		<a class="home" href="/">
			<enhanced:img
				src="../pics/owl.webp?w=1024;512;256;128;64"
				sizes="30px"
				alt="logo"
				style="width: 30px; height: 30px;"
			/>
			<div>Sovica</div>
		</a>
		<div class="xp">
			<span class="xp-title">XP:</span>
			<span class="xp-score">{$xp}</span>
		</div>
		<div class="buttons">
			{#if $inLesson}
				<button on:click={hint} class="top-btn">?</button>
			{/if}
			<button on:click={about} class="top-btn">i</button>
		</div>
	</div>
	<div class="container">
		<slot />
	</div>
	{#if popupContent}
		<div class="popup" use:escape on:escape={closePopup} transition:slide>
			<div class="popup-content">
				<SvelteMarkdown source={popupContent} />
			</div>
			<div class="actions">
				<Button on:click={closePopup}>Ok!</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
	}
	:global(*) {
		box-sizing: border-box;
	}
	.app-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.container {
		padding: 1rem;
		width: 100%;
	}
	@media (min-width: 600px) {
		.app-container {
			width: 600px;
			margin: auto;
			box-shadow: 2px 2px 14px rgba(0, 0, 0, 0.2);
		}
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: #64b28e;
		padding: 10px;
		display: flex;
		justify-content: space-between;
	}

	.home {
		font-family: 'Indie Flower', cursive;
		display: flex;
		align-items: center;
		text-decoration: none;
		color: #121aad;
		font-size: 1.5em;
	}
	.xp {
		font-family: 'Indie Flower', cursive;
		font-size: 1.5em;
		color: #fbf5f5;
	}
	.xp-title {
		color: rgb(43, 43, 155);
	}

	.home img {
		display: block;
		margin-right: 10px;
		border-radius: 50%;
	}
	.top-btn {
		background: #036d8c;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-size: 20px;
		color: #f9f9f9;
		font-weight: bold;
	}
	.buttons button:first-child {
		margin-right: 10px;
	}
	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		background: white;
		/* TODO add a normal backdrop instead of it */
		box-shadow: 0 0 180px 90px rgba(0, 0, 0, 0.5);
	}
	.popup-content {
		padding: 1rem;
	}
	.popup-content :global(p) {
		margin: 0.5rem 0;
	}
	.popup-content :global(ul) {
		padding: 0.5rem 0 0.5rem 1.5rem;
		margin: 0;
	}
	.popup-content :global(h3) {
		margin-bottom: 0;
	}
	.popup-content :global(table) {
		border-collapse: collapse;
	}
	.popup-content :global(tr) {
		border-bottom: 1px solid #e6e2e2;
	}
	.popup-content :global(tr:last-child) {
		border-bottom: none;
	}
	.popup-content :global(td),
	.popup-content :global(th) {
		text-align: left;
		padding: 0 0.5rem 0.3rem 0;
	}
	.popup-content :global(td:last-child),
	.popup-content :global(th:last-child) {
		padding-right: 0;
	}
	.actions {
		padding: 0 1rem 3rem 1rem;
		text-align: center;
	}
</style>
