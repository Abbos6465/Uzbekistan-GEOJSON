<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { DataTable } from "@/components/UI";
import api from "@/pages/MyJob/api";
import { useI18n } from "vue-i18n";
import useLoading from "@/composables/useLoading";
import { dateFormat } from "@/utils/helper";

type SickSheetType = {
  order: number,
  end_date: string
  fio: string
  number: string
  organization_gave: string
  reason_name: number
  reason_name_ru: string
  reason_name_uz: string
  series: string
  validFrom: string
}

const {locale,t} = useI18n();
const sickSheet = ref<SickSheetType[]>([]);
const {changeIsRequestLoading, isRequestLoading} = useLoading();

const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'fio', title: t('my-job.SurnameNamePatronymic')},
    {key: 'organization_gave', title: t('main.Organization')},
    {key: 'start_date', title: t('common.date')},
    {key: locale.value === 'uz' ? 'reason_name_uz' : 'reason_name_ru', title: t('rightBar.in_reason')},
    {key: 'series', title: t('my-job.serial')}
  ]
});

async function getSickSheet() {
  changeIsRequestLoading('getSickSheetApi', true);
  await api.getSickSheetsApi()
      .then((response) => {
        if(!response) return;

        sickSheet.value = response.map((item, index) => {
          return {
            order: index + 1,
            end_date: item.end_date,
            fio: item.fio,
            number: item.number,
            organization_gave: item.organization_gave,
            reason_name: item.reason_name,
            reason_name_ru: item.reason_name_ru,
            reason_name_uz: item.reason_name_uz,
            series: item.series,
            start_date: item.start_date,
            validFrom: item.validFrom,
          };
        });
      })
      .finally(() => {
        changeIsRequestLoading('getSickSheetApi', false);
      });
}

onMounted(() => {
  getSickSheet()
})
</script>

<template>
  <div class="bg-white px-5 pb-5 rounded-b-lg">
    <DataTable
        :headers="tableHeaders"
        :items="sickSheet"
        :loading="isRequestLoading('getSickSheetApi')"
        class="statement__table"
    >
      <template #start_date="item">
        <div class="text-no-wrap">
          {{ dateFormat(new Date(item.columns.start_date), 'dd MMMM yyyy') }} - {{ dateFormat(new Date(item.raw.end_date), 'dd MMMM yyyy') }}
        </div>
      </template>
    </DataTable>
  </div>
</template>