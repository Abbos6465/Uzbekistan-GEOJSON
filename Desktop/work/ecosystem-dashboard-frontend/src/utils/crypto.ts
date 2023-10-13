import CryptoJS from "crypto-js";

export default function(key: string) {
    return {
        encrypt: (value: string | number) => {
            return CryptoJS.AES.encrypt(value, key).toString();
        },
        decrypt: (value: string) => {
            const bytes = CryptoJS.AES.decrypt(value, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
    }
}