<script
    setup
    lang="ts"
>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { AppSelect, DataTable, Dialog, AppTextarea } from "@/components/UI";
import MyJobApi from "@/pages/MyJob/api";
import { useCommonStore } from "@/store/Common";
import useLoading from "@/composables/useLoading";
import type { ConfirmSignTransactionType, ContactDocType, ContractType } from "@/pages/MyJob/types";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import ContractDocComponent  from "./components/ContractDoc.vue";

enum ConditionsType {
  new = 'NEW',
  actual = 'ACTUAL',
  past = 'PAST'
}

const route = useRoute();
const router = useRouter();
const CommonStore = useCommonStore();
const { changeIsRequestLoading, isRequestLoading } = useLoading();
const { t } = useI18n();

const isPreviewDialogOpen = ref(false);
const isCommentDialogOpen = ref(false);

const openedContract = ref<ContractType | null>(null);
const contractDoc = ref<ContactDocType | null>(null);
const commentDialogForm = ref<ConfirmSignTransactionType>({
  "accept": false,
  "comment_reason": "",
  "sign_transaction_id": 0
})

const statementStatus = computed(() => {
  return [
    {
      id: "0",
      name: t('contracts.status.0')
    },
    {
      id: '1',
      name: t('contracts.status.1')
    },
    {
      id: '2',
      name: t('contracts.status.2')
    },
    {
      id: '3',
      name: t('contracts.status.3')
    },
    {
      id: '4',
      name: t('contracts.status.4')
    }
  ]
});
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

const filters = ref<any>({
  organization: '',
  sort: '',
  status: ''
});

const contracts = ref<ContractType[]>([]);
const tableHeaders = computed(() => {
  return [
    { key: 'order', title: '№' },
    { key: 'organization', title: t('main.Organization') },
    { key: 'contract_number', title: t('common.ContractNumber') },
    { key: 'status', title: t('main.status') },
    { key: 'created_at', title: t('common.birthdate') },
    { key: 'actions', title: t('common.actions') }
  ]
});

const dividedContractsByStatus = computed(() => {
  if (!contracts.value.length) return [];

  const modifiedContracts: any = {
    current: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    },
    last: []
  };

  const currentJobsTin = CommonStore.currentJobs.map(item => item.company_tin);

  contracts.value.forEach((item) => {
    if (currentJobsTin.includes(item.company.tin)) {
      addToState('current', '' + [item.status], item)
    } else {
      addToState('last', '' + [item.status], item)
    }
  })

  function addToState(entity: string, status: string, value: any) {
    if (entity === 'last') {
      return modifiedContracts.last.push(value);
    }

    modifiedContracts[entity][status].push(value);
  }

  return modifiedContracts;
})
const contractConditions = computed(() => {
  if (Array.isArray(dividedContractsByStatus.value) && !dividedContractsByStatus.value.length) return [
    {
      value: ConditionsType.new,
      title: t('common.New'),
      items: [],
      counter: 0
    },
    {
      value: ConditionsType.actual,
      title: t('common.Operating'),
      items: [],
      counter: 0
    },
    {
      value: ConditionsType.past,
      title: t('common.Past'),
      items: [],
      counter: 0
    }
  ];

  const conditions = {
    new: {
      items: [...dividedContractsByStatus.value.current[0], ...dividedContractsByStatus.value.current[1]],
      counter: dividedContractsByStatus.value.current[0].length + dividedContractsByStatus.value.current[1].length
    },
    actual: {
      items: [
        ...dividedContractsByStatus.value.current[0],
        ...dividedContractsByStatus.value.current[1],
        ...dividedContractsByStatus.value.current[2],
        ...dividedContractsByStatus.value.current[3],
        ...dividedContractsByStatus.value.current[4]
      ],
      counter: Object.keys(dividedContractsByStatus.value.current).reduce((acc, key) => {
        return acc += dividedContractsByStatus.value.current[key].length;
      }, 0)
    },
    past: {
      items: dividedContractsByStatus.value.last,
      counter: dividedContractsByStatus.value.last.length
    }
  }

  return [
    {
      value: ConditionsType.new,
      title: t('common.New'),
      ...conditions.new
    },
    {
      value: ConditionsType.actual,
      title: t('common.Operating'),
      ...conditions.actual
    },
    {
      value: ConditionsType.past,
      title: t('common.Past'),
      ...conditions.past
    }
  ]
});
const activeCondition = ref(ConditionsType.new);

