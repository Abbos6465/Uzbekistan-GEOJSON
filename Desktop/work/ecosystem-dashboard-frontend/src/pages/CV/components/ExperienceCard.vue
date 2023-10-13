<script setup lang="ts">
type PropsType = {
  data: any
}

defineProps<PropsType>();
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="experience-card">
    <div class="d-flex flex-column flex-1-1 pr-16">
      <h3 class="experience-card__title">{{ data.company_name ?? data.education_name }}</h3>

      <div class="d-flex flex-wrap">
        <div
            v-for="(detail, index) in data.details"
            :key="index"
            class="experience-card__detail"
        >
          {{ detail }}
        </div>
      </div>
    </div>

    <div class="d-flex mt-2">
      <v-btn
          width="45px"
          height="45px"
          icon
          elevation="0"
          class="v-btn--soft-red rounded-lg pa-0"
          @click="emit('delete')"
      >
        <svg
            data-src="/img/icons/trash-can.svg"
            color="#CB1520"
        />
      </v-btn>

      <v-btn
          width="45px"
          height="45px"
          icon
          elevation="0"
          class="v-btn--soft-blue rounded-lg pa-0 ml-4"
          @click="emit('edit')"
      >
        <svg
            data-src="/img/icons/pencil.svg"
            color="#2988F5"
        />
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss">
.experience-card {
  display: flex;
  width: 100%;
  margin-bottom: 35px;

  &__icon {
    display: flex;
    min-width: 54px;
    max-width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 1px solid $stroke-color;
    margin-right: 10px;
    overflow: hidden;

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    color: $black-color;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    margin: 5px 0;
  }

  &__detail {
    display: flex;
    align-items: center;
    color: $soft-black;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    margin-top: 6px;

    &:not(:last-child):after {
      content: '';
      min-width: 3px;
      max-width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: $soft-black;
      display: flex;
      margin: 0 10px;
    }
  }
}
</style>