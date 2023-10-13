<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { AppSelect, DataTable, Dialog } from "@/components/UI";
import { useRoute, useRouter } from "vue-router";
import { useCommonStore } from "@/store/Common";
import useLoading from "@/composables/useLoading";
import { useI18n } from "vue-i18n";
import MyJobApi from "@/pages/MyJob/api";
import type { OrderType } from "@/pages/MyJob/types";

const route = useRoute();
const router = useRouter();
const CommonStore = useCommonStore();
const { changeIsRequestLoading, isRequestLoading } = useLoading();
const { t } = useI18n();

const isPreviewDialogOpen = ref(false);
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
});

const orders = ref<OrderType[]>([]);
const computedOrders = computed(() => {
  if(!orders.value.length) return [];

  return orders.value;
});
const tableHeaders = computed(() => {
  return [
    { key: 'order', title: '№' },
    { key: 'organization', title: t('main.Organization') },
    { key: 'contract_number', title: t('common.ContractNumber') },
    { key: 'order_date', title: t('order.date') },
    { key: 'actions', title: t('common.actions') }
  ]
});

const openedOrder = ref<OrderType | null>(null);

async function getOrders() {
  const modifiedParams: any = {};

  Object
      .keys(filters.value)
      .forEach(key => {
        if(filters.value[key]) {
          if(key === 'organization') return modifiedParams.company_tin = filters.value[key];

          modifiedParams[key] = filters.value[key];
        }
      })

  orders.value = await MyJobApi.getOrdersApi(modifiedParams);
}

async function getOrderFile(id: number | string) {
  if (!openedOrder.value) return;

  changeIsRequestLoading('getOrderFile', true);
  openedOrder.value.file = await MyJobApi
      .getOrderFileApi(id)
      .finally(() => {
        changeIsRequestLoading('getOrderFile', false);
      });
}

async function changeOrderSeen(id: number | string) {
  changeIsRequestLoading('changeOrderSeen', true);
  await MyJobApi
      .changeOrderSeenApi(id)
      .then(() => {
        isPreviewDialogOpen.value = false;
        getOrders()
      })
      .finally(() => {
        changeIsRequestLoading('changeOrderSeen', false);
      });
}

function openPreviewDialog(order: OrderType) {
  isPreviewDialogOpen.value = true;
  openedOrder.value = order;

  getOrderFile(order.transaction_id)
}

function setQuery() {
  const query: any = {...route.query};

  query.org = filters.value.organization;
  query.status = filters.value.status;
  query.sort = filters.value.sort;

  Object
      .keys(query)
      .forEach(key => {
        if(!query[key]) delete query[key]
      });

  router.push({ query });
}

onMounted(() => {
  Promise.all([
      CommonStore.getCurrentJobsList()
  ])
      .then(() => {
        if(CommonStore.currentJobs.length === 1) {
          filters.value.organization = CommonStore.currentJobs[0].company_tin;
        }

        if(route.query.org) filters.value.organization = '' + route.query.org;
        if(route.query.sort) filters.value.sort = '' + route.query.sort;

        getOrders();

        watch(
            () => filters.value,
            () => {
              setQuery();
              getOrders();
            },
            {
              deep: true
            })
      })
})
</script>

<template>
  <div class="bg-white pa-5 rounded-lg">
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
            v-model="filters.sort"
            :items="sortingByDate"
            item-value="value"
            item-title="title"
            :placeholder="t('common.departureDate')"
            clearable
        />
      </v-col>
    </v-row>

    <DataTable
        :headers="tableHeaders"
        :items="computedOrders"
    >
      <template #order="item">
        {{ item.index + 1 }}
      </template>

      <template #organization="item">
        {{ item.raw.company?.name }}
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

      <template #order_date="item">
        <div class="text-no-wrap">{{ item.raw.order_date }}</div>
      </template>

      <template #actions="item">
        <v-btn
            width="155px"
            height="46px"
            variant="flat"
            class="v-btn--soft-blue rounded-lg no-uppercase pt-1"
            style="color: #2988F5; font-size: 16px"
            @click="openPreviewDialog(item.raw)"
        >
          {{ item.raw.order_seen ? $t('common.View') : $t('my-job.FamiliarizeYourself') }}
        </v-btn>
      </template>
    </DataTable>

    <teleport to="body">
      <Dialog
          v-model="isPreviewDialogOpen"
          width="635px"
      >
        <template #title>
          {{ $t('my-job.Explanation-Letter-Preview') }}
        </template>

        <v-progress-linear
            v-if="!openedOrder || isRequestLoading('getOrderFile')"
            indeterminate
            color="#2988F5"
        />
        <div v-else>
          <object
              :data="openedOrder.file"
              type="application/pdf"
              width="100%"
              height="500px"
          />

          <div
              v-if="!openedOrder?.order_seen"
              class="d-flex mt-7"
          >
            <v-btn
                height="46px"
                elevation="0"
                class="rounded-lg no-uppercase pt-1 text-white w-100"
                style="background-color: #2988F5; font-size: 16px;"
                :loading="isRequestLoading('changeOrderSeen')"
                @click="changeOrderSeen(openedOrder.id)"
            >
              {{ $t('my-job.Familiarized') }}
            </v-btn>
          </div>
        </div>
      </Dialog>
    </teleport>
  </div>
</template>

<style lang="scss">
.contracts {
  &__tabs {
    margin-bottom: 15px;
    --v-tabs-height: 40px!important;
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
      bottom: 0!important;
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