async function openPreviewDialog(item: ContractType) {
  isPreviewDialogOpen.value = true;
  openedContract.value = item;
  await getContractDoc(item?.id)
}

async function getContracts() {
  const modifiedParams: any = {};

  Object
      .keys(filters.value)
      .forEach(key => {
        if (filters.value[key]) {
          if (key === 'organization') return modifiedParams.company_tin = filters.value[key];

          modifiedParams[key] = filters.value[key];
        }
      })

  changeIsRequestLoading('getContracts', true);
  await MyJobApi
      .getContractsApi(modifiedParams)
      .then((data) => {
        if (data) contracts.value = data.sort((a, b) => +a.company.tin - +b.company.tin)
      })
      .finally(() => {
        changeIsRequestLoading('getContracts', false);
      });
}

async function getContractDoc(transaction_id: string | number) {
  changeIsRequestLoading('getContractDoc', true);
  await MyJobApi
      .getContractDocApi(transaction_id)
      .then((data) => data ? contractDoc.value = data : '')
      .finally(() => {
        changeIsRequestLoading('getContractDoc', false)
      });
}

function setQuery() {
  const query: any = { ...route.query };

  query.org = filters.value.organization;
  query.status = filters.value.status;
  query.sort = filters.value.sort;

  Object
      .keys(query)
      .forEach(key => {
        if (!query[key]) delete query[key]
      });

  router.push({ query });
}

function openCommentDialog(accept: number) {
  commentDialogForm.value.accept = !!accept;
  commentDialogForm.value.sign_transaction_id = openedContract.value!.id;
  isCommentDialogOpen.value = true;
}

async function confirmSignTransaction() {
  changeIsRequestLoading('confirmSignTransaction', true);
  await MyJobApi
      .confirmSignTransactionApi(commentDialogForm.value)
      .then((data) => {
        if (data) getContracts();
      })
      .finally(() => {
        changeIsRequestLoading('confirmSignTransaction', false);
        isCommentDialogOpen.value = false;
        isPreviewDialogOpen.value = false;
      })
}

onMounted(() => {
  Promise.all([
    CommonStore.getCurrentJobsList(),
  ])
      .then(() => {
        if(CommonStore.currentJobs.length === 1) {
          filters.value.organization = CommonStore.currentJobs[0].company_tin;
        }

        if (route.query.org) filters.value.organization = '' + route.query.org;
        if (route.query.status) filters.value.status = '' + route.query.status;
        if (route.query.sort) filters.value.sort = '' + route.query.sort;

        getContracts();

        watch(
            () => filters.value,
            () => {
              setQuery();
              getContracts();
            },
            {
              deep: true
            })
      })
})

watch(() => route.query, (newValue) => {
  if (!newValue) return;

  if (newValue.type && newValue.org) getContracts();
})
</script>

