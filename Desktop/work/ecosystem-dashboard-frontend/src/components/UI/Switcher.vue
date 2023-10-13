<script setup lang="ts">
import { computed, useSlots } from "vue";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  modelValue?: boolean
  label?: string
  value?: boolean
  disabled?: boolean
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue', 'change']);
const slots = useSlots();
const randomID = generateRandomID();

const computedModelValue = computed({
  get() {
    if(props.value) return props.value;

    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
})
</script>

<template>
  <div class="switcher">
    <label
        v-if="slots.label || label"
        :for="randomID"
        class="switcher__label"
    >
      <slot
          v-if="slots.label"
          name="label"
      />

      <template v-else>{{ label }}</template>
    </label>
    <v-switch
        v-model="computedModelValue"
        :id="randomID"
        :disabled="disabled"
        hide-details
        inset
        color="#2988F5"
    />
  </div>
</template>

<style lang="scss">
.switcher {
  width: fit-content;
  display: flex;
  align-items: center;

  &__label {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    color: $black-color;
    margin-right: 20px;
    cursor: pointer;
  }

  .v-switch {
    &--inset .v-switch__track {
      width: 44px;
      height: 22px;
      color: #{$light-gray};
      box-shadow: 0px 3px 8px 0px rgba(85, 85, 85, 0.10) inset;
      opacity: 1;
    }

    &__thumb {
      width: 18px;
      height: 18px;
    }

    .v-selection-control {
      min-height: unset;

      &__wrapper {
        height: unset;
      }
    }
  }
}
</style>