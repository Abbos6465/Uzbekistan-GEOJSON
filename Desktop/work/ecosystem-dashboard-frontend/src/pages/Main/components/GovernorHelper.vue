<script setup lang="ts">
import type { WomenServicesType } from "@/types";
import { dateFormat } from "@/utils/helper";
import { DataTable } from "@/components/UI";
import { computed } from "vue";
import {useI18n} from "vue-i18n";

type PropsType = {
  data: WomenServicesType[];
};

const {t} = useI18n();

const tableHeaders = computed(() => {
  return [
    { key: "order", title: "№" },
    { key: "service_name", title: t('main.serviceName') },
    { key: "start_date", title: t('main.startDate') },

    { key: "expected_results", title: t('main.expectedResults') },
    { key: "end_date", title: t('main.stopDate') },
    { key: "status", title: t('status') },
  ];
});
defineProps<PropsType>();
</script>

<template>
  <div class="bg-white pa-5 rounded-lg">
    <DataTable :headers="tableHeaders" :items="[]">
 
    </DataTable>
  </div>
</template>

<style lang="scss">
.suitable-vacancies {
  &__header {
    display: flex;
    justify-content: flex-end;
    padding: 15px 10px;
    border-radius: 0 10px 0 0;
    margin-bottom: 20px;
  }
}

.suitable-vacancy {
  background: #f5f7fb;
  padding: 10px;
  border-radius: 10px;

  & + & {
    margin-top: 20px;
  }

  &__salary {
    color: $blue-color;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 8px;
  }
}
</style>
