<script setup lang="ts">
import { computed, useSlots } from "vue";

type PropsType = {
  modelValue: boolean
  width?: string,
  outsideClose?: boolean
  hideCloseIcon?: boolean
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue', 'close']);
const slots = useSlots();

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    if(!newValue) emit('close');
    emit('update:modelValue', newValue);
  }
})
</script>

<template>
  <v-dialog
      v-model="computedModelValue"
      transition="fade-transition"
      :width="width"
  >
    <v-card class="rounded-lg">
      <div class="dialog pa-5">
        <div class="d-flex flex-column">
          <slot name="header"/>
          <h2
              v-if="slots.title"
              class="block-title--bordered pt-1 block-title--20"
              :class="outsideClose ? '' : 'pr-12'"
          >
            <slot name="title" />
          </h2>

          <v-btn
              v-if="!outsideClose && !hideCloseIcon"
              class="dialog__close-btn rounded-lg pa-0"
              icon
              width="40px"
              height="40px"
              elevation="0"
              style="background-color: #F1F5F9"
              @click="computedModelValue = false"
          >
            <v-icon
                icon="mdi-close"
                size="20px"
            />
          </v-btn>
          <v-btn
              v-else-if="outsideClose"
              class="dialog__outside_close-btn dialog__close-btn rounded-lg pa-0"
              icon
              width="40px"
              height="40px"
              elevation="0"
              style="background-color: #F1F5F9"
              @click="computedModelValue = false"
          >
            <v-icon
                icon="mdi-close"
                size="24px"
                color="white"
            />
          </v-btn>
        </div>

        <slot />
      </div>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">

.v-outside_model{
  position: relative;
}

.dialog {
  &__close-btn {
    position: absolute!important;
    right: 20px;
    top: 15px;
    transition: transform .3s;

    &:hover {
      transform: translate(5px, -5px);
    }
  }

  &__outside_close-btn{
    position: fixed !important;
    background: none !important;
    top: -45px;
    right: -10px;


    &:hover{
      background: none !important;
      outline: none !important;
    }
  }
}
</style>