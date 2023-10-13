<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import SalaryInformationDialog from "@/pages/MyJob/components/Experience/SalaryInformationDialog.vue";
import { ExpansionDataTable } from "@/components/UI";
import type { WorkBookSingleType } from "@/types";
import { dateFormat } from "@/utils/helper";

type PropsType = {
  data: {
    organization: string,
    positions: WorkBookSingleType[]
  }[],
  collapsable?: boolean
  loading?: boolean
}

const props = defineProps<PropsType>();
const { t, locale } = useI18n();

const collapsedItems = ref([]);
const isSalaryInfoDialogOpen = ref(false);
const selectedCompany = ref<any>(null);

const tableHeaders = computed(() => {
  return [
    { key: locale.value === 'uz' ? 'position_name' : 'position_name_ru', title: t('laborActivity.position') },
    { key: locale.value === 'uz' ? 'structure_name' : 'structure_name_ru', title: t('laborActivity.subdivision') },
    { key: 'contract_number', title: t('laborActivity.contractNumber') },
    { key: 'order_number', title: t('laborActivity.order') },
    { key: 'date_start', title: t('common.date') },
  ]
});

function openSalaryInfoDialog(company: any) {
  isSalaryInfoDialogOpen.value = true;
  selectedCompany.value = company;
}

</script>

<template>
  <div>
    <ExpansionDataTable
        v-for="(org, index) in data"
        :key="index"
        :title="org.organization"
        :headers="tableHeaders"
        :items="org.positions"
        item-value="id"
        class="current-work__table"
        :loading="loading"
        :collapsable="collapsable"
        v-model:collapsed="collapsedItems"
    >
      <template #title>{{ $t('main.Organization') }}:</template>

      <template #top-button="company">
        <v-btn
            height="46px"
            variant="flat"
            elevation="0"
            class="v-btn--soft-red rounded-lg no-uppercase pt-1 mr-5"
            href="https://my.gov.uz/"
            style="color: #CB1520; font-size: 16px; margin-right: 10px;"
        >
          <svg
              data-src="/img/icons/exclamation.svg"
              class="mr-2"
          />

          {{ $t('my-job.FoundBug') }}
        </v-btn>
        <v-btn
            variant="flat"
            height="46px"
            class="ml-auto rounded-lg text-white no-uppercase"
            color="#2988F5"
            style="letter-spacing: unset"
            @click="openSalaryInfoDialog(company)"
        >
          {{ $t('my-job.ViewSalary') }}
        </v-btn>
      </template>

      <template #body-td="{item, columns}">
        <td
            v-for="(value, index) in item.columns"
            :key="index"
        >
          <h4 class="current-work__table__title">
            <template v-if="index === 'position_name'">
              {{ $t(`workbook.actionTypes.${item.raw.transaction_type_id}`) }}
            </template>
            <template v-else>
              {{ columns.find(i => i.key === index)?.title }}
            </template>
          </h4>

          <div
              :class="['current-work__table__value', {
                          'current-work__table__value--wrap': index.includes('structure_name'),
                          'current-work__table__value--blue': ['order_number', 'contract_number'].includes(index)
                        }]"
          >
            <template v-if="index.includes('structure_name')">
              {{ value ? value : item.raw.structure_name ? item.raw.structure_name : '-' }}
            </template>

            <template v-else-if="index === 'contract_number'">
              {{ value ? `№${value} от ${dateFormat(new Date(item.raw.contract_date), 'dd MMMM yyyy')}` : '-' }}
            </template>

            <template v-else-if="index === 'order_number'">
              {{ value ? `№${value} от ${dateFormat(new Date(item.raw.order_date), 'dd MMMM yyyy')}` : '-' }}
            </template>

            <template v-else-if="index === 'date_start'">
              {{ dateFormat(new Date(value), 'dd MMMM yyyy') }}
            </template>

            <template v-else>
              {{ value }}
            </template>
          </div>
        </td>
      </template>

      <template #expand-td="child">
        <td>
          <div>
            <p class="current-work__table__value">
              {{ $t(`workbook.actionTypes.${child?.transaction_type_id}`) }}
            </p>
          </div>
        </td>
        <td>
          <h4 class="current-work__table__title">{{ $t('laborActivity.additionalAgreements') }}:</h4>
          <p class="current-work__table__value current-work__table__value--blue">
            {{ child?.contract_number ? `№${child?.contract_number} от ${dateFormat(new Date(child?.contract_date), 'dd MMMM yyyy')}` : '-' }}
          </p>
        </td>
        <td>
          <h4 class="current-work__table__title">{{ $t('laborActivity.order') }}:</h4>
          <p class="current-work__table__value current-work__table__value--blue">
            {{ child?.order_number ? `№${child?.order_number} от ${dateFormat(new Date(child?.order_date), 'dd MMMM yyyy')}` : '-' }}
          </p>
        </td>
        <td>
          <h4 class="current-work__table__title">{{ $t('common.date') }}:</h4>
          <p class="current-work__table__value">{{ dateFormat(new Date(child?.date_start), 'dd MMMM yyyy') }}</p>
        </td>
        <td>
          <v-btn
              variant="text"
              color="#2988F5"
              class="ml-auto d-flex no-uppercase"
          >
            {{ $t('my-job.CheckEDS') }}
          </v-btn>
        </td>
      </template>
    </ExpansionDataTable>

    <SalaryInformationDialog
        v-model="isSalaryInfoDialogOpen"
        :company="{
          tin: selectedCompany?.company_tin,
          name: selectedCompany?.company_name,
          dateStart: selectedCompany?.date_start,
          dateStop: selectedCompany?.date_stop
        }"
    />
  </div>
</template>

<style lang="scss">

</style>