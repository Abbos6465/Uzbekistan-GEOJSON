<script setup lang="ts">
import { computed } from "vue";

import { inputNumbersOnly } from "@/utils/helper";
import AppInput from "@/components/UI/AppInput.vue";

type PropsType = {
  modelValue?: string
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    return formatValue(props.modelValue!)
  },
  set(newValue) {
    let formattedValueAsNumber = newValue.replace(/\D/g, '');
    emit('update:modelValue', formattedValueAsNumber);
  }
})

function formatValue (val: string | number) {
  let valueAsString = String(val);
  return valueAsString
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

</script>

<template>
  <AppInput
      v-model="computedModelValue"
      :keypress="inputNumbersOnly"
  >
    <template #append-inner>{{ $t('sum') }}</template>
  </AppInput>
</template>