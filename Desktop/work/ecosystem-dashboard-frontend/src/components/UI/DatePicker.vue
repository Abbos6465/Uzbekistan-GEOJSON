<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import type {DatePickerInstance} from '@vuepic/vue-datepicker'
import { computed, onMounted, ref, useSlots } from "vue";
import { useI18n } from "vue-i18n";
import { dateFormat, monthsList } from "@/utils/helper";
import '@vuepic/vue-datepicker/dist/main.css'

type PropsType = {
  modelValue?: string | null | Date | number
  value?: string | null | Date | number
  daysList?: boolean
  monthsList?: boolean
  label?: string
  placeholder?: string
  monthPicker?: boolean
  yearPicker?: boolean
  timePicker?: boolean
  required?: boolean
  disabled?: boolean
  hasError?: string[] | boolean
  right?: boolean
  teleport?: boolean
  format?: string
}
type MonthsType = {
  value: number
  title: string
}

const {t} = useI18n({});
const datepickerWrap = ref<HTMLDivElement | null>(null);
const datepickerRef = ref<DatePickerInstance>(null);
const months = monthsList();
const daysRef = ref<HTMLDivElement | null>(null);
const monthRef = ref<HTMLDivElement | null>(null);

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();

const computedModelValue = computed({
  get() {
    if(props.value) return new Date(props.value);

    if(props.monthPicker) {
      const date = new Date(props.modelValue);

      return {
        year: date.getFullYear(),
        month: date.getMonth()
      }
    }

    return props.modelValue;
  },
  set(newValue) {
    if(props.value) return;

    if(!newValue) return emit('update:modelValue', null);

    if(props.yearPicker) return emit('update:modelValue', newValue);

    if(props.format) return emit('update:modelValue', dateFormat(new Date(newValue), props.format))

    emit('update:modelValue', new Date(newValue))
  }
})

const activeMonth = computed(() => {
  if(!computedModelValue.value) return;

  const localDate = new Date(props.modelValue)
  return localDate.getMonth() + 1;
})

const activeYear = computed(() => {
  if(!props.modelValue) return;

  const localDate = new Date(props.modelValue)
  return localDate.getFullYear();
})

const formatted = computed(() => {
  if(props.value) {
    const date = new Date(props.value);

    return dateFormat(date, 'dd MMMM, yyyy')
  }

  if(!props.modelValue) return null;

  if(props.yearPicker) return props.modelValue

  const date = new Date(props.modelValue);

  if(props.monthPicker) return dateFormat(date, 'MMMM, yyyy')

  return dateFormat(date, 'dd MMMM, yyyy')
});

const daysInCurrentMonth = computed(() => {
  if(!activeYear.value || !activeMonth.value) return;

  return new Date(activeYear.value, activeMonth.value, 0).getDate();
});

const daysWithName = computed(() => {
  if(!daysInCurrentMonth.value || !activeMonth.value) return;

  const days = [];

  for(let i = 0; i < daysInCurrentMonth.value; i++) {
    const newDate = new Date(`${activeYear.value}-${activeMonth.value}-${i + 1}`)
    days.push(newDate);
  }

  return days;
})

function openPicker() {
  if(!datepickerRef.value) return;

  datepickerRef.value.openMenu();
}

function clearValue() {
  datepickerRef.value?.clearValue();
}

function selectCurrentMonth() {
  computedModelValue.value = new Date();
  datepickerRef.value?.closeMenu();
}

function changeMonth(newMonth: number) {
  if(!computedModelValue.value) {
    computedModelValue.value = new Date(activeYear.value!, newMonth)
  }
  else {
    const date = new Date(props.modelValue)
    computedModelValue.value = new Date(date.setMonth(newMonth));
  }
}

function changeDay(day: string) {
  computedModelValue.value = new Date(day)
}

type ActiveItemType = {
  width: number,
  index: number
}

