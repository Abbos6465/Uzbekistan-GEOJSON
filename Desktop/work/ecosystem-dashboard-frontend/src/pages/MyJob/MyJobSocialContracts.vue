<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { AppSelect, DataTable } from "@/components/UI";
import { useAuthStore } from "@/store/Auth";
import {useI18n} from "vue-i18n";

const AuthStore = useAuthStore();
const {t} = useI18n()
const statementStatus = reactive([
  {
    id: 2,
    name: t('my-job.Sent')
  },
  {
    id: 3,
    name: t('my-job.Canceled')
  },
  {
    id: 4,
    name: t('my-job.Delivered')
  },
  {
    id: 5,
    name: t('my-job.Confirmed')
  }
]);
const sortingByDate = reactive([
  {
    value: 'asc',
    title: t('my-job.LastSent')
  },
  {
    value: 'desc',
    title: t('my-job.PreviouslySent')
  }
]);

const filters = ref({
  organization: '',
  byDate: '',
  status: ''
});

const contracts = reactive([
  {
    order: 1,
    status: 'SENT',
    date: '23.03.2023',
    type: 'Доверенность',
    comments: 'Прошу выдать доверенность на управление автомобилем с номерным знаком "01 123 ABC" ',
    responsible: {
      avatar: 'https://s3-alpha-sig.figma.com/img/14ce/bffb/b57940f62c612ee7633f7334cde8f3f9?Expires=1690156800&Signature=PulAE0co7FV9-CDyyiKMHTuupYwlbUOoVqywqvdusu0JY5Dl4xBJYv9RtdH8znvTWS9SU~DbGgxupv8vMT31DorjlTUqZglLImbv3KGpVJkn3mQa8QI1rMa9vOMQuOVB5AsxXJAiB-m6Zo4jiOZ1Brof9-rzgACP2FJmh~8~5ydl-XDKrj2p6WRv1YKtAvUrcsTnSPJ7iSIUHrQDrRreOR2Ct4XSl9l3Kbz1e9vFSnB0z3CpPUWULneGEVzKWvaRuDtnAASNY4uHffVCqWw1kqgSq7JkCKsUvmS7EqrWNL0hgAUqqGryy4Fmj6P9Pmojf8j9t0Z61S81wiXlvXE5sw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      name: 'Абдулбосидов Шерали Рустам ўғли',
      position: 'HR - специалист'
    }
  },
]);
const tableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'status', title: t('main.status')},
    {key: 'date', title: t('common.departureDate')},
    {key: 'type', title: t('common.RequestType')},
    {key: 'comments', title: t('common.comments')},
    {key: 'responsible', title: t('common.ResponsibleApproval')},
    {key: 'actions', title: t('common.actions')}
  ]
});
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <v-row class="mb-1">
      <v-col md="3">
        <AppSelect
            v-model="filters.organization"
            :items="AuthStore.workingOrganizations"
            item-value="id"
            item-title="name"
            :placeholder="$t('common.ChooseOrganization')"
            clearable
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
      <v-col md="3">
        <AppSelect
            v-model="filters.byDate"
            :items="sortingByDate"
            item-value="value"
            item-title="title"
            :placeholder="$t('common.departureDate')"
            clearable
        />
      </v-col>
    </v-row>

    <DataTable
        :headers="tableHeaders"
        :items="contracts"
        class="statement__table"
    >
      <template #status="item">
        <div>
          <div
              :class="['application-status', `application-status--${item.columns.status}`]"
          >
            {{ $t(`statuses.${item.columns.status}`) }}
          </div>
        </div>
      </template>

      <template #type="item">
        <div style="max-width: 337px;">
          <button class="link link--blue link--underlined text-left">
            {{ item.columns.type }}
          </button>
        </div>
      </template>

      <template #responsible="item">
        <div>
          <div class="responsible-person">
            <img
                :src="item.columns.responsible.avatar"
                alt=""
                class="responsible-person__avatar"
            />

            <div class="d-flex flex-column">
              <div class="responsible-person__name">{{ item.columns.responsible.name }}</div>
              <div class="responsible-person__position">{{ item.columns.responsible.position }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #actions="item">
        <v-btn
            width="129px"
            height="46px"
            variant="flat"
            class="v-btn--soft-blue rounded-lg no-uppercase pt-1"
            style="color: #2988F5; font-size: 16px"
        >
          {{ $t('common.View') }}
        </v-btn>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>