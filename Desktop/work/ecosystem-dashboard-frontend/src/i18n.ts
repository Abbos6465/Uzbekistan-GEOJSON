import { createI18n } from "vue-i18n";

export const availableLangs = ['uz', 'ru'];
export const activeLang = localStorage.getItem('lang') ?? 'uz';

const { default: json } = await import(`@/localization/${activeLang}.json`);

export async function changeI18nLang(lang:string) {
    const { default: json } = await import(`@/localization/${lang}.json`);
    i18n.global.locale.value = lang;
    i18n.global.setLocaleMessage(lang, json)
}

const i18n = createI18n({
    globalInjection: true,
    locale: activeLang,
    useScope: 'global',
    legacy: false,
    missingWarn: false,
    fallbackWarn: false,
    messages: {
        [activeLang]: json
    },
})

export default i18n;