<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MyJobApi from "@/pages/MyJob/api";
import type { ApplicationType, LaborLeaveTypesType, NewApplicationFormType } from "@/pages/MyJob/types";
import useLoading from "@/composables/useLoading";
import { useI18n } from "vue-i18n";
import { useCommonStore } from "@/store/Common";
import StatementContent from "@/pages/MyJob/components/Statement/StatementContent.vue";
import useToast from "@/components/UI/AppToast/useToast";
import ApplicationsList from "@/pages/MyApplications/Application/ApplicationsList.vue";

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const CommonStore = useCommonStore();
const { changeIsRequestLoading, isRequestLoading } = useLoading();
const {toast} = useToast();

const applicationTypes = ref<LaborLeaveTypesType[]>([]);
const laborLeaveTypes = ref<LaborLeaveTypesType[]>([]);
const application = ref<ApplicationType>({
  data: []
})

const activeAppTypeTitle = computed(() => {
  if(!route.query.type) return '';
  const foundItem = applicationTypes.value.find(i => +i.id === +route.query.type!);

  if(!foundItem) return '';

  return foundItem.name;
})

async function getApplicationTypes() {
  changeIsRequestLoading('getApplicationTypesApi', true);
  await MyJobApi
      .getApplicationTypesApi()
      .then((data) => {
        if(!data) return;
        applicationTypes.value = data;

        if(!route.query.type) {
          router.push({
            query: {
              ...route.query,
              type: data[0].id
            }
          })
        }
      })
      .finally(() => {
        changeIsRequestLoading('getApplicationTypesApi', false);
      })
}

async function getLaborLeaveTypes() {
  changeIsRequestLoading('getLaborLeaveTypes', true);
  await MyJobApi
      .getLaborLeaveTypesApi()
      .then((data) => {
        if(data) laborLeaveTypes.value = data;
      })
      .finally(() => {
        changeIsRequestLoading('getLaborLeaveTypes', false);
      })
}

async function getApplication() {
  if(!route.query.org || !route.query.type) return;

  const params = {
    company_tin: route.query.org,
    type: route.query.type,
    status: route.query.status
  }

  if(route.query.laborLeaveType) {
    params.labor_leave_type = route.query.laborLeaveType
  }

  changeIsRequestLoading('getApplication', true);
  await MyJobApi.getApplicationApi(params)
      .then((data) => {
        if(data) application.value = data;
      })
      .finally(() => {
        changeIsRequestLoading('getApplication', false);
      })
}

async function createApplication(form: NewApplicationFormType) {
  try {
    await MyJobApi.createApplicationApi(form);
    toast.success('Заявление успешно добавлено!');
    await getApplication();
    return await Promise.resolve();
  }
  catch (error) {
    return await Promise.reject();
  }
}

async function cancelApplication(id: number) {
  changeIsRequestLoading('getApplication', true);
  await MyJobApi
      .cancelApplicationApi(id, 2)
      .then((data) => {
        if(!data) return;
        getApplication();
        toast.success('Заявление успешно отменён!');
      })
      .catch(() => {
        changeIsRequestLoading('getApplication', false);
      });
}

function changeAppType(id: string) {
  if(route.query.type && +route.query.type === +id) return;

  router.push({
    query:{
      ...route.query,
      type: id
    }
  })
}

function setQuery() {
  const query: any = {
    ...route.query,
    type: route.query.type ?? 1
  };

  if(CommonStore.selectedJob) query.org = CommonStore.selectedJob;
  if(laborLeaveTypes.value.length && (route.query.type && +route.query.type === 1 && route.query.laborLeaveType)) {
    query.laborLeaveType = route.query.laborLeaveType ?? laborLeaveTypes.value[0].id;
  }
  else delete query.laborLeaveType;

  router.push({
    query: {
      ...query
    }
  })
}

onMounted(async () => {
  Promise.all([
    getApplicationTypes(),
    getLaborLeaveTypes(),
    CommonStore.getCurrentJobsList()
  ])
      .then((data) => {
        if(!data) return;

        setQuery();
        getApplication();

        watch(() => CommonStore.selectedJob, () => {
          setQuery();
        });

        watch(() => route.query, (newValue) => {
          if(!newValue || route.name !== 'MyJob Statement') return;
          setQuery();
          if(newValue.type && newValue.org) getApplication();
        })
      });
})
</script>

<template>
  <div class="bg-white pa-5 rounded-lg">
    <ApplicationsList
        :data="application"
        :laborLeaveTypes="laborLeaveTypes"
        :title="activeAppTypeTitle"
        :submit-fn="createApplication"
        :cancel-fn="cancelApplication"
    />
  </div>
</template>

<style lang="scss">
.statement__filters {
  border-bottom: 1px solid $light-gray;
  padding-bottom: 10px;
  margin-top: -5px;
  margin-bottom: 15px;

  &__btn {
    margin: 5px 15px 5px 0;
    height: 37px;
    border-color: $gray-stroke;

    .v-btn__overlay {
      opacity: 0;
    }

    .v-btn__content {
      color: $soft-black;
    }

    &--active {
      background-color: rgba(23, 146, 255, 0.10);
      border-color: $blue-color;

      .v-btn__content {
        color: $blue-color;
      }
    }
  }
}
</style>