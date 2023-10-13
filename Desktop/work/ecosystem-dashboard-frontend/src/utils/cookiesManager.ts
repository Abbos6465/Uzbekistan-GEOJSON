import crypto from "@/utils/crypto";

const KEY = 'SmdWli0FRlJFJcdViSr/C6Zxlz6bHQfg8';

export function setCookie(name: string, value: any, expire?: number) {
    let expires = "";

    if (expire) {
        let date = new Date(expire * 1000 - 3480000);
        date = new Date(date.setHours(date.getHours() + 5));
        expires = "; expires=" + date.toUTCString();
    }

    const encryptedValue = crypto(KEY).encrypt(value);
    document.cookie = name + "=" + (encryptedValue || "")  + expires + "; path=/";
}

export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            const a = c.substring(name.length, c.length);

            return crypto(KEY).decrypt(a);
        }
    }
    return "";
}

export function eraseCookie(name: string) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}