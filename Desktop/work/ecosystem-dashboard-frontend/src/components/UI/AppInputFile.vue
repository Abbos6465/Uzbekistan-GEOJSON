<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  modelValue: string | File | FileList
  placeholder?: string
  label?: string
  required?: boolean
  accept?: string
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

function selectFile(e: Event) {
  let files = (<HTMLInputElement>e.target).files;

  if (!files?.length) return;

  computedModelValue.value = files[0];
}
</script>

<template>
  <div class="app-input-file">
    <label
        v-if="slots.label || label"
        :for="randomID"
        class="app-input-file__label"
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

    <v-file-input
        :id="randomID"
        :accept="accept"
        variant="outlined"
        density="compact"
        hide-details
        prepend-icon=""
        class="app-input-file__input"
        @change="selectFile"
    >
      <template
          v-if="placeholder && !computedModelValue"
          #prepend-inner
      >
        <div class="app-input-file__placeholder">
          {{ placeholder }}
        </div>
      </template>

      <template #append-inner>
        <v-btn
            icon="mdi-paperclip"
            class="app-input-file__btn"
            elevation="0"
            color="#E2EAF0"
        />
      </template>
    </v-file-input>
  </div>
</template>

<style lang="scss">
.app-input-file {
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

    .v-field {
      padding-inline-end: 0;
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
  }

  &__btn {
    border-radius: 0 8px 8px 0;
  }

  &__placeholder {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #B3B5BE;
    font-size: 16px;
  }

  .v-field__input {
    align-items: center;
  }
}
</style>