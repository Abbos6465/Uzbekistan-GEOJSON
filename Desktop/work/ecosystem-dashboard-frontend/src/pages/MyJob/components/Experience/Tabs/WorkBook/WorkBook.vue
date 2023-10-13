<script
    setup
    lang="ts"
>
import { onMounted } from "vue";
import WorkBookTable from "./WorkBookTable.vue";
import { useCommonStore } from "@/store/Common";
import useLoading from "@/composables/useLoading";

const CommonStore = useCommonStore();
const {isRequestLoading} = useLoading();

onMounted(() => {
  CommonStore.getWorkbook();
})

</script>

<template>
  <div>
    <div class="bg-white px-5 pt-2 pb-5 rounded-b-lg">
      <h3 class="block-title--20 mb-6">{{ $t('main.currentPlaceOfWork') }}</h3>
      <WorkBookTable
          :data="CommonStore.currentWorkbook"
          :loading="isRequestLoading('getWorkbook')"
      />
    </div>

    <div class="bg-white pa-5 rounded-lg mt-7">
      <h3 class="block-title--20 mb-6">{{ $t('my-job.previousEmployment') }}</h3>
      <WorkBookTable
          :data="CommonStore.historyWorkBook"
          :loading="isRequestLoading('getWorkbook')"
          collapsable
      />
    </div>
  </div>
</template>

<style src="@/pages/MyJob/style.scss" lang="scss" />