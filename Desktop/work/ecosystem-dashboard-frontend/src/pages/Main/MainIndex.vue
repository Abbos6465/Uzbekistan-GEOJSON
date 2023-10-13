<script
    setup
    lang="ts"
>
import { computed, onMounted, reactive, ref } from "vue";
import { DataTable, Dialog, Marquee } from "@/components/UI";
import { ServiceItems } from "@/components/Composite";
import { RightBar } from "@/components/Layout";
import {
  ActiveWomen,
  Chat,
  GovernorHelper,
  Info,
  OurSystems,
  Schedule,
  SuitableVacancies,
  YouthLeader,
} from "./components";
import { createThenClickDownloadLink, numberPrettier } from "@/utils/helper";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/Auth";
import { useCommonStore } from "@/store/Common";

import MainApi, { type OnlineFairsType } from "@/pages/Main/api";
import type { OurSystemsType, SalaryApiType } from "@/pages/Main/types";
import useLoading from "@/composables/useLoading";
import ReferenceDialog from "@/components/Composite/ReferenceDialog.vue";
import WorkbookDialog from "@/components/Composite/WorkbookDialog.vue";

type INPSOrgsType = {
  name: string;
  month: string;
  summ: string;
};
type INPSType = {
  fio: string;
  inps: string;
  total: number;
  orgs: INPSOrgsType[];
};

enum SpecialServices {
  workbook = "WORKBOOK",
  reference = "REFERENCE",
  inps = "INPS",
  salary = "SALARY",
}

const { locale, t } = useI18n();
const { changeIsRequestLoading, isRequestLoading } = useLoading();
const AuthStore = useAuthStore();
const CommonStore = useCommonStore();

const services = reactive([
  {
    icon: "/img/services/work-book.svg",
    title: t('main.Extractworkbook'),
    onClick: () => getSpecialService(SpecialServices.workbook),
  },
  {
    icon: "/img/services/ref.svg",
    title: t('main.Helpplacework'),
    onClick: () => getSpecialService(SpecialServices.reference),
  },
  {
    icon: "/img/services/dollar.svg",
    title: t('main.ExtractINPS'),
    onClick: () => getSpecialService(SpecialServices.inps),
  },
  {
    icon: "/img/services/dollar2.svg",
    title: t('main.InformationAccruedWages'),
    onClick: () => getSpecialService(SpecialServices.salary),
  },
]);
const activeTab = ref(1);
const activePlanTab = ref(1);
const isWorkbookDialogOpen = ref(false);

const tabs = computed(() => {
  return [
    {
      value: 1,
      title: t('main.SpecialServices'),
    },
    {
      value: 2,
      title: t('main.SuitableVacancies'),
    },
    {
      value: 3,
      title: t('main.Messages'),
    },
  ]
});
const plan_tabs = computed(() => {
  return [
    {
      value: 1,
      title: t('main.AssistantMmayor'),
    },
    {
      value: 2,
      title: t('main.WivesActive'),
    },
    {
      value: 3,
      title: t('main.YouthLeader'),
    },
  ];
});

// OurSystems
const ourSystemsList = ref<OurSystemsType[]>([]);

async function getOurSystems() {
  ourSystemsList.value = await MainApi.getOurSystemsApi();
}

// INPS
const inps = ref<INPSType | null>(null);
const isINPSDialogOpen = ref(false);

const inpsTableHeader = computed(() => {
  return [
    { key: "name", title: t('main.Organization') },
    { key: "summ", title: t('main.profit') },
    { key: "month", title: t('main.TheDate') },
  ];
});

async function getINPS(): Promise<any> {
  return await MainApi.getINPSApi().then((data) => {
    if (!data) return getINPS();

    const modifiedOrgs: INPSOrgsType[] = [];

    data.orgs.forEach((item) => {
      if (Array.isArray(item.dates)) {
        item.dates.forEach((date) => {
          modifiedOrgs.push({
            name: item.name,
            ...date,
          });
        });
      } else {
        modifiedOrgs.push({
          name: item.name,
          month: item.dates.month,
          summ: item.dates.summ,
        });
      }
    });

    inps.value = {
      ...data,
      orgs: modifiedOrgs,
    };

    isINPSDialogOpen.value = true;
  });
}
async function downloadINPS() {
  return await MainApi.getDownloadINPSApi().then((data) => {
    if (!data) return;
    createThenClickDownloadLink(`INPS ${ AuthStore.fullName }`, data);

    return Promise.resolve();
  });
}

// Salary
const salary = ref<SalaryApiType[]>([]);
const isSalaryDialogOpen = ref(false);