<template>
  <div class="bg-white pa-5 rounded-lg">
    <v-tabs
        v-model="activeCondition"
        class="contracts__tabs"
    >
      <v-tab
          v-for="item in contractConditions"
          :key="item.value"
          :value="item.value"
          height="40px"
          class="contracts__tab no-uppercase block-title--16 rounded-b-0"
      >
        {{ item.title }}

        <div class="contracts__tab__counter">{{ item.counter }}</div>
      </v-tab>
    </v-tabs>


    <v-row class="mb-1">
      <v-col md="3">
        <AppSelect
            v-model="filters.organization"
            :items="CommonStore.currentJobs"
            item-value="company_tin"
            item-title="company_name"
            clearable
            :disabled="CommonStore.currentJobs.length === 1"
            :placeholder="$t('common.ChooseOrganization')"
            :loading="isRequestLoading('getCurrentJobsList')"
        />
      </v-col>
      <v-col md="3">
        <AppSelect
            v-model="filters.status"
            :items="statementStatus"
            item-value="id"
            item-title="name"
            :placeholder="t('main.status')"
            clearable
        />
      </v-col>
      <v-col md="3">
        <AppSelect
            v-model="filters.sort"
            :items="sortingByDate"
            item-value="value"
            item-title="title"
            :placeholder="t('common.departureDate')"
            clearable
        />
      </v-col>
    </v-row>

    <v-window v-model="activeCondition">
      <v-window-item
          v-for="(item, index) in contractConditions"
          :key="index"
          :value="item.value"
      >
        <DataTable
            :headers="tableHeaders"
            :items="item.items"
            :loading="isRequestLoading('getContracts')"
        >
          <template #order="item">
            {{ item.index + 1 }}
          </template>

          <template #organization="item">
            {{ item.raw.company.name }}
          </template>

          <template #status="item">
            <div>
              <div
                  :class="['contracts-status', `contracts-status--${item.columns.status}`]"
              >
                {{ $t(`contracts.status.${ item.columns.status }`) }}
              </div>
            </div>
          </template>

          <template #contract_number="item">
            <div style="max-width: 337px;">
              <button
                  class="link link--blue link--underlined text-left"
                  @click="openPreviewDialog(item.raw)"
              >
                №{{ item.columns.contract_number }}
              </button>
            </div>
          </template>

          <template #actions="item">
            <v-btn
                width="155px"
                height="46px"
                variant="flat"
                class="v-btn--soft-blue rounded-lg no-uppercase"
                style="color: #2988F5; font-size: 16px"
                @click="openPreviewDialog(item.raw)"
            >
              {{ $t('common.View') }}
            </v-btn>
          </template>
        </DataTable>
      </v-window-item>
    </v-window>

    <teleport to="body">
      <Dialog
          v-model="isPreviewDialogOpen"
          width="1400px"
      >
        <template #title>
          {{ $t('my-job.Explanation-Letter-Preview') }}
        </template>

        <div>
          <v-progress-linear
              v-if="isRequestLoading('getContractDoc')"
              indeterminate
              color="#2988F5"
          />
          <ContractDocComponent
              v-else
              :data="contractDoc"
              style="max-height: 70vh;overflow-y: auto"
          />

          <div
              v-if="+openedContract?.status === 0"
              class="d-flex mt-7"
          >
            <v-btn
                height="46px"
                variant="flat"
                elevation="0"
                class="v-btn--soft-red rounded-lg no-uppercase"
                style="color: #CB1520; font-size: 16px; margin-right: 10px; width: calc(50% - 10px)"
                @click="openCommentDialog(0)"
            >
              {{ $t('my-job.Disagree') }}
            </v-btn>

            <v-btn
                height="46px"
                elevation="0"
                class="rounded-lg no-uppercase text-white"
                style="background-color: #2988F5; font-size: 16px; margin-left: 10px; width: calc(50% - 10px)"
                @click="openCommentDialog(1)"
            >
              Подписать
            </v-btn>
          </div>
        </div>
      </Dialog>

      <Dialog
          v-model="isCommentDialogOpen"
          width="520px"
      >
        <template #title>
          {{ commentDialogForm.accept ? $t('my-job.DocumentSigning') : $t('my-job.ReasonDisagreement') }}
        </template>

        <p class="my-4">
          {{
            commentDialogForm.accept ?
                $t('my.job.To-sign-a-document-sign-it-by-holding-down-the-mouse-button-in-the-specified-field') :
                $t('my-job.Indicate-the-point-with-which-you-do-not-agree')
          }}
        </p>

        <AppTextarea
            v-if="!commentDialogForm.accept"
            v-model="commentDialogForm.comment_reason"
            :placeholder="$t('my-job.ReasonForDisagreement')"
        />

        <v-btn
            height="47px"
            elevation="0"
            color="#2988F5"
            class="text-white no-uppercase rounded-lg w-100 mt-6"
            :loading="isRequestLoading('confirmSignTransaction')"
            @click="confirmSignTransaction"
        >
          {{ $t('my-job.send') }}
        </v-btn>
      </Dialog>
    </teleport>
  </div>
</template>

<style lang="scss">
.contracts {
  &__tabs {
    margin-bottom: 15px;
    --v-tabs-height: 40px !important;
    z-index: 1;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: $gray-stroke;
      z-index: -1;
    }
  }

  &__tab {
    .v-tab__slider {
      color: $blue-color;
      bottom: 0 !important;
      z-index: 2;
    }

    &__counter {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px 5px 3px 3px;
      height: 18px;
      border-radius: 98px;
      background: rgba(41, 136, 245, 0.20);
      font-size: 12px;
      font-weight: 500;
      line-height: normal;
      margin-left: 10px;
      color: $blue-color;
    }

    &--active {
      color: $blue-color;
    }
  }
}
</style>