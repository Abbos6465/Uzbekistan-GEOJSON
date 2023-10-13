<script setup lang="ts">
import { reactive } from "vue";
import type { CVList } from "@/pages/CV/types";
import { Switcher } from "@/components/UI";
import { useCVStore } from "@/pages/CV/store";
import { useRouter } from "vue-router";
import { formatPrice } from "@/utils/helper";

type PropsType = {
  data: CVList
}

const props = defineProps<PropsType>();
const emit = defineEmits(['change', 'delete']);

const CVStore = useCVStore();
const router = useRouter();

const actionButtons = reactive([
  {
    svg: '/img/icons/download.svg',
    onClick: () => {
      console.log('clicked!')
    }
  },
  {
    svg: '/img/icons/delete.svg',
    onClick: deleteCV
  },
  {
    svg: '/img/icons/pencil.svg',
    onClick: () => {
      router.push({
        name: 'CV Single',
        params: {
          id: props.data.id
        }
      })
    }
  }
]);

async function deleteCV() {
  emit('delete', props.data.id)
}
</script>

<template>
  <button :class="['cv-card', {'cv-card--active': data.id === CVStore.getSelectedCV.id}]">
    <div class="d-flex">
      <div class="d-flex flex-column flex-1-1">
        <h2 class="cv-card__title">{{ data.position_name }}</h2>
        <div
            v-if="data.updated_at"
            class="cv-card__date"
        >
          {{ $t('cv.updated') }}: {{ data.updated_at }}
        </div>
      </div>

      <div class="d-flex">
        <v-btn
            v-for="(item, index) in actionButtons"
            :key="index"
            width="36px"
            height="36px"
            icon
            variant="outlined"
            class="rounded-lg pa-0 ml-2"
            style="border-color: #E8EEF3"
            @click="item.onClick"
        >
          <svg
              :data-src="item.svg"
              color="#2988F5"
              style="width: 16px;height: 16px"
          />
        </v-btn>
      </div>
    </div>

    <div class="cv-card__desc">
      <div class="cv-card__desc__item">
        <svg
            data-src="/img/icons/dollar.svg"
            class="cv-card__desc__icon"
        />

        <span class="cv-card__desc__text">{{ formatPrice(data.salary) }}</span> <span>uzs</span>
      </div>

      <div class="cv-card__desc__item">
        <svg
            data-src="/img/icons/address.svg"
            class="cv-card__desc__icon"
        />

        <span class="cv-card__desc__text">{{ data.address }}</span>
      </div>

      <div class="cv-card__desc__item">
        <svg
            data-src="/img/icons/case.svg"
            class="cv-card__desc__icon"
        />

        <span class="cv-card__desc__text">{{ CVStore.getAppropriateWorkTypeName(data.work_type_id) }}</span>
      </div>
    </div>

    <Switcher
        v-if="CVStore.cvList.length > 1"
        v-model="data.active"
        :label="$t('cv.make-your-resume-main-one')"
        class="mt-6"
        @click.stop
        @update:modelValue="emit('change', data.id)"
    />
  </button>
</template>

<style lang="scss">
.cv-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid $stroke-color;
  background-color: #fff;
  cursor: pointer;

  & + & {
    margin-top: 20px;
  }

  &__title {
    font-size: 22px;
    line-height: normal;
    font-weight: 500;
    letter-spacing: -0.55px;
    text-align: left;
    margin-bottom: 7px;
  }

  &__date {
    font-size: 14px;
    line-height: normal;
    font-weight: 400;
    color: $soft-black;
  }

  &__desc {
    display: flex;
    margin: 12px -5px 0;

    &__item {
      flex-grow: 1;
      display: flex;
      align-items: flex-start;
      margin: 12px 5px 0;
    }

    &__icon {
      min-width: 16px;
      max-width: 16px;
      object-fit: contain;
      color: #{$soft-black};
      margin-right: 5px;
      font-size: 14px;
      font-weight: 400;
    }

    &__text {
      color: $soft-black;
      margin-right: 2px;
      text-align: left;
    }
  }

  &--active {
    border-color: $blue-color;
    cursor: default;
    box-shadow: 0px 12px 13px 0px rgba(78, 172, 255, 0.10);
  }
}
</style>