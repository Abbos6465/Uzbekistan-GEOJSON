import { onMounted, onUnmounted, ref, watch } from "vue";
import { eraseCookie, getCookie, setCookie } from "@/utils/cookiesManager";
import { useRoute, useRouter } from "vue-router";

const pageRouteName = ref();

export default function (data: any, cookiesName: string) {
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
        await router.isReady();
        pageRouteName.value = route.name;

        const creatingCVFromCookie = getCookie(cookiesName);

        if(creatingCVFromCookie) {
            data.value = JSON.parse(creatingCVFromCookie)
        }
    })

    onUnmounted(() => {
        if(route.name !== pageRouteName.value) eraseCookie(cookiesName)
    })

    watch(data, () => {
        setCookie(cookiesName, JSON.stringify(data.value))
    },{
        deep: true
    })
}