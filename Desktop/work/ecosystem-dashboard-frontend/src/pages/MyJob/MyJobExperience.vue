<script setup lang="ts">
import {computed, onMounted, reactive, ref } from "vue";
import { PersonalInfo, Relatives, WorkBook, Rewards, DisciplinaryAction, SickSheets } from './components'
import { EmptyBlock } from "@/components/UI";
import { useRoute, useRouter } from "vue-router";
import DiplomaCertificates from "@/pages/DiplomaCertificates/DiplomaCertificates.vue";
import { useCommonStore } from "@/store/Common";
import {useI18n} from "vue-i18n";

enum TabsEnum {
  workBook = 'WORKBOOK',
  relatives = 'RELATIVES',
  disciplinaryAction = 'DISCIPLINARY_ACTION',
  rewards = 'REWARDS',
  education = 'EDUCATION',
  sickSheets = 'SICK_SHEETS',
  military = 'MILITARY'
}

const CommonStore = useCommonStore();

const {t} = useI18n()
const router = useRouter();
const route = useRoute();

const activeTab = ref();
const tabs = computed(() => {
  return [
  {
    title: t('main.employmentHistory'),
    value: TabsEnum.workBook
  },
  {
    title: t('common.relatives'),
    value: TabsEnum.relatives
  },
  {
    title: t('my-job.DisciplinaryAction'),
    value: TabsEnum.disciplinaryAction
  },
  {
    title: t('my-job.promotion'),
    value: TabsEnum.rewards
  },
  {
    title: t('common.Education'),
    value: TabsEnum.education
  },
  {
    title: t('my-job.sickSheets'),
    value: TabsEnum.sickSheets
  },
  {
    title: t('my-job.MilitaryService'),
    value: TabsEnum.military,
    disabled: true
  }]
});

function setTabToQuery(value: TabsEnum) {
  router.push({
    query: {
      tab: value
    }
  })
}

onMounted(() => {
  CommonStore.getProfileInfo();

  if(route.query.tab) activeTab.value = String(route.query.tab);
  else activeTab.value = TabsEnum.workBook;
})

</script>

<template>
  <v-row>
    <v-col md="12">
      <PersonalInfo />
    </v-col>

    <v-col md="12">
      <div class="bg-white px-5 pt-5 pb-4 rounded-t-lg">
        <v-tabs
            v-model="activeTab"
            grow
            class="current-work__tabs"
        >
          <v-tab
              v-for="item in tabs"
              :key="item.value"
              :value="item.value"
              :disabled="item.disabled"
              class="current-work__tab-btn"
              @click="setTabToQuery(item.value)"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </div>

      <v-window v-model="activeTab">
        <v-window-item :value="TabsEnum.workBook">
          <WorkBook/>
        </v-window-item>

        <v-window-item :value="TabsEnum.relatives">
          <Relatives />
        </v-window-item>

        <v-window-item :value="TabsEnum.disciplinaryAction">
          <DisciplinaryAction />
        </v-window-item>

        <v-window-item :value="TabsEnum.rewards">
          <Rewards />
        </v-window-item>

        <v-window-item :value="TabsEnum.education">
          <DiplomaCertificates style="margin-top: -5px"/>
        </v-window-item>

        <v-window-item :value="TabsEnum.sickSheets">
          <SickSheets style="margin-top: -5px"/>
        </v-window-item>

        <v-window-item :value="TabsEnum.military">
          <EmptyBlock />
        </v-window-item>
      </v-window>

    </v-col>
  </v-row>
</template>

<style lang="scss">
@import "./style";

.labor-activity {
  &__service-items {
    .v-col {
      padding: 7.5px 12px;
    }

    .service-item {
      padding: 10px;
    }
  }
}
</style>