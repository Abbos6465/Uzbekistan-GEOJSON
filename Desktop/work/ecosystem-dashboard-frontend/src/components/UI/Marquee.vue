<script setup lang="ts">
import { Vue3Marquee } from "vue3-marquee";
import 'vue3-marquee/dist/style.css'
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import useLoading from "@/composables/useLoading";

type PropsType = {
  items: any[]
}

defineProps<PropsType>();

const {isRequestLoading} = useLoading();
</script>

<template>
  <div class="custom-marquee">
    {{ isRequestLoading('getVacancies') }}
    <div class="custom-marquee__wrapper">
      <Vue3Marquee
          pause-on-hover
          clone
          :duration="60"
      >
        <div class="d-flex">

          <v-skeleton-loader
              v-if="isRequestLoading('getVacancies')"
              type="paragraph"
              class="custom-marquee__skeleton"
          />

          <slot
              v-else
              v-bind="items"
          />
        </div>
      </Vue3Marquee>
    </div>
  </div>
</template>

<style lang="scss">
.custom-marquee {
  width: 100%;
  height: 54px;

  .marquee {
    min-width: unset!important;
  }

  &__wrapper {
    width: 100%;
    height: 54px;
    position: absolute;
    left: 0;
    top: 56px;
    background-color: #fff;
    z-index: 9;
  }

  .vue3-marquee {
    height: 100%;
  }

  &__item {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    margin: 0 25px;
    color: black;
  }

  &__skeleton {
    width: 300px;

    .v-skeleton-loader__bone {
      &:nth-child(3) {
        display: none;
      }
    }
  }
}
</style>