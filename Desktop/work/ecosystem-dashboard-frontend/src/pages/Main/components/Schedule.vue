<script setup lang="ts">
import { ref, watch } from "vue";
import { DatePicker } from "@/components/UI";
import { useI18n } from "vue-i18n";
import type { FairType, OnlineFairsType } from "@/pages/Main/api";
import { format } from "date-fns";
import useLoading from "@/composables/useLoading";

type PropsType = {
  data: OnlineFairsType | null
}

const props = defineProps<PropsType>();
const emit = defineEmits(['fetch']);

const { t } = useI18n();
const { isRequestLoading } = useLoading();

const currentDate = ref(new Date());

type ActiveItemType = {
  width: number,
  index: number
}

const daysRef = ref<HTMLDivElement | null>(null);
const currentEvent = ref<FairType | null>(null);
const selectedDay = ref<number | null>(null);

function scrollToActiveDay() {
  if (!daysRef.value) return;

  const activeItem = {} as ActiveItemType;
  const days = [...daysRef.value.children];

  days.find((item, index) => {
    if (item.classList.contains('date-picker__day--active')) {
      activeItem.width = item.getBoundingClientRect().width;
      activeItem.index = index;
    }
  })
  daysRef?.value?.scroll((activeItem.width + 25) * activeItem.index, 0);
}

function selectDay(day: number, fair: FairType | null = null) {
  selectedDay.value = day;
  currentEvent.value = fair;
}

watch(() => props.data?.days, (newValue) => {
  if (!newValue) return;

  Object
      .keys(newValue)
      .forEach(key => {
        if (!newValue[key].current && !newValue[key].fair) return;
        currentEvent.value = newValue[key].fair;
        selectedDay.value = +key;
      })

  setTimeout(() => {
    scrollToActiveDay();
  })
}, { deep: true })

watch(currentDate, (newValue) => {
  emit('fetch', format(new Date(newValue), 'yyyy-MM-dd'));
  selectedDay.value = null;
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h4 class="block-title--20 mb-4">{{ t('main.onlineFair') }}</h4>

    <DatePicker
        v-model="currentDate"
        class="mb-5"
        month-picker
        months-list
        days-list
    >
      <template #days>
        <v-progress-linear
            v-if="isRequestLoading('getOnlineFairs')"
            indeterminate
            color="#2988F5"
        />
        <div class="hasScroll--x">
          <div
              class="date-picker__days"
              ref="daysRef"
          >
            <div
                v-for="(item, day) in props.data?.days"
                :class="['date-picker__day', {
                  'date-picker__day--active': item.current,
                  'date-picker__day--selected': +day === selectedDay,
                  'date-picker__day--has-fair': item.fair && !item.current
                }]"
                @click="selectDay(+day, item.fair)"
            >
              <div class="date-picker__day__circle">
                {{ day }}
              </div>
              <div class="date-picker__day__title">
                {{ $t(`day.short.${ item.name }`) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </DatePicker>
    <div
        v-if="currentEvent"
        class="schedule__event"
    >
      <div class="d-flex w-100 mb-3">
        <!--        <div class="schedule__event__title"></div>-->

        <div class="schedule__event__icon">
          <img
              src="/img/icons/video.svg"
              alt=""
          />
        </div>
      </div>

      <div class="schedule__event__time">
        {{ currentEvent?.start.slice(0, 5) }} - {{ currentEvent?.end.slice(0, 5) }}
      </div>
      <div class="schedule__event__address">
        <v-icon
            icon="mdi-map-marker-outline"
            color="#2988F5"
        />

        {{ currentEvent?.region }}, {{ currentEvent?.city }}
      </div>

      <v-btn
          tag="a"
          color="#2988F5"
          class="w-100 no-uppercase text-white rounded-lg"
          height="46px"
          elevation="0"
          target="_blank"
          :href="`https://ecosys.mehnat.uz/fair-inner/${currentEvent?.id}`"
      >
        {{ t('main.join') }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss">
.schedule {
  &__event {
    display: flex;
    flex-direction: column;
    background: #F5F7FB;
    border: 1px solid #E8EEF3;
    border-radius: 10px;
    padding: 23px 20px 20px;

    &__title {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
      margin-right: 15px;
    }

    &__icon {
      min-width: 46px;
      max-width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(23, 146, 255, 0.2);
      border-radius: 10px;

      img {
        width: 18px;
        height: 12px;
      }
    }

    &__time {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: $soft-black;
      margin-bottom: 12px;
    }

    &__address {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: $soft-black;
      margin-bottom: 20px;

      i {
        margin-right: 10px;
      }
    }
  }
}
</style>