<script
    setup
    lang="ts"
>
import { onMounted, ref } from "vue";
import { useCommonStore } from "@/store/Common";
import { createThenClickDownloadLink } from "@/utils/helper";

import commonApi from "@/api/commonApi";
import ReferenceDialog from "@/components/Composite/ReferenceDialog.vue";
import useLoading from "@/composables/useLoading";
import WorkbookDialog from "@/components/Composite/WorkbookDialog.vue";

const CommonStore = useCommonStore();
const { isRequestLoading } = useLoading();

const isReferenceDialogOpen = ref(false);
const isWorkbookDialogOpen = ref(false);
const isCVRequestLoading = ref(false);

async function downloadCV() {
  isCVRequestLoading.value = true;
  const cv = await commonApi.getCVDownloadApi()
      .finally(() => {
        isCVRequestLoading.value = false;
      });

  createThenClickDownloadLink(`CV ${ CommonStore.profileInfo?.fullName }`, cv);
}

async function openReferenceDialog() {
  if (!CommonStore.currentJobs.length) {
    await CommonStore.getCurrentJobsList();
  }

  isReferenceDialogOpen.value = true;
}

onMounted(() => {
  CommonStore.getProfilePhoto();
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5 h-100">
    <div class="d-flex align-start">
      <div class="mr-10">
        <h2 class="personal-info__name">{{ CommonStore.profileInfo?.fullName }}</h2>
        <h3 class="personal-info__occupation">{{ CommonStore.computedPositions }}</h3>
      </div>

      <div class="d-flex ml-auto">
        <v-btn
            width="fit-content"
            height="44px"
            class="no-uppercase mt-auto rounded-lg px-3 text-black"
            variant="flat"
            color="rgba(41, 136, 245, 0.1)"
            :loading="isRequestLoading('getCurrentJobsList')"
            @click="openReferenceDialog"
        >
          <img
              src="/img/icons/png-file.svg"
              alt=""
              class="mr-4"
          />

          {{ $t('main.Helpplacework') }}

          <svg
              data-src="/img/icons/download.svg"
              color="#2988F5"
              class="ml-5"
          />
        </v-btn>

        <v-btn
            width="fit-content"
            height="44px"
            class="no-uppercase mt-auto rounded-lg ml-5 px-3 text-black"
            variant="flat"
            color="rgba(41, 136, 245, 0.1)"
            @click="isWorkbookDialogOpen = true"
        >
          <img
              src="/img/icons/png-file.svg"
              alt=""
              class="mr-4"
          />

          {{ $t('my-job.ExtractLabor') }}

          <svg
              data-src="/img/icons/download.svg"
              color="#2988F5"
              class="ml-5"
          />
        </v-btn>

        <v-btn
            width="fit-content"
            height="44px"
            class="no-uppercase mt-auto rounded-lg ml-5 px-3 text-black"
            variant="flat"
            color="rgba(41, 136, 245, 0.1)"
            :loading="isCVRequestLoading"
            @click="downloadCV"
        >
          <img
              src="/img/icons/png-file.svg"
              alt=""
              class="mr-4"
          />

          {{ $t('menu.cv') }}

          <svg
              data-src="/img/icons/download.svg"
              color="#2988F5"
              class="ml-5"
          />
        </v-btn>
      </div>
    </div>

    <v-divider
        class="my-5"
        color="#E8EEF3"
        style="opacity: 1;"
    />

    <div class="d-flex">
      <img
          :src="CommonStore.profilePhoto"
          class="personal-info__avatar"
          alt=""
      />

      <v-row>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('common.birthdate') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.birthdate }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('cabinet.pinfl') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.pin }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('main.numberPassport') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.documentId }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('my-job.DateIssue') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.documentFrom }}</p>
        </v-col>

        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('cabinet.gender') }}:</h4>
          <p class="personal-info__item__value">{{ $t(`gender.${ CommonStore.profileInfo?.gender }`) }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('tin') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.tin }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('my-job.Issued') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.documentGivenFrom }}</p>
        </v-col>
        <v-col md="3">
          <h4 class="personal-info__item__title">{{ $t('my-job.Validity') }}:</h4>
          <p class="personal-info__item__value">{{ CommonStore.profileInfo?.documentUntil }}</p>
        </v-col>
      </v-row>
    </div>

    <teleport to="body">
      <ReferenceDialog v-model="isReferenceDialogOpen"/>

      <WorkbookDialog v-model="isWorkbookDialogOpen" />
    </teleport>
  </div>
</template>

<style lang="scss">
.personal-info {
  &__name {
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    color: $black-color;
    margin-bottom: 10px;
  }

  &__occupation {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: $soft-black;
  }

  &__avatar {
    min-width: 100px;
    max-width: 100px;
    object-fit: contain;
    object-position: top;
    margin-right: 20px;
  }

  &__item {
    &__title {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: $soft-black;
    }

    &__value {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;
      margin-top: 12px;
    }
  }
}
</style>