function scrollToActiveDay() {
  if(!daysRef.value) return;

  const activeItem = {} as ActiveItemType;
  const days = [...daysRef.value.children];

  days.find((item, index) => {
    if(item.classList.contains('date-picker__day--active')) {
      activeItem.width = item.getBoundingClientRect().width;
      activeItem.index = index;
    }
  })
  daysRef?.value?.scroll((activeItem.width + 25) * activeItem.index, 0);
}

function scrollToActiveMonth() {
  if(!monthRef.value) return;

  const activeItem = {} as ActiveItemType;
  const months = [...monthRef.value.children];

  setTimeout(() => {
    months.find((item, index) => {
      if(item.classList.contains('date-picker__month-list__item--active')) {
        activeItem.width = item.getBoundingClientRect().width;
        activeItem.index = index;
      }
    })
    monthRef?.value?.scroll(activeItem.width * activeItem.index, 0);
  })
}

function onOpenMenu() {
  if(props.teleport) {
    const wrapPosition = datepickerWrap.value?.getBoundingClientRect();
    const menu = datepickerWrap.value?.querySelector('.dp__menu');

    if(!menu) return;
    menu.style.position = 'fixed';

    setTimeout(() => {
      menu.style.transform = 'unset';
      menu.style.top = `unset`;
      menu.style.left = `${wrapPosition.left}px`;
      menu.style.marginTop = 0;

      setTimeout(() => {
        menu.style.opacity = '1';
      }, 100)
    })
  }
}

onMounted(() => {
  scrollToActiveDay();
  scrollToActiveMonth()
})

</script>

<template>
  <div
      ref="datepickerWrap"
      :class="['date-picker',
      {
        'date-picker--teleport': teleport,
        'date-picker--right': right
      }]"
  >
    <label
        v-if="slots.label || label"
        class="date-picker__label"
        @click="openPicker"
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

    <VueDatePicker
        ref="datepickerRef"
        v-model="computedModelValue"
        model-type="timestamp"
        :enable-time-picker="timePicker"
        :year-picker="yearPicker"
        :month-picker="monthPicker"
        :auto-apply="true"
        :close-on-scroll="true"
        :disabled="disabled"
        :class="[
        {
          'date-picker__input--disabled': disabled,
          'date-picker--has-error': Array.isArray(hasError) ? hasError?.length : hasError
        }]"
        @open="onOpenMenu"
        @update-month-year="scrollToActiveMonth"
    >
      <template #trigger>
        <div class="date-picker__input">
          <div
              v-if="formatted"
              class="date-picker__input__value"
          >
            {{ formatted }}
          </div>

          <div
              v-else-if="placeholder"
              class="date-picker__input__placeholder"
          >
            {{ placeholder }}
          </div>

          <img
              src="/img/icons/chevron-left-right.svg"
              alt=""
              class="date-picker__input__arrow"
          />
        </div>
      </template>

      <template
          v-if="!yearPicker"
          #action-extra
      >
        <div class="d-flex py-2 px-4">
          <v-btn
              variant="text"
              color="#CB1520"
              class="date-picker__reset-btn"
              @click="clearValue"
          >
            {{ t('main.reset') }}
          </v-btn>

          <v-btn
              variant="text"
              color="#2988F5"
              class="date-picker__reset-btn ml-auto d-flex"
              @click="selectCurrentMonth"
          >
            {{ t('main.thisMonth') }}
          </v-btn>
        </div>
      </template>
    </VueDatePicker>

    <div
        v-if="props.monthsList"
        class="hasScroll--x"
    >
      <div
          ref="monthRef"
          class="date-picker__month-list"
      >
        <v-btn
            v-for="month in months"
            :key="month.value"
            :class="['date-picker__month-list__item', {
              'date-picker__month-list__item--active': (activeMonth - 1) === month.value
            }]"
            variant="text"
            @click="changeMonth(month.value)"
        >
          {{ month.title }}
        </v-btn>
      </div>
    </div>

