<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AppSelect, DataTable } from "@/components/UI";
import { useAuthStore } from "@/store/Auth";
import {useI18n} from "vue-i18n";
import MyJobApi from "@/pages/MyJob/api";
import useLoading from "@/composables/useLoading";
import { useCommonStore } from "@/store/Common";

type AttorneyDataType = {
  "current_page"?: number
  "data": {
      "company_tin": string
      "created_at": string
      "end_date": string
      "full_name": string
      "id": number
      "number": string
      "person_pin": string
      "position_id": number
      "position_name": string
      "qr_id": string
      "reg_date": string
      "status": string
      "type": number
      "updated_at": string
    }[],
  "first_page_url"?: string
  "from"?: number
  "last_page"?: number
  "last_page_url"?: string
  "next_page_url"?: null,
  "path"?: string
  "per_page"?: number
  "prev_page_url"?: null,
  "to"?: number
  "total"?: number
}

const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {t} = useI18n();
const {changeIsRequestLoading, isRequestLoading} = useLoading();

const attorneys = ref<AttorneyDataType>({
  data: []
});

const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'type', title: t('common.RequestType')},
    {key: 'reg_date', title: t('rightBar.start_date')},
    {key: 'end_date', title: t('rightBar.end_date')},
    {key: 'actions'},
  ]
});

async function getAttorneys() {
  changeIsRequestLoading('getAttorneys', true);
  await MyJobApi
      .getAttorneyApi()
      .then((response) => {
        attorneys.value = response;
      })
      .finally(() => {
        changeIsRequestLoading('getAttorneys', false);
      });
}

onMounted(() => {
  // if(route.query.status) filters.value.status = +route.query.status;

  Promise.all([
    getAttorneys(),
    CommonStore.getCurrentJobsList()
  ])
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <DataTable
        :headers="tableHeaders"
        :items="attorneys.data"
        :loading="isRequestLoading('getAttorneys')"
    >
      <template #order="item">
        {{ item.index + 1 }}
      </template>

      <template #type="item">
        {{ $t(`attorneyType.${item.columns.type}`) }}
      </template>

      <template #actions="item">
        <v-btn
            height="46px"
            variant="flat"
            class="v-btn--soft-blue rounded-lg no-uppercase"
            style="color: #2988F5; font-size: 16px"
        >
          {{ $t('main.download') }}
        </v-btn>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>