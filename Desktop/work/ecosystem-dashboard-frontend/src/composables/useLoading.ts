import { ref } from "vue";

const items = ref<any>({});

export default function () {
    function changeIsRequestLoading(key: string, value: boolean) {

        if(isRequestLoading(key) && value) return;

        items.value[key] = value;
    }

    function isRequestLoading(key: string | string[]) {
        if(Array.isArray(key)) {
            return key.some(k => items.value[k])
        }
        return items.value[key];
    }

    return {changeIsRequestLoading, isRequestLoading}
}