<script setup lang="ts">
import type { YouthListType } from "@/types";
import { dateFormat } from "@/utils/helper";
import { DataTable } from "@/components/UI";
import { computed } from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

type PropsType = {
  data: YouthListType[];
};
const tableHeaders = computed(() => {
  return [
    { key: "order", title: "№" },
    { key: "help_type_name", title: t('main.serviceName') },
    { key: "help_date", title: t('common.date') },
    { key: "status", title: t('main.status') },
  ];
});
defineProps<PropsType>();
</script>

<template>
  <div class="bg-white pa-5 rounded-lg">
    <DataTable :headers="tableHeaders" :items="data ?? []">
      <template #order="item">
        {{ item.index + 1 }}
      </template>
      <template #help_date="item">
        <div class="text-no-wrap">
          {{ dateFormat(new Date(item.columns.help_date), "dd MMMM yyyy") }}
        </div>
      </template>
      <template #status="item">
        <span v-if="item.columns.helped_date == null">
          {{ t('main.noSupportProvided') }}
        </span>
        <span v-else> {{ t('main.supportProvided') }} </span>
      </template>
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
