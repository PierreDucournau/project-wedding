<script lang="ts">
	import { i18n } from '$lib/i18n'
	import { languageTag } from '$lib/paraglide/runtime'
	import * as m from '$lib/paraglide/messages'
	import { page } from '$app/stores'

	const languages = [
		{ tag: 'fr', label: () => m.lang_fr() },
		{ tag: 'en', label: () => m.lang_en() },
		{ tag: 'es', label: () => m.lang_es() }
	] as const
</script>

<nav aria-label="Language switcher">
	<ul>
		{#each languages as lang}
			<li>
				<a
					href={i18n.resolveRoute($page.url.pathname, lang.tag)}
					hreflang={lang.tag}
					aria-current={languageTag() === lang.tag ? 'true' : undefined}
				>
					{lang.label()}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	ul {
		display: flex;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	a:hover,
	a[aria-current='true'] {
		opacity: 1;
		font-weight: 600;
	}
</style>
