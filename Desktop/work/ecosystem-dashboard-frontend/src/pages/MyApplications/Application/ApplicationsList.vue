<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { ApplicationType, LaborLeaveTypesType, NewApplicationFormType } from "@/pages/MyJob/types";
import {DataTable, AppSelect, AppTextarea, Dialog} from "@/components/UI";
import { useCommonStore } from "@/store/Common";
import useLoading from "@/composables/useLoading";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { DayMonthYearSelect } from "@/pages/MyJob/components";
import useValidate from "@/composables/useValidate";

type PropsType = {
  data: ApplicationType,
  laborLeaveTypes: LaborLeaveTypesType[]
  title: string
  submitFn: Function
  cancelFn: Function
}

const props = defineProps<PropsType>();

const {locale, t} = useI18n();
const router = useRouter();
const route = useRoute();
const CommonStore = useCommonStore();
const { changeIsRequestLoading, isRequestLoading } = useLoading();

const newApplication = ref<NewApplicationFormType>({
  company_tin: '',
  type: '',
  labor_leave_type: '',
  date_start: '',
  date_stop: '',
  comment: '',
});
const openedApplication = ref({
  status: '',
  period: '',
  type: '',
  comments: '',
  responsible: {
    avatar: '',
    name: '',
    position: ''
  }
});
const filters = ref<any>({
  type: route.query.laborLeaveType ? +route.query.laborLeaveType : null,
  status: ''
});
const isCreateDialogOpen = ref(false);
const isApplicationDialogOpen = ref(false);
const isStartDateFull = ref(true);
const hasError = ref([]);

const rules = computed(() => {
  const modifiedObj = {
    company_tin: {
      required: true
    },
    labor_leave_type: {
      required: +route.query.type === 1
    },
    date_start: {
      required: true,
      allFieldsMustBeFilled: () => newApplication.value.date_start.includes('null')
    },
    comment: {
      required: true,
    },
  }

  if((+route.query.type !== 2 && +route.query.type !== 5) && newApplication.value.date_start && !newApplication.value.date_start.includes('null')) {
    modifiedObj.date_stop = {
      required: true,
      allFieldsMustBeFilled: () => newApplication.value.date_stop.includes('null')
    }
  }

  return modifiedObj;
})

const v$ = useValidate(rules, newApplication);

const tableHeaders = computed(() => {
  if(+route.query.type! === 1) {
    return [
      {key: 'order', title: '№'},
      {key: 'status', title: t('main.status')},
      {key: 'date_start', title: t('my-job.VacationPeriod')},
      {key: 'type', title: t('my-job.StatementType')},
      {key: 'comment', title: t('common.comments')},
      {key: 'actions', title: t('common.actions')}
    ]
  }

  return [
    {key: 'order', title: '№'},
    {key: 'status', title: t('main.status')},
    {key: 'date_start', title: t('my-job.VacationPeriod')},
    {key: 'comment', title: t('common.comments')},
    {key: 'actions', title: t('common.actions')}
  ]
});
const statementStatus = computed(() => {
  return [
    {
      id: 1,
      name: t('application.status.1')
    },
    {
      id: 2,
      name: t('application.status.2')
    },
    {
      id: 3,
      name: t('application.status.3')
    },
    {
      id: 4,
      name: t('application.status.4')
    }
  ]
});

function appropriateLaborLeaveType(id: number) {
  return props.laborLeaveTypes.find(i => +i.id === +id) ?? null;
}

function openApplicationDialog(item: any) {
  openedApplication.value = item;
  isApplicationDialogOpen.value = true;
}

function setQuery() {
  const query: any = {...route.query};

  delete query.status;
  delete query.laborLeaveType;

  if(filters.value.type) query.laborLeaveType = filters.value.type;
  if(filters.value.status) query.status = filters.value.status;

  router.push({ query })
}

function clearCreateDialog() {
  newApplication.value = {
    company_tin: '',
    type: '',
    labor_leave_type: '',
    date_start: '',
    date_stop: '',
    comment: ''
  };
  v$.clear();
}

