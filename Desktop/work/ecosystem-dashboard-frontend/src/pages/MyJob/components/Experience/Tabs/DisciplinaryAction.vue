<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { DataTable } from "@/components/UI";
import api from "@/pages/MyJob/api";
import { useI18n } from "vue-i18n";
import useLoading from "@/composables/useLoading";
import { dateFormat } from "@/utils/helper";

type DisciplinaryActionsType = {
  order: number,
  given_date: string
  penalty_type: string
  penalty_type_ru: string
  penalty_reason: string
  penalty_reason_ru: string
  percentage: string
  expired_at: string
  status: string
}

const {locale, t} = useI18n();
const disciplinaryActions = ref<DisciplinaryActionsType[]>([]);
const {changeIsRequestLoading, isRequestLoading} = useLoading();

const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'given_date', title: t('common.birthdate')},
    {key: locale.value === 'uz' ? 'penalty_type' : 'penalty_type_ru', title: t('common.type')},
    {key: locale.value === 'uz' ? 'penalty_reason' : 'penalty_reason_ru', title: t('rightBar.in_reason')},
    {key: 'percentage', title: t('my-job.PenaltyPercentage')},
    {key: 'status', title: t('main.status')},
    {key: 'expired_at', title: t('cv.stopDateStudy')},
  ]
});

async function getDisciplinaryActions() {
  changeIsRequestLoading('getDisciplinaryActionsApi', true);
  await api
      .getDisciplinaryActionsApi()
      .then((response) => {
        if(!response) return;

        disciplinaryActions.value = response.map((item, index) => {
          let status = '';

          if(calcDate(item.expired_at)) status = 'EXPIRED';
          else if(item.status === 1) status = 'ACTIVE';
          else if(item.status === 2) status = 'REJECTED';

          return {
            order: index + 1,
            given_date: item.given_date,
            penalty_type: item.penalty_type,
            penalty_type_ru: item.penalty_type_ru,
            penalty_reason: item.penalty_reason,
            penalty_reason_ru: item.penalty_reason_ru,
            percentage: item.percentage,
            expired_at: item.expired_at,
            status
          };
        });
      })
      .finally(() => {
        changeIsRequestLoading('getDisciplinaryActionsApi', false);
      });
}

function calcDate(date: string) {
  const dt2: Date = new Date();
  const dt1: Date = new Date(date);

  return dt2.getTime() - dt1.getTime() >= 0;
}

onMounted(() => {
  getDisciplinaryActions();
})
</script>

<template>
  <div class="bg-white px-5 pb-5 rounded-b-lg">
    <DataTable
        :headers="tableHeaders"
        :items="disciplinaryActions"
        :loading="isRequestLoading('getDisciplinaryActionsApi')"
        class="statement__table"
    >
      <template #status="item">
        <div>
          <div
              :class="['application-status', `application-status--${item.columns.status}`]"
          >
            {{ $t(`statuses.${item.columns.status}`) }}
          </div>
        </div>
      </template>

      <template #given_date="item">
        {{ dateFormat(new Date(item.columns.given_date)) }}
      </template>

      <template #expired_at="item">
        {{ dateFormat(new Date(item.columns.expired_at)) }}
      </template>
    </DataTable>
  </div>
</template>