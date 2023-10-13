<script
    setup
    lang="ts"
>
import { computed, onMounted, ref } from "vue";
import { DataTable } from "@/components/UI";
import DiplomaCertificatesApi from "@/pages/DiplomaCertificates/api";
import useLoading from "@/composables/useLoading";
import { useCommonStore } from "@/store/Common";
import type { DiplomaType } from "@/types";
import {useI18n} from "vue-i18n";
import { dateFormat, reverseStringToDate } from "../../utils/helper";

const CommonStore = useCommonStore();
const { changeIsRequestLoading, isRequestLoading } = useLoading();
const {t} = useI18n();

const certificates = ref<DiplomaType[] | []>([]);

const diplomaTableHeaders = computed(() => {
  return [
    { key: 'order', title: '№' },
    { key: 'degree_name', title: t('cv.degree') },
    { key: 'institution_name', title: t('cv.NameEducationalInstitution') },
    { key: 'speciality_name', title: t('certificates.Speciality') },
    { key: 'edu_starting_date', title: t('certificates.YearAdmission') },
    { key: 'edu_finishing_date', title: t('certificates.YearEnding') },
    { key: 'diploma_serial', title: t('certificates.SeriesDiploma') },
    { key: 'diploma_given_date', title: t('certificates.DiplomaIssueDate') },
    { key: 'status_name', title: t('main.status') },
  ]
});
const certificateTableHeaders = computed(() => {
  return [
    { key: 'order', title: '№' },
    { key: 'institution', title: t('certificates.PlaceAdvancedTraining') },
    { key: 'speciality', title: t('certificates.institutionName') },
    { key: 'date_start', title: t('certificates.EduStartingDate') },
    { key: 'date_stop', title: t('certificates.EduFinishingDate') },
    { key: 'numberOfCertificate', title: t('certificates.diplomaSerial') },
  ]
});


async function getCertificates() {
  changeIsRequestLoading('getCertificateApi', true);
  await DiplomaCertificatesApi
      .getCertificateApi()
      .then((data) => {
        if(data) certificates.value = data
      })
      .finally(() => {
        changeIsRequestLoading('getCertificateApi', false);
      });
}

onMounted(() => {
  Promise.all([
    CommonStore.getDiplomas(),
    getCertificates()
  ])
})
</script>

<template>
  <div>
    <div class="bg-white rounded-lg pa-5 mb-6">
      <h3 class="block-title--20 mb-5">{{ $t('certificates.diploma') }}</h3>

      <DataTable
          :headers="diplomaTableHeaders"
          :items="CommonStore.diplomas"
          :loading="isRequestLoading('getDiplomaApi')"
      >
        <template #status="item">
          <div>
            <div
                :class="['application-status', `application-status--${item.columns.status}`]"
            >
              {{ $t(`statuses.${ item.columns.status }`) }}
            </div>
          </div>
        </template>

        <template #diploma_given_date="item">
          <div class="text-no-wrap">
            {{ dateFormat(new Date(item.columns.diploma_given_date)) }}
          </div>
        </template>

      </DataTable>
    </div>

    <div class="bg-white rounded-lg pa-5">
      <h3 class="block-title--20 mb-5">{{ $t('certificates.certificates') }}</h3>

      <DataTable
          :headers="certificateTableHeaders"
          :items="certificates"
          :loading="isRequestLoading('getCertificateApi')"
      >
        <template #order="item">
          {{ item.index + 1 }}
        </template>

        <template #date_start="item">
          <div class="text-no-wrap">
            {{ dateFormat(reverseStringToDate(item.columns.date_start)) }}
          </div>
        </template>

        <template #date_stop="item">
          <div class="text-no-wrap">
            {{ dateFormat(reverseStringToDate(item.columns.date_stop)) }}
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>