<script lang="ts">
	import { onMount, setContext } from 'svelte'
	import { Engine } from '$lib/model/engine'
	import { browser } from '$app/environment'
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
	</div>
	<div class="container">
		<slot />
	</div>
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
	.home img {
		display: block;
		margin-right: 10px;
		border-radius: 50%;
	}
	.xp {
		font-family: 'Indie Flower', cursive;
		font-size: 1.5em;
		color: #fbf5f5;
	}
	.xp-title {
		color: rgb(43, 43, 155);
	}
</style>
