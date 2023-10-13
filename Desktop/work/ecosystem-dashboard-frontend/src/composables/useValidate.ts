import { ref, watch } from "vue";
import i18n from '../i18n'

const {t} = i18n.global;
const errors = ref<any>({});
let unWatch: any;

export default function (rules: any, state: any) {
    function validate(key?: string) {
        errors.value = {};

        if(key) {
            setError(key);
        }
        else {
            const keys = Object.keys(rules.value);

            keys.forEach(key => {
                setError(key);
            })
        }

        return !Object.keys(errors.value).length;
    }

    function setError(key: string) {
        const res = hasError(rules.value[key], state.value[key]);
        if (res) {
            if (res.required) {
                errors.value[key] = {
                    message: [t('common.valueIsRequired')]
                }
            }
            else if(res.email) {
                errors.value[key] = {
                    message: [t('common.wrongEmailAddress')]
                }
            }
            else if(res.allFieldsMustBeFilled) {
                errors.value[key] = {
                    message: [t('common.fillAllFields')]
                }
            }
        }

        unWatch = watch(() => state.value[key], (newValue) => {
            if(newValue) delete errors.value[key];
        }, {deep: true})
    }

    function hasError(rules: any, state: any) {
        let error: any = false;
        const rulesKeys = Object.keys(rules);

        if (rulesKeys.includes('required') && rules.required && !state) {
            error = { required: true };
        }
        else if (rulesKeys.includes('email') && rules.email && !checkEmail(state)) {
            error = { email: true };
        }
        else if(rulesKeys.includes('allFieldsMustBeFilled') && rules.allFieldsMustBeFilled()) {
            error = {allFieldsMustBeFilled: true}
        }

        return error;
    }

    function checkEmail(value: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value.trim());
    }

    function clear() {
        errors.value = {}
    }

    return {
        validate,
        errors,
        clear
    }
}