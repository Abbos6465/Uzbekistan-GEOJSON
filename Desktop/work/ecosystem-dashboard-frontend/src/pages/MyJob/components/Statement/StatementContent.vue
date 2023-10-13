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

function openCreateDialog() {
  if(CommonStore.currentJobs.length === 1) {
    newApplication.value.company_tin = CommonStore.currentJobs[0].company_tin;
  }

  isCreateDialogOpen.value = true;
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
        <AppSelect
            v-model="CommonStore.selectedJob"
            :items="CommonStore.currentJobs"
            item-value="company_tin"
            item-title="company_name"
            :disabled="CommonStore.currentJobs.length === 1"
            :placeholder="$t('common.ChooseOrganization')"
            :loading="isRequestLoading('getCurrentJobsList')"
        />
      </v-col>
      <v-col
          v-if="+route.query.type === 1"
          md="3"
      >
        <AppSelect
            v-model="filters.type"
            :items="laborLeaveTypes"
            item-value="id"
            item-title="name"
            clearable
            :placeholder="$t('my-job.Leave-type')"
            :loading="isRequestLoading('getLaborLeaveTypes')"
        />
      </v-col>
      <v-col md="3">
        <AppSelect
            v-model="filters.status"
            :items="statementStatus"
            item-value="id"
            item-title="name"
            :placeholder="$t('main.status')"
            clearable
        />
      </v-col>
      <v-col
          :offset-md="+route.query.type !== 1 ? 3 : ''"
          md="3"
      >
        <v-btn
            height="46px"
            elevation="0"
            color="#2988F5"
            class="no-uppercase rounded-lg text-white ml-auto d-flex"
            style="font-size: 16px; width: fit-content"
            @click="openCreateDialog"
        >
          <v-icon
              icon="mdi-plus"
              class="mr-2"
              style="font-size: 25px"
          />

          <span>{{ $t('common.create') }}</span>
        </v-btn>
      </v-col>
    </v-row>

    <DataTable
        :headers="tableHeaders"
        :items="data.data"
        :loading="isRequestLoading(['getLaborLeaveTypes', 'getCurrentJobsList', 'getApplication'])"
        class="statement__table vacation__table"
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
<!--        <div>-->
<!--          <button-->
<!--              class="vacation__table__type"-->
<!--              @click="openApplicationDialog(item.columns)"-->
<!--          >-->
<!--            {{ locale === 'ru' ? appropriateLaborLeaveType(item.columns.type)?.name_ru : appropriateLaborLeaveType(item.columns.type)?.name_uz }}-->
<!--          </button>-->
<!--        </div>-->
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

    <teleport to="body">
      <Dialog
          v-model="isApplicationDialogOpen"
          width="520px"
          class="vacation__dialog"
      >

      </Dialog>

      <Dialog
          v-model="isCreateDialogOpen"
          width="750px"
          @close="clearCreateDialog"
      >
        <template #title>{{ title }}</template>

        <v-row class="mt-4">
          <v-col cols="12">
            <AppSelect
                v-model="newApplication.company_tin"
                :items="CommonStore.currentJobs"
                item-value="company_tin"
                item-title="company_name"
                clearable
                required
                :disabled="CommonStore.currentJobs.length === 1"
                :placeholder="$t('common.ChooseOrganization')"
                :loading="isRequestLoading('getCurrentJobsList')"
                :has-error="v$.errors.value.company_tin?.message"
                class="mb-2"
            >
              <template #label>{{ $t('main.Organization') }}</template>
            </AppSelect>
          </v-col>

          <v-col
              v-if="+route.query.type === 1"
              cols="12"
          >
            <AppSelect
                v-model="newApplication.labor_leave_type"
                :items="laborLeaveTypes"
                item-value="id"
                item-title="name"
                required
                :placeholder="$t('my-job.choose-leave-type')"
                :loading="isRequestLoading('getLaborLeaveTypes')"
                :has-error="v$.errors.value.labor_leave_type?.message"
                class="mb-2"
            >
              <template #label>{{ $t('my-job.Leave-type') }}</template>
            </AppSelect>
          </v-col>

          <v-col cols="12">
            <DayMonthYearSelect
                v-model="newApplication.date_start"
                :title="$t('main.startDate')"
                required
                :has-error="v$.errors.value.date_start?.message"
            />
          </v-col>

          <v-col
              v-if="+route.query.type !== 2 && +route.query.type !== 5 && +route.query.type !== 4"
              cols="12"
          >
            <DayMonthYearSelect
                v-model="newApplication.date_stop"
                :title="$t('main.stopDate')"
                :disabled="isStartDateFull"
                :has-error="v$.errors.value.date_stop?.message"
                @blurInput="dateInputValidate()"
                required
            />
          </v-col>

          <v-col cols="12">
            <AppTextarea
                v-model="newApplication.comment"
                required
                :has-error="v$.errors.value.comment?.message"
                :placeholder="$t('my-job.EnterComment')"
            >
              <template #label>{{ $t('my-job.comments') }}</template>
            </AppTextarea>
          </v-col>
        </v-row>

        <v-btn
            height="46px"
            elevation="0"
            color="#2988F5"
            class="px-5 rounded-lg text-white no-uppercase ml-auto d-flex mt-5"
            :loading="isRequestLoading('createStatement')"
            @click="submit"
        >
          {{ $t('my-job.send') }}
        </v-btn>
      </Dialog>
    </teleport>
  </div>

</template>

<style lang="scss">
@import '@/pages/MyJob/style.scss';

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
</style>