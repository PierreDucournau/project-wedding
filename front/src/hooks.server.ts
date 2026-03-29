import { i18n } from '$lib/i18n'
import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es'] as const
type Language = (typeof SUPPORTED_LANGUAGES)[number]

function detectLanguage(acceptLanguage: string): Language {
	const preferred = acceptLanguage
		.split(',')
		.map((part) => {
			const [lang, q = 'q=1'] = part.trim().split(';')
			return {
				lang: lang.trim().split('-')[0].toLowerCase(),
				q: parseFloat(q.split('=')[1] ?? '1')
			}
		})
		.sort((a, b) => b.q - a.q)
		.map(({ lang }) => lang)
		.find((lang) => SUPPORTED_LANGUAGES.includes(lang as Language))

	return (preferred as Language) ?? 'fr'
}

const languageDetection: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url
	const hasLangPrefix = SUPPORTED_LANGUAGES.some(
		(lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
	)

	if (!hasLangPrefix) {
		const acceptLanguage = event.request.headers.get('accept-language') ?? ''
		const lang = detectLanguage(acceptLanguage)
		const target = `/${lang}${pathname === '/' ? '' : pathname}${event.url.search}`
		redirect(307, target)
	}

	return resolve(event)
}

export const handle: Handle = sequence(languageDetection, i18n.handle())
