<script
    setup
    lang="ts"
>
import { DataTable, Dialog } from "@/components/UI";
import { computed, onMounted, ref, watch } from "vue";
import useLoading from "@/composables/useLoading";
import { useAuthStore } from "@/store/Auth";
import { useCommonStore } from "@/store/Common";
import { useI18n } from "vue-i18n";
import commonApi from "@/api/commonApi";
import { createThenClickDownloadLink } from "@/utils/helper";
import type { WorkbookPrintApiType } from "@/types";

type PropsType = {
  modelValue: boolean
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {changeIsRequestLoading, isRequestLoading} = useLoading();
const {locale, t} = useI18n();

const workbook = ref<WorkbookPrintApiType[]>([]);

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

const workbookTableHeader = computed(() => {
  return [
    { key: "order", title: "№" },
    { key: "company_profile_name", title: t('main.Organization') },
    { key: "structure", title: t('main.Structure') },
    { key: "position", title: t('main.Position') },
    { key: "period", title: t('main.Date') },
  ];
});

async function getWorkBookPrint() {
  changeIsRequestLoading('getWorkBookPrint', true);
  await commonApi
      .getWorkbookPrintApi()
      .then((data) => {
        workbook.value = data;
      })
      .finally(() => {
        changeIsRequestLoading('getWorkBookPrint', false);
      });
}

async function downloadWorkbook() {
  return await commonApi.getWorkbookDownloadApi().then((data) => {
    if (!data) return;
    createThenClickDownloadLink(`WorkBook ${ AuthStore.fullName }`, data);

    return Promise.resolve();
  });
}

watch(computedModelValue, (newValue) => {
  if(newValue) getWorkBookPrint();
})

</script>

<template>
  <Dialog
      v-model="computedModelValue"
      width="1000px"
  >
    <template #title>{{ t("main.employmentHistory") }}</template>

    <template #default>
      <div class="pt-4">
        <div class="d-flex">
          <img
              :src="CommonStore.profilePhoto"
              class="personal-info__avatar"
              alt=""
          />

          <v-row>
            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.citizen") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.fullName }}
              </p>
            </v-col>
            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.DateBirth") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.birthdate }}
              </p>
            </v-col>
            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.pinfl") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.pin }}
              </p>
            </v-col>

            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.numberPassport") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.documentId }}
              </p>
            </v-col>
            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.location") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.address }}
              </p>
            </v-col>
            <v-col md="4">
              <h4 class="personal-info__item__title">
                {{ t("main.inn") }}:
              </h4>
              <p class="personal-info__item__value">
                {{ CommonStore.profileInfo?.tin }}
              </p>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mt-5 pb-4"/>
        <v-progress-linear
            v-if="isRequestLoading('getWorkBookPrint')"
            indeterminate
            color="#2988F5"
            style="margin-top: -16px"
        />

        <DataTable
            v-if="workbook.length"
            :headers="workbookTableHeader"
            :items="workbook"
            header-fixed
            max-height="40vh"
        >
          <template #order="item">
            {{ item.index + 1 }}
          </template>
          <template #structure="item">
            <div style="min-width: 150px">
              {{
                locale === "ru"
                    ? item.raw.structure_name_ru
                    : item.raw.structure_name
              }}
            </div>
          </template>
          <template #position="item">
            {{
              locale === "ru"
                  ? item.raw.position_name_ru
                  : item.raw.position_name
            }}
          </template>
          <template #period="item">
            <span class="text-no-wrap">от: {{ item.raw.date_start }}</span>
            <br/>
            <span
                class="text-no-wrap"
            >до:
                  {{
                item.raw.date_stop.includes("9999-")
                    ? t("main.today")
                    : item.raw.date_stop
              }}</span
            >
          </template>
        </DataTable>

        <v-btn
            height="46px"
            elevation="0"
            color="#2988F5"
            class="text-white rounded-lg no-uppercase mt-6 ml-auto d-flex"
            style="font-size: 16px"
            @click="downloadWorkbook"
        >
          {{ t("main.download") }}

          <svg
              data-src="/img/icons/download.svg"
              color="#fff"
              class="ml-3"
          />
        </v-btn>
      </div>
    </template>
  </Dialog>
</template>