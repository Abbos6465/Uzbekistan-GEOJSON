<script
    setup
    lang="ts"
>
import { onMounted, ref, watch } from "vue";
import axiosInstance from "@/api/axiosInstance";
import useLoading from "@/composables/useLoading";
import { useCommonStore } from "@/store/Common";

type PropsType = {
  href: string
  class?: string
}

const props = defineProps<PropsType>();

const CommonStore = useCommonStore();
const {changeIsRequestLoading, isRequestLoading} = useLoading();
const src = ref('');

async function getImg() {
  if(isRequestLoading('getAppImg')) return;

  changeIsRequestLoading('getAppImg', true);
  await CommonStore
      .getImage(props.href)
      .then((data) => {
        src.value = data;
      })
      .finally(() => {
        changeIsRequestLoading('getAppImg', false);
        watch(() => props.href, () => {
          getImg()
        })
      });
}

onMounted(() => {
  getImg();
})
</script>

<template>
  <div class="app-img">
    <v-progress-circular
        v-if="isRequestLoading('getAppImg')"
        indeterminate
    />
    <img
        v-else
        :src="src"
        :class="props.class"
        alt=""
    />
  </div>
</template>

<style lang="scss">
.app-img {
  display: flex;
  align-self: stretch;
}
</style>