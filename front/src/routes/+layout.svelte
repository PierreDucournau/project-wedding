<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit'
	import { i18n } from '$lib/i18n'
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte'
	import * as m from '$lib/paraglide/messages'
	import type { Snippet } from 'svelte'

	let { children }: { children: Snippet } = $props()
</script>

<ParaglideJS {i18n}>
	<header>
		<nav aria-label="Main navigation">
			<span class="site-title">{m.home_hero_names()}</span>
			<ul>
				<li><a href={i18n.resolveRoute('/')}>{m.nav_home()}</a></li>
				<li><a href={i18n.resolveRoute('/faq')}>{m.nav_faq()}</a></li>
				<li><a href={i18n.resolveRoute('/itinerary')}>{m.nav_itinerary()}</a></li>
				<li><a href={i18n.resolveRoute('/rsvp')}>{m.nav_rsvp()}</a></li>
			</ul>
			<LanguageSwitcher />
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>{m.home_hero_names()}</p>
	</footer>
</ParaglideJS>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: white;
		border-bottom: 1px solid #eee;
		padding: 0 1.5rem;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		height: 4rem;
	}

	.site-title {
		font-weight: 700;
		font-size: 1.1rem;
		white-space: nowrap;
	}

	ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
	}

	ul a {
		text-decoration: none;
		color: inherit;
		font-size: 0.95rem;
	}

	ul a:hover {
		text-decoration: underline;
	}

	main {
		min-height: calc(100vh - 4rem - 3rem);
	}

	footer {
		text-align: center;
		padding: 1rem;
		font-size: 0.85rem;
		color: #888;
		border-top: 1px solid #eee;
	}
</style>
