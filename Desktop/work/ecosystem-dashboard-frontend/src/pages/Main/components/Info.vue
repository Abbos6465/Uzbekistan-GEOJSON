<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/Auth";
import { useCommonStore } from "@/store/Common";
import commonApi from "@/api/commonApi";
import { createThenClickDownloadLink } from "@/utils/helper";
import api from "@/pages/Main/api";
import useLoading from "@/composables/useLoading";
import {useI18n} from "vue-i18n";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import EmptyWorkIcon from "./icons/EmptyWorkIcon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";
import ChevronBottomIcon from "@/pages/Main/components/icons/ChevronBottomIcon.vue";
import TickCircleIcon from "@/pages/Main/components/icons/TickCircleIcon.vue";
import CertificateIcon from "@/pages/Main/components/icons/CertificateIcon.vue";

const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {t} = useI18n();

const experience = ref({years: '', months: ''});
const isCVRequestLoading = ref(false);
const {isRequestLoading} = useLoading();

async function getExperience() {
  if(experience.value.months) return;

  experience.value = await api.getTotalExperienceApi();
}

async function downloadCV() {
  isCVRequestLoading.value = true;
  const cv = await commonApi.getCVDownloadApi()
      .finally(() => {
        isCVRequestLoading.value = false;
      });

  createThenClickDownloadLink(`CV ${ AuthStore.fullName }`, cv);
}

