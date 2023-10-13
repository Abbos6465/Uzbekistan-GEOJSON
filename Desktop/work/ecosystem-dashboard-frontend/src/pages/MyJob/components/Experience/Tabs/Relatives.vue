<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { DataTable } from "@/components/UI";
import useLoading from "@/composables/useLoading";
import CommonApi from "@/api/commonApi";
import { useCommonStore } from "@/store/Common";

const {t} = useI18n();
const CommonStore = useCommonStore();
const {isRequestLoading} = useLoading();

const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'relativeType', title: t('my-job.RelationDegree')},
    {key: 'fullName', title: t('my-job.SurnameNamePatronymic')},
    {key: 'birthDateAndPlace', title: t('my-job.DatePlaceBirth')},
    {key: 'workAndPosition', title: t('my-job.workAndPosition')},
    {key: 'address', title: t('my-job.address')}
  ]
});

onMounted(() => {
  CommonStore.getRelatives()
})
</script>

<template>
  <div class="bg-white px-5 pb-5 rounded-b-lg">
    <DataTable
        :headers="tableHeaders"
        :items="CommonStore.relatives"
        :loading="isRequestLoading('getRelatives')"
    >
      <template #relativeType="item">
        {{ $t(`relatives.typeId.${item.columns.relativeType}`) }}
      </template>
      <template #birthDateAndPlace="item">
        <p>{{ item.raw.birthDate }}</p>
        <p>{{ item.raw.birthPlace }}</p>
      </template>
      <template #workAndPosition="item">
        <div
            class="relatives-tab__work-position"
            :title="item.columns.workAndPosition"
        >
          {{ item.columns.workAndPosition ?? $t('common.noData') }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style lang="scss">
.relatives-tab {
  &__work-position {
    max-width: 320px;
  }
}
</style>