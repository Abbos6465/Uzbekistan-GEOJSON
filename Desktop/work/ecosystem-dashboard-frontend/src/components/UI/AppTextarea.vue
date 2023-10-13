<script setup lang="ts">
import { computed, useSlots } from "vue";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  modelValue: string
  placeholder?: string
  label?: string
  required?: boolean
  hasError?: string[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const randomID = generateRandomID();

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <div class="app-textarea">
    <label
        v-if="slots.label || label"
        :for="randomID"
        class="app-input__label"
    >
      <slot
          v-if="slots.label"
          name="label"
      />

      <template v-else>{{ label }}</template>

      <span
          v-if="required"
          class="ml-1"
      >
        *
      </span>
    </label>

    <v-textarea
        v-model="computedModelValue"
        :id="randomID"
        :placeholder="placeholder"
        variant="outlined"
        no-resize
        hide-details
        :class="{'app-textarea__textarea--has-error': props.hasError?.length}"
    />

    <div
        v-if="props.hasError?.length"
        class="error-message"
    >
      {{ props.hasError[0] }}
    </div>
  </div>
</template>

<style lang="scss">
.app-textarea {
  display: flex;
  flex-direction: column;
  position: relative;

  &__label {
    width: fit-content;
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;
    color: $black-color;
    margin-bottom: 12px;
    cursor: pointer;
  }

  .v-field {
    height: 165px;
    &__outline {
      > div {
        border-color: $gray-stroke;
        opacity: 1!important;
      }

      &__start {
        border-radius: 8px 0 0 8px!important;
      }

      &__end {
        border-radius: 0 8px 8px 0!important;
      }
    }
  }

  &__textarea--has-error {
    .v-field__outline {
      > div {
        border-color: $soft-red;
      }
    }
  }
}
</style>