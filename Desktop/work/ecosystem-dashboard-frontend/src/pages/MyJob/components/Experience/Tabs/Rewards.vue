<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { DataTable } from "@/components/UI";
import api from "@/pages/MyJob/api";
import { useI18n } from "vue-i18n";
import useLoading from "@/composables/useLoading";
import { dateFormat } from "@/utils/helper";

type RewardType = {
  order: number,
  given_date: string
  reward_type: string
  reward_type_ru: string
  kpi_percentage: string
  status: number
  amount: string
}

const {locale,t} = useI18n();
const rewards = ref<RewardType[]>([]);
const {changeIsRequestLoading, isRequestLoading} = useLoading();

const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'given_date', title: t('common.date')},
    {key: locale.value === 'uz' ? 'reward_type' : 'reward_type_ru', title: t('common.type')},
    {key: 'kpi_percentage', title: t('my-job.PercentageKPI')},
    {key: 'status', title: t('main.status')},
    {key: 'amount', title: t('my-job.stimulus')}
  ]
});

async function getRewards() {
  changeIsRequestLoading('getRewardsApi', true);
  await api.getRewardsApi()
      .then((response) => {
        if(!response) return;

        rewards.value = response.map((item, index) => {
          return {
            order: index + 1,
            given_date: item.given_date,
            reward_type: item.reward_type,
            reward_type_ru: item.reward_type_ru,
            kpi_percentage: item.kpi_percentage,
            status: item.status,
            amount: item.amount
          };
        });
      })
      .finally(() => {
        changeIsRequestLoading('getRewardsApi', false);
      });
}

onMounted(() => {
  getRewards()
})
</script>

<template>
  <div class="bg-white px-5 pb-5 rounded-b-lg">
    <DataTable
        :headers="tableHeaders"
        :items="rewards"
        :loading="isRequestLoading('getRewardsApi')"
        class="statement__table"
    >
      <template #given_date="item">
        {{ dateFormat(new Date(item.columns.given_date), 'dd MMMM yyyy') }}
      </template>

      <template #status="item">
        <div>
          <div
              :class="['application-status', `application-status--${item.columns.status}`]"
          >
            {{ $t(`statuses.${item.columns.status}`) }}
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>