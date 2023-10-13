<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { AppInputSelect, Chip } from "@/components/UI";
import type { PersonalQualityType } from "@/pages/CV/types";

type PropsType = {
  modelValue: string[]
  items: PersonalQualityType[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    return props.modelValue.map(active => {
      const foundItem = props.items.find(item => item.value === active);

      if(foundItem) return foundItem;

      return active;
    })
  },
  set(newValue) {
    const modifiedValue = newValue.map(i => {
      if(typeof i === 'object') return i.value;

      return i;
    })
    emit('update:modelValue', modifiedValue);
  }
})

function removeQuality(index: number) {
  computedModelValue.value = computedModelValue.value.filter((item, idx) => idx !== index);
}
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--bordered block-title--20 mb-8">{{ $t('cv.personalQualities') }}</h2>

    <div
        v-if="computedModelValue.length"
        class="d-flex flex-wrap mb-5"
    >
      <Chip
          v-for="(item, index) in computedModelValue"
          :key="index"
          :title="typeof item === 'string' ? item : item.name"
          removable
          @remove="removeQuality(index)"
      />
    </div>

    <AppInputSelect
      v-model="computedModelValue"
      :items="items"
      :placeholder="$t('cv.skill-eg-UIDesign')"
      multiple
    />
  </div>
</template>

<style lang="scss">

</style>