const salaryTableHeader = computed(() => {
  return [
    { key: "orgName", title: t('main.Organization') },
    { key: "salary", title: t('main.salary') },
    { key: "salaryTaxSum", title: t('main.salaryTaxSum') },
    { key: "inpsSum", title: t('main.INPS') },
    { key: "date", title: t('main.TheDate') },
  ];
});

async function getSalary() {
  await MainApi
      .getSalaryApi()
      .then((data) => {
        salary.value = data.sort((a, b) => {
          return b.year - a.year
        })
      })
  isSalaryDialogOpen.value = true;
}

async function getSpecialService(name: SpecialServices) {
  if (isRequestLoading("getSpecialService")) return;

  changeIsRequestLoading("getSpecialService", true);

  try {
    switch (name) {
      case SpecialServices.workbook:
        isWorkbookDialogOpen.value = true;
        break;
      case SpecialServices.reference:
        openReferenceDialog();
        break;
      case SpecialServices.inps:
        await getINPS();
        break;
      case SpecialServices.salary:
        await getSalary();
        break;
    }
  }
  finally {
    changeIsRequestLoading("getSpecialService", false);
  }
}

// OnlineFairs
const onlineFairs = ref<OnlineFairsType | null>(null);

async function getOnlineFairs(date?: string) {
  changeIsRequestLoading('getOnlineFairs', true);
  try {
    onlineFairs.value = await MainApi.getOnlineFairsApi({ date });
  }
  finally {
    changeIsRequestLoading('getOnlineFairs', false);
  }
}

const isReferenceDialogOpen = ref(false);

function openReferenceDialog() {
  isReferenceDialogOpen.value = true;
}

onMounted(() => {
  Promise.all([
    CommonStore.getProfileInfo(),
    CommonStore.getVacancies(),
    CommonStore.getEmoduleService(),
    CommonStore.getYouthLeader(),
    getOurSystems(),
    getOnlineFairs()
  ]);
});
</script>

