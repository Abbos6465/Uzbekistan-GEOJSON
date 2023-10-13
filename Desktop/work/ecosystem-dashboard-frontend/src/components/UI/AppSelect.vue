<script setup lang="ts">
import {computed, onMounted, ref, useSlots, watch} from "vue";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  modelValue: string | number | null | {}
  placeholder?: string
  label?: string
  items: any[]
  itemTitle?: string
  itemValue?: string
  returnObject?: boolean
  required?: boolean
  clearable?: boolean
  loading?: boolean
  disabled?: boolean
  hasError?: string[] | boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  itemValue: "id",
  itemTitle: "label",
  returnObject: false
});
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const randomID = generateRandomID();

const isMenuOpen = ref(false);

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

function openSelect() {
  isMenuOpen.value = true;
}

</script>

<template>
  <div
      class="app-select"
      :style="disabled ? 'cursor: no-drop' : ''"
  >
    <label
        v-if="slots.label || label"
        :for="randomID"
        class="app-select__label"
        @click="!props.disabled && openSelect"
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

    <v-select
        v-model="computedModelValue"
        v-model:menu="isMenuOpen"
        :id="randomID"
        :items="items"
        :item-value="itemValue!"
        :item-title="itemTitle!"
        :return-object="returnObject"
        :clearable="!!computedModelValue && clearable"
        :loading="loading ?? false"
        :class="['app-select__select', {
          'app-select__select--has-error': Array.isArray(hasError) ? hasError?.length : hasError
        }]"
        :disabled="disabled"
        variant="outlined"
        hide-details
        color="#2988F5"
    >
      <template
          v-if="placeholder && !computedModelValue"
          #prepend-inner
      >
        <div class="app-select__placeholder">
          {{ placeholder }}
        </div>
      </template>
    </v-select>

    <div
        v-if="Array.isArray(hasError) && hasError.length"
        class="app-select__error"
    >
      {{ hasError.join(', ') }}
    </div>
  </div>
</template>

<style lang="scss">
.app-select {
  position: relative;

  .v-select__selection-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-field__loader {
    bottom: 1px;
    width: calc(100% - 10px);
    left: 5px;
  }

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

  &__select {
    .v-field {
      &__field, &__input {
        min-height: unset;
        height: 46px;
        color: $black-color;
        opacity: 1;
      }

      &__input {
        padding: 0 5px 0 10px;
        align-items: center;
        font-size: 16px;
      }

      &__outline {
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
    }

    &--has-error {
      .v-field__outline {
        > div {
          border-color: $soft-red;
        }
      }
    }
  }

  &__placeholder {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #B3B5BE;
    font-size: 16px;
  }

  &__error {
    position: absolute;
    left: 0;
    top: calc(100% + 3px);
    color: $soft-red;
    font-size: 14px;
  }
}
</style>