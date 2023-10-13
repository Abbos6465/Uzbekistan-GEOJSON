<script setup lang="ts">
import { computed, useSlots } from "vue";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  modelValue?: string
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  value?: string
  type?: string
  hasError?: string[]
  keypress?: Function
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const randomID = generateRandomID();

const computedModelValue = computed({
  get() {
    return props.value ? props.value : props.modelValue
  },
  set(newValue) {
    if(props.value) return;
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <div class="app-input">
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
    <v-text-field
        :id="randomID"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="type"
        v-model="computedModelValue"
        variant="outlined"
        density="compact"
        hide-details
        @keypress="props.keypress"
        :class="['app-input__input', {
          'app-input__input--has-error':  Array.isArray(hasError) ? hasError?.length : hasError
        }]"
    >
      <template
          v-if="$slots['append-inner']"
          #append-inner
      >
        <slot name="append-inner"/>
      </template>
    </v-text-field>

    <div
        v-if="Array.isArray(hasError) && hasError.length"
        class="error-message"
    >
      {{ hasError.join(', ') }}
    </div>
  </div>
</template>

<style lang="scss">
.app-input {
  position: relative;
  display: flex;
  flex-direction: column;

  &__label {
    width: fit-content;
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;
    color: $black-color;
    margin-bottom: 12px;
    cursor: pointer;

    &__required {
      margin-left: 5px;
    }
  }

  &__input {
    .v-field__input {
      height: 46px;
      font-size: 16px;
      color: $black-color;
    }

    .v-field__outline {
      > div {
        border-color: $gray-stroke;
        opacity: 1;
      }

      &__start {
        border-radius: 8px 0 0 8px!important;
      }

      &__end {
        border-radius: 0 8px 8px 0!important;
      }
    }

    &--has-error {
      .v-field__outline {
        > div {
          border-color: $soft-red;
        }
      }
    }
  }
}
</style>