<script setup lang="ts">
import { reactive } from "vue";
import {useI18n} from "vue-i18n";

const currencies = reactive(['usd', 'rub', 'uzs', 'eur']);
const {t} = useI18n();

</script>

<template>
  <div class="weather-course">
    <div class="weather-course__item">
      <h4 class="block-title--20 mb-4">{{ $t('components.WeatherToday') }}</h4>

      <div class="d-flex my-auto">
        <div class="weather-course__item__degree">
          <img
              src="/img/icons/sun.svg"
              alt=""
              class="mr-2"
          />

          +43
          <img
              src="/img/icons/degree.svg"
              alt=""
              class="align-self-start"
              style="width: 8px;height: 8px"
          />
        </div>
        <div class="weather-course__item__degree">
          <img
              src="/img/icons/moon.svg"
              alt=""
              class="mr-2"
          />

          +43
          <img
              src="/img/icons/degree.svg"
              alt=""
              class="align-self-start"
              style="width: 8px;height: 8px"
          />
        </div>
      </div>
    </div>
    <div class="weather-course__item">
      <h4 class="block-title--20 mb-4">{{ $t('components.ExchangeRates') }}</h4>

      <v-menu scroll-strategy="close">
        <template v-slot:activator="{ props }">
          <button
              v-bind="props"
              class="weather-course__btn"
          >
            <img
                src="/img/icons/usa.png"
                alt=""
                class="weather-course__btn__icon"
            />
            <span class="d-flex flex-column mr-2">
                  <span class="weather-course__btn__title">1 доллар США, равно на</span>
                  <span class="weather-course__btn__value">11 356,14 {{ $t('sum') }}</span>
                </span>

            <svg
                data-src="/img/icons/chevron-bottom.svg"
                class="weather-course__btn__arrow"
            />
          </button>
        </template>

        <div class="menu-content">
          <v-btn
              v-for="(currency, index) in currencies"
              :key="index"
              variant="flat"
              class="justify-start"
          >
            {{ currency }}
          </v-btn>
        </div>
      </v-menu>
    </div>
  </div>
</template>

<style lang="scss">
.weather-course {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 28px;

  &__item {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 20px;

    &__degree {
      width: 50%;
      display: flex;

      &:first-child {
        padding-right: 20px;
        border-right: 1px solid $light-gray;
      }

      &:nth-child(2) {
        padding-left: 20px;
      }
    }

    &:first-child {
      border-right: 1px solid $light-gray;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    text-align: left;
    cursor: pointer;

    &__icon {
      min-width: 26px;
      max-width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &__title {
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: $soft-black;
    }

    &__value {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: $black-color;
    }

    &__arrow {
      width: 13px;
      height: 7px;
      margin-left: auto;
      color: #{$black-color};
    }
  }
}
</style>