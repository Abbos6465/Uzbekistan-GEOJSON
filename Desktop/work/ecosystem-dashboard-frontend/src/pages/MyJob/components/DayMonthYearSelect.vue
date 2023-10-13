<script
    setup
    lang="ts"
>
import AppSelect from "@/components/UI/AppSelect.vue";
import { computed, onMounted, ref } from "vue";
import '@vuepic/vue-datepicker/dist/main.css'
import { monthsList } from "@/utils/helper";
import DatePicker from "@/components/UI/DatePicker.vue";

type PropsType = {
  modelValue: string
  title: string
  required?: boolean
  disabled?: boolean
  hasError?: string[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue', 'blurInput']);

const day = ref<string | number | null>(null);
const month = ref<string | number | null>(null);
const year = ref<string | number | null>(null);

const computedDaysList = computed(() => {
  const days = (month.value && year.value) ? new Date(+year.value, +month.value, 0).getDate() : 31;
  const daysInArr = [];

  for (let i = 1; i <= days; i++) {
    daysInArr.push(i);
  }

  return daysInArr;
});

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set() {
    const y = year.value;
    const m = month.value && (month.value < 10) ? `0${ month.value }` : month.value;
    const d = day.value && (day.value < 10) ? `0${ day.value }` : day.value;

    emit('update:modelValue', `${ y }-${ m }-${ d }`)
  }
})

onMounted(() => {
  const splittedModelValue = computedModelValue.value.split('-');

  if (splittedModelValue[2]) day.value = splittedModelValue[2];
  if (splittedModelValue[1]) month.value = splittedModelValue[1];
  if (splittedModelValue[0]) year.value = splittedModelValue[0];
})

</script>

<template>
  <div class="day-month-year-select pb-4">
    <v-row class="pb-1">
      <v-col md="4" class="pb-0">
        <AppSelect
            v-model="day"
            :items="computedDaysList"
            required="required"
            :placeholder="$t('common.enterDate')"
            :disabled="props.disabled"
            :hasError="!!props.hasError?.length && !day"
            @update:modelValue="computedModelValue = ''"
            @focusin="hasError = []"
        >
          <template #label>{{ title }}</template>
        </AppSelect>
      </v-col>

      <v-col md="4" class="pb-0">
        <div class="d-flex align-end h-100">
          <AppSelect
              v-model="month"
              :items="monthsList()"
              item-value="value"
              item-title="title"
              required="required"
              :placeholder="$t('common.enterDate')"
              class="w-100"
              :disabled="props.disabled"
              :hasError="!!props.hasError?.length && !month"
              @update:modelValue="computedModelValue = ''"
              @focusin="hasError = []"
          />
        </div>
      </v-col>

      <v-col md="4" class="pb-0">
        <div class="d-flex align-end h-100">
          <DatePicker
              v-model="year"
              year-picker
              class="w-100"
              :placeholder="$t('my-job.SelectYear')"
              right
              :disabled="disabled"
              :hasError="!!props.hasError?.length"
              @update:modelValue="computedModelValue = ''"
              @focusin="hasError = []"
              @focusout="emit('blurInput')"
          />
        </div>
      </v-col>
    </v-row>
    <div
        v-if="props.hasError?.length"
        class="error-message"
    >
      {{ props.hasError[0] }}
    </div>
  </div>
</template>

<style lang="scss">
.day-month-year-select {
  position: relative;

  .error-message {
    top: calc(100% - 5px);
  }
}
</style>