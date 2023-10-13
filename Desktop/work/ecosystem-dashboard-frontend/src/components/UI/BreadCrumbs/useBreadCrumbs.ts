import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

export type BreadCrumbLinksType = {
   title: string
   route?: string | {
       name: string
       params?: any
   }
}

const breadCrumbsItems = ref<BreadCrumbLinksType[] | null>(null);
const isActive = ref(false);

export default function () {

    const route = useRoute();

    function initBreadCrumbs(items: BreadCrumbLinksType[] | undefined) {
        if(!items) return;
        breadCrumbsItems.value = items;
        isActive.value = true;

    }

    watch(() => route.meta.breadCrumbs, (newValue) => {
        if(newValue) {
            initBreadCrumbs(newValue)
        }
        else {
            breadCrumbsItems.value = null;
            isActive.value = false;
        }
    })

    return {
        breadCrumbsItems,
        isActive,
        initBreadCrumbs
    }
}