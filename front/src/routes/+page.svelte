<script lang="ts">
	import * as m from '$lib/paraglide/messages'
	import { onMount } from 'svelte'

	const weddingDate = new Date('2025-07-12T11:00:00')

	let countdown = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 })

	function updateCountdown() {
		const now = new Date()
		const diff = weddingDate.getTime() - now.getTime()
		if (diff <= 0) return
		countdown = {
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((diff % (1000 * 60)) / 1000)
		}
	}

	onMount(() => {
		updateCountdown()
		const interval = setInterval(updateCountdown, 1000)
		return () => clearInterval(interval)
	})
</script>

<svelte:head>
	<title>{m.home_hero_names()} — {m.home_hero_subtitle()}</title>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<h1>{m.home_hero_names()}</h1>
	<p class="subtitle">{m.home_hero_subtitle()}</p>
	<p class="scroll-hint">{m.home_hero_scroll()}</p>
</section>

<!-- Date & Countdown -->
<section id="date" class="block">
	<h2>{m.home_date_title()}</h2>
	<p class="date-value">{m.home_date_value()}</p>
	<div class="countdown">
		<div class="unit">
			<span class="number">{countdown.days}</span>
			<span class="label">{m.home_date_countdown_days()}</span>
		</div>
		<div class="unit">
			<span class="number">{countdown.hours}</span>
			<span class="label">{m.home_date_countdown_hours()}</span>
		</div>
		<div class="unit">
			<span class="number">{countdown.minutes}</span>
			<span class="label">{m.home_date_countdown_minutes()}</span>
		</div>
		<div class="unit">
			<span class="number">{countdown.seconds}</span>
			<span class="label">{m.home_date_countdown_seconds()}</span>
		</div>
	</div>
</section>

<!-- Venue -->
<section id="venue" class="block alt">
	<h2>{m.home_venue_title()}</h2>
	<p>{m.home_venue_address()}</p>
	<!-- TODO: replace with real Google Maps URL -->
	<span class="map-link-placeholder">{m.home_venue_map_link()}</span>
</section>

<!-- Dress code -->
<section id="dresscode" class="block">
	<h2>{m.home_dresscode_title()}</h2>
	<p>{m.home_dresscode_description()}</p>
</section>

<!-- Contact -->
<section id="contact" class="block alt">
	<h2>{m.home_contact_title()}</h2>
	<p>{m.home_contact_description()}</p>
</section>

<style>
	.hero {
		min-height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
		background: linear-gradient(135deg, #f5f0eb 0%, #ede8e3 100%);
	}

	h1 {
		font-size: clamp(2.5rem, 8vw, 5rem);
		font-weight: 300;
		letter-spacing: 0.05em;
		margin: 0 0 1rem;
	}

	.subtitle {
		font-size: 1.3rem;
		color: #666;
		margin: 0 0 3rem;
	}

	.scroll-hint {
		font-size: 0.85rem;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.block {
		padding: 5rem 2rem;
		text-align: center;
	}

	.block.alt {
		background: #f9f6f3;
	}

	.block h2 {
		font-size: 2rem;
		font-weight: 300;
		margin: 0 0 1.5rem;
	}

	.date-value {
		font-size: 1.4rem;
		margin: 0 0 2rem;
	}

	.countdown {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 4rem;
	}

	.number {
		font-size: 3rem;
		font-weight: 700;
		line-height: 1;
	}

	.label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #888;
		margin-top: 0.25rem;
	}

	.map-link-placeholder {
		color: #999;
		font-size: 0.9rem;
		font-style: italic;
	}
</style>