<template>
  <div>
    <Marquee :items="CommonStore.vacancies">
      <template #default="items">
        <a
            v-for="(vacancy, index) in items"
            :key="index"
            :href="`https://ish.mehnat.uz/vacancies/${vacancy.id}`"
            target="_blank"
            class="custom-marquee__item"
        >
          <div class="main__marquee__item">
            <span class="main__marquee__position">
              {{ locale === 'ru' ? vacancy.position_name_ru : vacancy.position_name }}
            </span>
              <span class="main__marquee__company">
              {{ vacancy.company_name }}
            </span>
            <v-tooltip
                activator="parent"
                location="top"
            >
              {{ vacancy.company_name }}
            </v-tooltip>
          </div>
        </a>
      </template>
    </Marquee>

    <v-row>
      <v-col md="8">
        <div class="position-sticky">
          <Info/>

          <div
              class="bg-white rounded-lg pa-5 d-flex flex-column mt-7 position-relative"
          >
            <v-tabs
                v-model="activeTab"
                grow
                height="40px"
            >
              <v-tab
                  v-for="(tab, tabIndex) in tabs"
                  :key="tabIndex"
                  :value="tab.value"
                  color="#2988F5"
                  class="block-title--16 no-uppercase rounded-b-0"
                  style="border-bottom: 1px solid #e2e2e2"
              >
                {{ tab.title }}
              </v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <v-window-item
                  :value="1"
                  class="pt-5"
              >
                <ServiceItems
                    :items="services"
                    md="6"
                />
              </v-window-item>

              <v-window-item :value="2">
                <SuitableVacancies :data="CommonStore.vacancies"/>
              </v-window-item>

              <v-window-item
                  :value="3"
                  class="pt-5"
              >
                <Chat/>
              </v-window-item>
            </v-window>
          </div>

          <div class="bg-white rounded-lg pa-5 d-flex flex-column mt-7 position-relative">
            <h4 class="block-title--20 mb-4">
              {{ t("main.individualProgram") }}
            </h4>

            <v-tabs
                v-model="activePlanTab"
                grow
                height="40px"
            >
              <v-tab
                  v-for="(tab, tabIndex) in plan_tabs"
                  :key="tabIndex"
                  :value="tab.value"
                  color="#2988F5"
                  class="block-title--16 no-uppercase rounded-b-0"
                  style="border-bottom: 1px solid #e2e2e2"
              >
                {{ tab.title }}
              </v-tab>
            </v-tabs>

            <v-window v-model="activePlanTab">
              <v-window-item
                  :value="1"
                  class="pt-5"
              >
                <GovernorHelper :data="services"/>
              </v-window-item>

              <v-window-item
                  :value="2"
                  class="pt-5"
              >
                <ActiveWomen :data="CommonStore.womenServices"/>
              </v-window-item>

              <v-window-item
                  class="pt-5"
                  :value="3"
              >
                <YouthLeader :data="CommonStore.youthList"/>
              </v-window-item>
            </v-window>
          </div>
        </div>
      </v-col>

      <v-col md="4">
        <OurSystems
            :items="ourSystemsList"
            class="mb-7"
        />

        <Schedule
            :data="onlineFairs"
            @fetch="getOnlineFairs"
        />
      </v-col>
    </v-row>

    <RightBar/>

    <teleport to="body">
      <WorkbookDialog v-model="isWorkbookDialogOpen" />

      <Dialog
          v-model="isINPSDialogOpen"
          width="750px"
      >
        <template #title>{{ t("main.ExtractINPS") }}</template>

        <template #default>
          <div
              v-if="inps"
              class="pt-4"
          >
            <div>
              <h4 class="block-title--16 soft-black">
                {{ t("main.fullname") }}
              </h4>
              <p class="block-title--16">{{ inps.fio }}</p>
            </div>

            <div class="mt-2">
              <h4 class="block-title--16 soft-black">{{ t("main.INPS") }}</h4>
              <p class="block-title--16">{{ inps.inps }}</p>
            </div>

            <div class="mt-2">
              <h4 class="block-title--16 soft-black">{{ t("main.total") }}</h4>
              <p class="block-title--16">
                {{ numberPrettier(+inps.total) }} {{ t("main.sum") }}
              </p>
            </div>

            <DataTable
                :headers="inpsTableHeader"
                :items="inps.orgs"
                header-fixed
                max-height="50vh"
                class="mt-5"
            >
              <template #summ="item">
                <span class="text-no-wrap">
                  {{ numberPrettier(+item.columns.summ) }} {{ t("main.sum") }}
                </span>
              </template>

              <template #month="item">
                <span class="text-no-wrap">
                  {{ $t(`month.${ item.columns.month.slice(0, 2) }`) }}
                  {{ item.columns.month.slice(2) }}
                </span>
              </template>
            </DataTable>

            <v-btn
                height="46px"
                elevation="0"
                color="#2988F5"
                class="text-white rounded-lg no-uppercase w-100 mt-6"
                style="font-size: 16px"
                @click="downloadINPS"
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

      <Dialog
          v-model="isSalaryDialogOpen"
          width="750px"
      >
        <template #title>{{ t("main.salary") }}</template>

        <template #default>
          <div class="pt-4">
            <DataTable
                :headers="salaryTableHeader"
                :items="salary"
                header-fixed
                max-height="70vh"
                class="mt-5"
            >
              <template #salary="item">
                <div
                    v-if="item.raw.salary"
                    class="text-no-wrap"
                >
                  {{ numberPrettier(item.raw.salary) }} {{ $t('sum') }}
                </div>
              </template>
              <template #salaryTaxSum="item">
                <div
                    v-if="item.raw.salaryTaxSum"
                    class="text-no-wrap"
                >
                  {{ numberPrettier(item.raw.salaryTaxSum) }} {{ $t('sum') }}
                </div>
              </template>
              <template #inpsSum="item">
                <div
                    v-if="item.raw.inpsSum"
                    class="text-no-wrap"
                >
                  {{ numberPrettier(item.raw.inpsSum) }} {{ $t('sum') }}
                </div>
              </template>
              <template #date="item">
                {{ $t(`month.${ item.raw.period }`) }} {{ item.raw.year }}
              </template>
            </DataTable>
          </div>
        </template>
      </Dialog>

      <ReferenceDialog v-model="isReferenceDialogOpen"/>
    </teleport>
  </div>
</template>

<style lang="scss">
.main__marquee {
  &__item {
    display: flex;
    align-items: center;
  }

  &__company {
    display: block;
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: -3px;
  }

  &__position {
    background-color: #eff5fc;
    color: #000;
    padding: 2px 5px;
    border-radius: 5px;
    margin-right: 2px;
  }
}

.main__redirect-btn {
  width: calc(50% - 15px);
  display: flex;
  align-items: center;
  padding: 24px 20px;
  border: 1px solid $stroke-color;
  border-radius: 10px;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 51px;
    max-width: 51px;
    height: 51px;
    border-radius: 50%;
    background-color: $light-gray;
    margin-right: 15px;

    svg {
      width: 24px;
      max-height: 30px;
    }
  }

  &:nth-child(even) {
    margin-left: 30px;
  }

  &:last-child,
  &:nth-last-child(2) {
    margin-bottom: 0;
  }
}

.reference {
  &__title {
    text-align: center;
    margin: 25px 0 15px;
    color: #206B94;
    text-transform: uppercase;
    font-size: 24px;
  }

  &__text {
    color: #206B94;
    text-align: center;
  }

}
</style>
