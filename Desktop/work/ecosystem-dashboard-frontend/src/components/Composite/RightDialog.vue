<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

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
  <v-dialog
      v-model="computedModelValue"
      class="right-dialog"
      transition="slide-x-reverse-transition"
  >
    <v-card>
      <div class="right-dialog__header">
        <h2 class="right-dialog__title">
          <slot name="title"/>
        </h2>

        <v-btn
            width="35px"
            height="35px"
            icon
            style="border-radius: 10px"
            class="ml-auto pa-0"
            elevation="0"
            color="#F1F5F9"
            @click="computedModelValue = false"
        >
          <svg
              data-src="/img/icons/close.svg"
              color="#373B55"
              style="width: 12px; height: 12px"
          />
        </v-btn>
      </div>

      <slot />
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.right-dialog {
  &.v-dialog {
    .v-overlay__content {
      max-height: unset;
      width: fit-content;
      min-width: 389px;
      margin: 0;
      right: 0;
      bottom: 0;
      top: 0;
      height: 100vh;

      > .v-card {
        height: 100%;
      }
    }
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid $stroke-color;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $black-color;
    margin-right: 20px;
  }
}
</style>