<!--    <div-->
<!--        v-if="daysList"-->
<!--        class="hasScroll&#45;&#45;x"-->
<!--    >-->
<!--      <div-->
<!--          class="date-picker__days"-->
<!--          ref="daysRef"-->
<!--      >-->
<!--        <div-->
<!--            v-for="item in daysWithName"-->
<!--            :class="['date-picker__day', {-->
<!--              'date-picker__day&#45;&#45;active': item.getDate() === props.modelValue.getDate()-->
<!--            }]"-->
<!--            @click="changeDay(item)"-->
<!--        >-->
<!--          <div class="date-picker__day__circle">-->
<!--            {{ item.getDate() }}-->
<!--          </div>-->
<!--          <div class="date-picker__day__title">{{ $t(`day.short.${item.getDay()}`)  }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <slot name="days"/>

  </div>
</template>

<style lang="scss">
.dp {
  &__month_picker_header {
    padding: 0 5px;
  }

  &__menu {
    margin-top: -15px;
  }
}

.date-picker {
  position: relative;

  &--teleport {
    .dp__menu {
      opacity: 0;
    }
  }

  &--right {
    .dp__menu {
      right: 0;
      left: unset!important;
      transform: unset!important;
    }
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

  &__input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 46px;
    border: 1px solid #E2E2E2;
    border-radius: 8px;
    background-color: #fff;
    padding: 0 10px;
    cursor: pointer;

    &__value {
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      color: $black-color;
    }

    &__placeholder {
      color: #9E9E9E;
    }

    &__arrow {
      margin-left: auto;
    }

    &--disabled {
      opacity: .5;

      .date-picker__input {
        cursor: not-allowed;
      }
    }
  }

  .dp {
    &__menu {
      width: 411px;
      filter: drop-shadow(0px 22px 59px rgba(55, 59, 85, 0.1));
      border-radius: 8px;
      border: none;
    }

    &__overlay {
      border-radius: 8px 8px 0 0;
    }

    &__month_year_row {
      height: fit-content;
    }

    &__arrow_top {
      border-color: #fff;
    }

    &__pointer {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
    }

    &__month_picker_header {
      height: 40px;
    }

    &__inner_nav {
      width: 35px;
      height: 35px;
      border-radius: 5px;
    }

    &__selection_preview {
      display: none;
    }
  }

  &__reset-btn {
    .v-btn__content {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
    }
  }

  .dp__cell_inner.dp__active_date {
    color: #fff!important;
  }

  &--has-error {
    .date-picker__input {
      border-color: $soft-red;
    }
  }
}

.date-picker__month-list {
  display: flex;
  margin-top: 5px;
  padding: 0;
  overflow-x: auto;

  &__item {
    .v-btn__content {
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      color: $dark-gray;
      text-transform: capitalize;
    }

    & + & {
      margin-left: 5px;
    }

    &--active {
      .v-btn__content {
        color: $black-color;
      }
    }
  }
}

.date-picker__days {
  display: flex;
  padding: 15px 0;
  //border-bottom: 1px solid #E8EEF3;
}

.date-picker__day {
  padding-bottom: 11px;
  position: relative;
  cursor: pointer;

  &:after {
    content: '';
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: $blue-color;
    transition: width .3s;
  }

  & + & {
    margin-left: 34px;
  }

  &__circle {
    min-width: 45px;
    max-width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F1F5F9;
    border-radius: 50%;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $black-color;
    margin-bottom: 11px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $soft-black;
    text-align: center;
    text-transform: capitalize;
  }

  &--has-fair {
    &:after {
      width: 100%;
      background-color: $orange-color;
    }
  }

  &--active {
    &:after {
      width: 100%;
    }
  }

  &--selected {
    .date-picker__day {
      &__circle {
        background-color: $blue-color;
        color: #fff;
      }
    }
  }
}
</style>