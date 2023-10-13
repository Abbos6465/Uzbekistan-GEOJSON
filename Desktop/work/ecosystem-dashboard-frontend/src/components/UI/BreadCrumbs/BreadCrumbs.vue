<script setup lang="ts">
import useBreadCrumbs from "@/components/UI/BreadCrumbs/useBreadCrumbs";
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const {breadCrumbsItems, isActive, initBreadCrumbs} = useBreadCrumbs();
const route = useRoute();

onMounted(() => {
  initBreadCrumbs(route.meta.breadCrumbs)
})

onUnmounted(() => {
  breadCrumbsItems.value = null;
  isActive.value = false;
})

</script>

<template>
  <div
      v-if="isActive"
      class="bread-crumbs d-flex align-center"
  >
    <template
        v-for="(link, index) in breadCrumbsItems"
        :key="index"
    >
      <component
          :is="link.route ? 'router-link' : 'div'"
          :to="link.route"
          class="bread-crumbs__item"
      >
        {{ $t(link.title) }}
      </component>

      <v-icon
          v-if="(breadCrumbsItems?.length - 1) !== index"
          icon="mdi-chevron-right"
          color="#718193"
          class="mx-1"
          style="margin-top: -2px"
      />
    </template>
  </div>
</template>

<style lang="scss">
.bread-crumbs {
  padding: 10px 0;
  margin-bottom: 30px;

  &__item {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #373B55;
  }
}

a.bread-crumbs__item {
  color: #2988F5;
}
</style>