onMounted(() => {
  Promise.all([
    CommonStore.getProfilePhoto(),
    CommonStore.getCurrentJobsList({experience: true}),
    getExperience()
  ])
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5 d-flex">
    <div class="info__portrait">
      <v-progress-circular
          v-if="isRequestLoading('getProfilePhotoApi')"
          indeterminate
      />
      <img
          v-else-if="CommonStore.profilePhoto"
          :src="CommonStore.profilePhoto"
          class="info__portrait__img"
          alt=""
      />
      <img
          v-else
          :src="CommonStore.profileInfo?.gender === 'male' ? '/img/avatars/avatar-man1.svg' : '/img/avatars/avatar-woman.svg'"
          class="info__portrait__img"
          alt=""
      />
    </div>

    <div
        class="d-flex flex-column flex-1-1 info__details"
    >
      <div class="d-flex">
        <h2 class="info__name">{{ AuthStore.fullName }}</h2>
      </div>

      <v-divider style="margin: 10px 0; color: #E8EEF3; opacity: 1"/>

      <div class="d-flex flex-column">
        <div class="info__list-item">
          <div class="info__list-item__icon">
            <empty-work-icon />
          </div>
          <div class="d-flex flex-column">
            <h4 class="info__list-item__title">{{ t('main.currentPlaceOfWork') }}</h4>
            <v-skeleton-loader
                v-if="isRequestLoading('getCurrentJobsList')"
                type="paragraph"
                class="info__skeleton"
            />
            <v-menu
                v-else-if="CommonStore.currentJobs?.length"
                :disabled="CommonStore.currentJobs?.length < 2"
            >
              <template v-slot:activator="{ props, isActive }">
                <h4
                    v-bind="props"
                    class="info__list-item__value d-flex"
                    :style="{cursor: CommonStore.currentJobs?.length > 1 ? 'pointer' : ''}"
                >
                  <span class="info__list-item__value__company-name">{{ CommonStore.computedActiveJob?.company_name }}</span>

                  <v-tooltip
                      activator="parent"
                      location="top"
                  >
                    {{ CommonStore.computedActiveJob?.company_name }}
                  </v-tooltip>

                  <span class="info__list-item__value__experience">
                    -
                    {{ CommonStore.computedActiveJob?.experience?.years ? `${CommonStore.computedActiveJob?.experience.years + ' ' + t('main.years')}` : null }}
                    {{ CommonStore.computedActiveJob?.experience?.months ? `${CommonStore.computedActiveJob?.experience.months + ' ' + t('main.months')}` : '' }}
                  </span>

                  <chevron-bottom-icon
                      v-if="CommonStore.currentJobs?.length > 1"
                  />
                </h4>
              </template>

              <div class="menu-content">
                <v-btn
                    v-for="(work, index) in CommonStore.currentJobs"
                    :key="index"
                    variant="flat"
                    class="justify-start"
                    height="70px"
                    block
                    @click="CommonStore.changeSelectedJob(work.company_tin)"
                >
                  <div class="menu-content__item__logo menu-content__item__logo--empty">
                    <svg data-src="/img/icons/empty-work.svg"/>
                    <empty-work-icon />
                  </div>

                  <div class="menu-content__item__title">{{ work.company_name }}</div>

                  <tick-circle-icon />
                </v-btn>
              </div>
            </v-menu>
            <p
                v-else
                class="block-title--14"
            >
              <i>{{ t('main.noCurrentWork') }}</i>
            </p>
          </div>
        </div>
        <div class="info__list-item">
          <div class="info__list-item__icon">
            <svg data-src="/img/icons/antenna.svg"/>
          </div>
          <div class="d-flex flex-column">
            <h4 class="info__list-item__title">{{ t('main.generalExperience') }}</h4>

            <v-skeleton-loader
                v-if="isRequestLoading('getCurrentJobsList')"
                type="paragraph"
                class="info__skeleton"
            />
            <p
                v-else-if="experience.months || experience.years"
                class="info__list-item__value"
            >
              {{ experience.years ? `${experience.years + ' ' + t('main.years')}` : `` }}
              {{ experience.months ? `${experience.months + ' ' + t('main.months')}` : '' }}
            </p>
            <p
                v-else
                class="block-title--14"
            >
              <i>{{ t('main.noCurrentWork') }}</i>
            </p>
          </div>
        </div>
        <div
            v-if="CommonStore.computedActiveJob"
            class="info__list-item"
        >
          <div class="info__list-item__icon">
            <svg data-src="/img/icons/case.svg"/>
          </div>
          <div
              class="d-flex flex-column"
          >
            <h4 class="info__list-item__title">{{ t('main.jobTitle') }}</h4>
            <p class="info__list-item__value">
              <span
                  v-for="(position, index) in CommonStore.computedActiveJob.position"
                  :key="index"
                  class="mr-1"
              >
                {{ position.position_name }}
              <template v-if="index + 1 !== CommonStore.computedActiveJob.position.length">,</template>
              </span>

              <span class="block-title--14">
<!--                ({{ CommonStore.computedActiveJob.experience.years ? `${ CommonStore.computedActiveJob.experience.years } лет` : `` }}-->
<!--                {{ CommonStore.computedActiveJob.experience.months ? `${ CommonStore.computedActiveJob.experience.months } месяцев` : '' }})-->
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column ml-8">
      <div class="d-flex text-no-wrap align-center">
        <span class="block-title--14" style="color: #2988F5">{{ t('main.cvLens') }}</span>

        <v-btn
            min-width="44px"
            width="44px"
            height="40px"
            elevation="0"
            variant="outlined"
            color="#2988F5"
            class="d-flex no-uppercase rounded-lg block-title--14 pa-0 ml-2"
            :loading="isCVRequestLoading"
            @click="downloadCV"
        >
          <download-icon />
        </v-btn>
        <v-btn
            min-width="44px"
            width="44px"
            height="40px"
            elevation="0"
            variant="outlined"
            color="#2988F5"
            class="d-flex no-uppercase rounded-lg block-title--14 pa-0 ml-2"
            :to="{name: 'CV'}"
        >
          <v-icon
              icon="mdi-plus"
              size="18px"
              color="#2988F5"
              style="font-size: 28px"
          />
        </v-btn>
      </div>

      <router-link
          class="d-flex text-no-wrap align-center mt-2"
          :to="{name: 'Diploma Certificates'}"
      >
        <span class="block-title--14" style="color: #2988F5">{{ t('main.diplomaCertificates') }}</span>

        <v-btn
            min-width="44px"
            width="44px"
            height="40px"
            elevation="0"
            variant="outlined"
            color="#2988F5"
            class="d-flex no-uppercase rounded-lg block-title--14 pa-0 ml-auto"
        >
          <certificate-icon />
        </v-btn>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.info {
  &__portrait {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 154px;
    max-width: 154px;
    width: 100%;
    margin-right: 20px;

    &__img {
      width: 100%;
      height: fit-content;
      object-fit: contain;
      align-self: flex-start;
      border-radius: 10px;
    }
  }

  &__name {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: $black-color;
    //white-space: nowrap;
    //overflow: hidden;
    //text-overflow: ellipsis;
  }

  &__list-item {
    display: flex;

    &__icon {
      min-width: 44px;
      max-width: 44px;
      height: 44px;
      background: #F1F5F9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;

      svg {
        width: 14px;
        height: 14px;
        color: $soft-black;
      }
    }

    &__title {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: $soft-black;
      margin-bottom: 4px;
    }

    &__value {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $black-color;

      &__company-name {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__experience {
        color: #718193;
        white-space: nowrap;
      }
    }

    .flex-column {
      max-width: calc(100% - 50px);
    }

    & + & {
      margin-top: 20px;
    }
  }

  &__details {
    max-width: calc(100% - 160px - 287px);
  }

  &__skeleton {
    .v-skeleton-loader__bone {
      display: none;
      margin: 0;

      &:first-child {
        display: block;
      }
    }
  }
}
</style>