<script
    setup
    lang="ts"
>
import { computed, ref, watch } from "vue";
import { YearPicker } from "@/components/UI";
import { RightDialog } from "@/components/Composite";
import MyJobApi from "@/pages/MyJob/api";
import { dateFormat } from "@/utils/helper";
import type { SalaryByOrgMonthsType } from "@/pages/MyJob/types";
import useLoading from "@/composables/useLoading";

type PropsType = {
  modelValue: boolean
  company: {
    tin: string,
    name: string,
    dateStart: string
    dateStop: string
  }
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const { changeIsRequestLoading, isRequestLoading } = useLoading();

const year = ref(new Date().getFullYear());
const months = ref<SalaryByOrgMonthsType[]>([]);

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

const computedMonths = computed(() => {
  let modifiedMonths: SalaryByOrgMonthsType[] = [];

  for (let i = 0; i < 12; i++) {
    const foundMonth = months.value.find(({ month }) => month === (i + 1));
    const month = {
      month: i + 1,
      company_tin: '',
      salary: 0
    };

    if (foundMonth) modifiedMonths.push(foundMonth);
    else modifiedMonths.push(month)
  }

  modifiedMonths = [
    [...modifiedMonths.slice(0, 3)],
    [...modifiedMonths.slice(3, 6)],
    [...modifiedMonths.slice(6, 9)],
    [...modifiedMonths.slice(9, 12)]]

  return modifiedMonths;
})

async function getSalary() {
  changeIsRequestLoading('getSalaryByOrgApi', true);
  months.value = await MyJobApi
      .getSalaryByOrgApi({
        company_tin: props.company.tin,
        year: year.value
      })
      .finally(() => {
        changeIsRequestLoading('getSalaryByOrgApi', false);
      })
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.company?.tin) {
    getSalary();

    watch(year, () => {
      if (!props.modelValue) return;
      getSalary()
    })
  } else {
    year.value = new Date().getFullYear();
  }
})
</script>

<template>
  <RightDialog
      v-model="computedModelValue"
      class="salary-info-dialog"
  >
    <template #title>{{ $t('my-job.SalaryInformation') }}</template>

    <div class="d-flex flex-column pa-5 h-100 overflow-y-auto">

      <div class="salary-info-dialog__org">
        <h4 class="block-title--14 mb-2">{{ $t('main.Organization') }}</h4>
        <div class="d-flex align-center mb-7">
          <h3 class="salary-info-dialog__org__name">
            {{ company.name }}
          </h3>
        </div>

        <h4 class="block-title--14 mb-2">{{ $t('my-job.PeriodEmployment') }}</h4>
        <div class="d-flex align-center">
          <div class="salary-info-dialog__org__date">
            С {{ dateFormat(new Date(company.dateStart), 'dd MMMM yyyy') }}
          </div>
          <span class="flex-1-1 text-center">---</span>
          <div class="salary-info-dialog__org__date">
            {{
              company.dateStop.includes('9999') ? $t('common.UntilNow') : 'До ' + dateFormat(new Date(company.dateStop), 'dd MM yyyy')
            }}
          </div>
        </div>
      </div>

      <YearPicker
          v-model="year"
          class="mt-5"
      />

      <v-progress-linear
          v-if="isRequestLoading('getSalaryByOrgApi')"
          indeterminate
          color="#2988F5"
      />

      <div
          v-else
          class="d-flex flex-column my-5"
      >
        <div
            v-for="(tr, trIndex) in computedMonths"
            :key="trIndex"
            class="salary-info-dialog__months-tr"
        >
          <div
              v-for="(month, monthIndex) in tr"
              :key="monthIndex"
              class="salary-info-dialog__month"
          >
            <h4 class="salary-info-dialog__month__name">{{ $t(`month.${ month.month }`) }}</h4>
            <p class="salary-info-dialog__month__value salary-info-dialog__month__value--zero">{{ month.salary }}
              {{ $t('sum') }}</p>
          </div>
        </div>
      </div>

      <v-btn
          height="46px"
          color="#2988F5"
          class="rounded-lg no-uppercase text-white mt-auto"
      >
        {{ $t('my-job.DownloadExcel') }}

        <svg
            data-src="/img/icons/arrow-up.svg"
            style="transform: rotate(180deg); color: #fff; margin-left: 10px"
        />
      </v-btn>

    </div>
  </RightDialog>
</template>

<style lang="scss">
.salary-info-dialog {
  &__org {
    display: flex;
    flex-direction: column;
    background: $light-gray;
    border-radius: 10px;
    padding: 10px;

    &__icon {
      min-width: 35px;
      max-width: 35px;
      height: 35px;
      border: 1px solid #F6F8FA;
      border-radius: 50%;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__name {
      width: 290px;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
    }

    &__date {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
      white-space: nowrap;
    }
  }

  &__months-tr {
    display: flex;
    background: #FFFFFF;
    border: 1px solid $stroke-color;
    filter: drop-shadow(0px 4px 9px rgba(0, 0, 0, 0.05));
    border-radius: 5px;

    & + & {
      margin-top: 20px;
    }
  }

  &__month {
    width: 33.33333%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;

    &:not(&:first-child) {
      border-left: 1px solid $stroke-color;
    }

    &__name {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: $blue-color;
      margin-bottom: 4px;
      text-align: center;
      white-space: nowrap;
    }

    &__value {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: $black-color;
      text-align: center;
      white-space: nowrap;

      &--zero {
        color: $soft-black;
      }
    }
  }
}
</style>