function dateInputValidate() {
  if(!newApplication.value?.date_stop?.includes('null')) {
    const start_date = new Date(newApplication.value?.date_start);
    const stop_date = new Date(newApplication.value?.date_stop);
    if(start_date >= stop_date){
      if(!hasError?.value.length) {
        setTimeout(() => {
          hasError.value.push(t('my-job.The-end-date-cannot-be-greater-than-the-start-date'));
        },100)
      }
    } else {
      hasError.value = [];
    }
  } else {
    console.log('wrong')
  }
}

async function submit() {

  if(v$.validate()) {
    if(route.query.type && +route.query.type !== 1) {
      delete newApplication.value.labor_leave_type;
    }
    if(route.query.type && +route.query.type === 5) {
      delete newApplication.value.date_stop;
    }

    if(route.query.type) newApplication.value.type = +route.query.type;

    changeIsRequestLoading('createStatement', true);
    await props
        .submitFn(newApplication.value)
        .then(() => {
          isCreateDialogOpen.value = false;
        })
        .finally(() => {
          changeIsRequestLoading('createStatement', false);
        });
  }
}

onMounted(() => {
  if(route.query.status) filters.value.status = +route.query.status;
})

watch(filters.value, () => {
  setQuery();
})

watch(() => newApplication.value.date_start, () => {
  if(!newApplication.value.date_start.includes('null')) {
    isStartDateFull.value = false;
  }
})

watch(() => newApplication.value.date_stop, () => {
  dateInputValidate()
})

</script>

<template>
  <div>
    <v-row class="mb-1">
      <v-col md="3">
        <h2 class="table-title">Список всех заявок</h2>
      </v-col>
    </v-row>

    <DataTable
        :headers="tableHeaders"
        :items="data.data"
        :loading="isRequestLoading(['getLaborLeaveTypes', 'getCurrentJobsList', 'getApplication'])"
        class="applications__table vacation__table"
    >
      <template #order="item">
        {{ item.index + 1 }}
      </template>
      <template #date_start="item">
        {{ item.columns.date_start }} <template v-if="item.raw.date_stop">- {{ item.raw.date_stop }}</template>
      </template>
      <template #status="item">
        <div>
          <div
              :class="['application-status', `application-status--${item.columns.status}`]"
          >
            {{ $t(`application.status.${item.columns.status}`) }}
          </div>
        </div>
      </template>
      <template #type="item">
        {{ appropriateLaborLeaveType(item.columns.type)?.name }}
      </template>
      <template #comment="item">
        <div style="max-width: 317px">
          {{ item.columns.comment  }}
        </div>
      </template>
      <template #actions="item">
        <v-btn
            v-if="item.raw.status === 1"
            width="155px"
            height="46px"
            variant="flat"
            class="v-btn--soft-red rounded-lg no-uppercase pt-1"
            style="color: #CB1520; font-size: 16px"
            @click="cancelFn(item.raw.id)"
        >
          {{ $t('common.cancel') }}
        </v-btn>
      </template>
    </DataTable>
  </div>

</template>

<style lang="scss">
@import '@/pages/MyApplications/style.scss';
.vacation {
  &__table {
    &__type {
      color: $blue-color;
      font-size: 16px;
      font-weight: 400;
      line-height: normal;
      text-decoration-line: underline;
    }
  }

  &__dialog {
    &__status {
      width: fit-content;
      height: 29px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 9px 6px 6px;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 400;
      line-height: normal;
      border-radius: 5px;
      margin-bottom: 20px;

      &--SENT {
        background: rgba(239, 174, 6, 0.15);
        color: $yellow;
      }

      &--REJECTED {
        background: rgba(240, 101, 72, 0.20);
        color: #F06548;
      }

      &--CONFIRMED {
        background: rgba(69, 203, 133, 0.20);
        color: #45CB85;
      }
    }
  }
}
.table-title {
  color: #373B55;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
</style>