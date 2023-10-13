import { useI18n } from "vue-i18n";
import {format} from "date-fns";
import {uz, ru} from "date-fns/locale";

export function generateRandomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function monthsList() {
    const {t} = useI18n();

    return [
        {
            value: 1,
            title: t('month.1')
        },
        {
            value: 2,
            title: t('month.2')
        },
        {
            value: 3,
            title: t('month.3')
        },
        {
            value: 4,
            title: t('month.4')
        },
        {
            value: 5,
            title: t('month.5')
        },
        {
            value: 6,
            title: t('month.6')
        },
        {
            value: 7,
            title: t('month.7')
        },
        {
            value: 8,
            title: t('month.8')
        },
        {
            value: 9,
            title: t('month.9')
        },
        {
            value: 10,
            title: t('month.10')
        },
        {
            value: 11,
            title: t('month.11')
        },
        {
            value: 12,
            title: t('month.12')
        },
    ]
}

export function createThenClickDownloadLink(name: string, link: string) {
    const tagLink = document.createElement('a');
    tagLink.download = name;
    tagLink.href = link;

    tagLink.click();
}

export function numberPrettier(value: number, fixed: number = 2) {
    if(!value) return;

    return value.toFixed(fixed).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function dateFormat(date, formatStr = 'dd MMMM yyyy') {
    const locales = {uz, ru};

    return format(date, formatStr, {
        locale: locales[window.__localeId__]
    })
}

export function reverseStringToDate(str: string) {
    const splitedStr = str.split('.');

    const dd = splitedStr[0];
    const MM = splitedStr[1];
    const yyyy = splitedStr[2];

    return new Date(`${yyyy}-${MM}-${dd}`);
}

export function formatPrice(value: string | number) {
    let valueAsString = String(value);
    return valueAsString
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function setFixedPosition (elementId: string, padding: number) {
    const headerHeight = 56;
    const personalInfoSection = document.getElementById(elementId)
    const sectionHeightMoreThanWindow = personalInfoSection && (personalInfoSection.clientHeight + headerHeight + padding) - window.innerHeight;

    function setFixed() {
        if(!personalInfoSection) return;

        personalInfoSection.style.width = getComputedStyle(personalInfoSection).width;
        personalInfoSection.style.position = 'fixed';
    }

    if(!personalInfoSection) return;

    if(sectionHeightMoreThanWindow && sectionHeightMoreThanWindow > 0) {
        if(window.scrollY > sectionHeightMoreThanWindow) {
            setFixed();
            personalInfoSection.style.bottom = '30px';
        }
        else {
            personalInfoSection.style.position = 'unset';
            personalInfoSection.style.bottom = 'unset';
        }
    }
    else {
        setFixed()
    }
}

export function inputNumbersOnly (event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        return event.preventDefault();
    }
    return true;
}