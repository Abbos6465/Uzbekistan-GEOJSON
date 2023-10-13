<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import { computed, ref } from "vue";

type PropsType = {
  modelValue: string | number | Date | null
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    if(!props.modelValue) return;

    return props.modelValue;
  },
  set(newYear) {
    emit('update:modelValue', newYear)
  }
})

function changeYear(operator: '+' | '-') {
  if(operator === '+') {
    computedModelValue.value += 1
  }
  else if(operator === '-') {
    computedModelValue.value -= 1
  }
}

</script>

<template>
  <div class="year-picker">
    <vue-date-picker
        v-model="computedModelValue"
        year-picker
        auto-apply
        :clearable="false"
    >
      <template #dp-input="{value}">
        <div class="year-picker__trigger">

          <v-btn
              width="35px"
              height="35px"
              icon
              color="rgba(41, 136, 245, 0.1)"
              variant="flat"
              class="rounded-lg"
              :ripple="false"
              @click.stop="changeYear('-')"
          >
            <v-icon
                icon="mdi-chevron-left"
                color="#2988F5"
            />
          </v-btn>

          <div class="year-picker__trigger__year">{{ value }}</div>

          <v-btn
              width="35px"
              height="35px"
              icon
              color="rgba(41, 136, 245, 0.1)"
              variant="flat"
              :ripple="false"
              class="rounded-lg"
              @click.stop="changeYear('+')"
          >
            <v-icon
                icon="mdi-chevron-right"
                color="#2988F5"
            />
          </v-btn>

        </div>
      </template>
    </vue-date-picker>
  </div>
</template>

<style lang="scss">
.year-picker {
  &__trigger {
    width: 100%;
    height: 54px;
    background-color: #fff;
    border: 1px solid $light-gray;
    box-shadow: 0 4px 9px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;

    &__year {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
      margin: 0 auto;
    }
  }
}
</style>