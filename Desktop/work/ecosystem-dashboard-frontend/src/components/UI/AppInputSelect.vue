<script setup lang="ts">
import { computed, ref } from "vue";

type PropsType = {
  modelValue: string | any[]
  items: any[]
  placeholder?: string
  multiple?: boolean
  itemTitle?: string
  itemValue?: string
}

const props = withDefaults(defineProps<PropsType>(), {
  itemValue: 'value',
  itemTitle: 'name'
});
const emit = defineEmits(['update:modelValue']);

const isMenuOpen = ref(false);
const newValue = ref('');

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

const computedItems = computed(() => {
  if(!props.items.length) return;
  const items = props.items.filter(item => item[props.itemTitle].toLowerCase().includes(newValue.value.toLowerCase())) ?? [];

  if(newValue.value && items.length) isMenuOpen.value = true;

  return items;
})

function openMenu() {
  isMenuOpen.value = true
}

function addNewValue() {
  if(Array.isArray(computedModelValue.value)) computedModelValue.value = [...computedModelValue.value, newValue.value];

  newValue.value = '';
}
</script>

<template>
  <div class="app-input-select">
    <v-text-field
        v-model="newValue"
        :placeholder="placeholder"
        variant="outlined"
        density="compact"
        hide-details
        class="app-input-select__input"
        @keyup.enter="addNewValue"
        @click="openMenu"
    />

    <v-combobox
        v-model:menu="isMenuOpen"
        v-model="computedModelValue"
        :items="computedItems"
        :item-title="itemTitle"
        :item-value="itemValue"
        :multiple="multiple"
        bg-color="#2988F5"
        class="app-input-select__combobox"
        @update:modelValue="newValue = ''"
    />
  </div>
</template>

<style lang="scss">
.app-input-select {
  position: relative;
  
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
  }

  &__combobox {
    height: 0;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;

  }
}
</style>