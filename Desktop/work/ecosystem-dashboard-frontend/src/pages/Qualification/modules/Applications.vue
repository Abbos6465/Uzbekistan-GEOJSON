<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import QualificationApi from "@/pages/Qualification/api";
import {useAuthStore} from "@/store/Auth";
import {useI18n} from "vue-i18n";
import useLoading from "@/composables/useLoading";
import {DataTable} from "@/components/UI";


const AuthStore = useAuthStore();
const {t} = useI18n();
const tableData = ref([]);
const {isRequestLoading} = useLoading();

const applicationsTableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'status', title: t('main.status')},
    {key: 'edu_name', title: t('qualification.NameTrainingCenter')},
    {key: 'trained_profession', title: t('certificates.institutionName')},
    {key: 'edu_period', title: t('qualification.TrainingPeriod')},
    {key: 'departure_date', title: t('qualification.departureDate')}
  ]
});

async function getAppealPaidCourse(pin = {}) {
  await QualificationApi.getAppealPaidCourse(pin)
      .then((res) => {
        tableData.value = res;
      })
      .catch((err) => {
        console.log(err);
      })
};

onMounted(async () => {
  const authInfo = AuthStore.authInfo;
  if (authInfo) {
    getAppealPaidCourse({pin: authInfo.person_pin});
  }
})

</script>

<template>
  <div class="applications pa-5 bg-white pa-5 rounded-lg w-100 h-100">
    <div class="applications__head">
      <div class="title mb-5 block-title--20">
        {{ $t('menu.MyApplications') }}
      </div>
      <v-divider :thickness="1"/>
    </div>
    <div class="applications_body mt-5">
      <DataTable
          maxHeight="500px"
          :headers="applicationsTableHeaders"
          :items="tableData"
          :loading="isRequestLoading('getAppealPaidCourse')"
      >
        <template #order="item">
          {{ item.index + 1 }}
        </template>
        <template #status="item">
          <v-chip
              v-if="item.selectable.status"
              class="p-1 applications__table__status align-center"
              :class="`applications__table__status-${item.selectable.status}`"
          >
            <span v-if="item.selectable.status=='new'">
                {{ t('statuses.SENT') }}
            </span>
            <span v-if="item.selectable.status=='confirmed'">
              {{ t('statuses.1') }}
            </span>
            <span v-if="item.selectable.status=='canceled'">
              {{ t('statuses.3') }}
            </span>
            <span v-if="item.selectable.status=='issued'">
              {{ t('statuses.4') }}
            </span>
            <span v-if="item.selectable.status=='queue'">
              {{`${item.selectable.queue_number} - ${t('statuses.5')}`}}
            </span>
          </v-chip>
        </template>
        <template #edu_name="item">
          {{ item.selectable.institution_name }}
        </template>
        <template #trained_profession="item">
          {{ item.selectable.direction_name }}
        </template>
        <template #edu_period="item">
          {{ item.selectable.period_weeks }} {{ t('qualification.week') }}
        </template>
        <template #departure_date="item">
          {{ item.selectable.created_at }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss">
.applications {

  &_body {
    .v-table__wrapper {
      margin-top: 0 !important;
    }
  }

  &__table__status {
    border-radius: 5px;
    padding: 6px;

    span {
      font-size: 14px;
      font-weight: 400;
    }

    &-new {
      background-color: rgba(239, 174, 6, 0.15);

      span {
        color: #EFAE06;
      }
    }

    &-confirmed {
      background-color: rgba(48, 165, 229, 0.15);

      span {
        color: #2988F5;
      }
    }

    &-canceled {
      background-color: rgba(240, 101, 72, 0.20);

      span {
        color: #F06548;
      }
    }

    &-issued {
      background-color: rgba(69, 203, 133, 0.20);

      span {
        color: #45CB85;
      }
    }
  }
}
</style>