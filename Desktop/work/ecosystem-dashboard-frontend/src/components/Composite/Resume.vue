<script
    setup
    lang="ts"
>
import { computed, ref } from "vue";
import { useCommonStore } from "@/store/Common";
import { useAuthStore } from "@/store/Auth";
import { useCVStore } from "@/pages/CV/store";
import useLoading from "@/composables/useLoading";
import { dateFormat, formatPrice } from "@/utils/helper";
import AppImg from "@/components/UI/AppImg.vue";
import {useI18n} from "vue-i18n";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

enum TabsEnum {
  resume = 'resume',
  lens = 'lens'
}

const {isRequestLoading} = useLoading();
const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const CVStore = useCVStore();
const {t} = useI18n();

const tabs = [
  {
    title: t('cabinet.resume'),
    value: TabsEnum.resume,
  },
  {
    title: t('cabinet.lens'),
    value: TabsEnum.lens
  }
];
const selectedTab = ref<TabsEnum>(TabsEnum.lens);

const personalInfo = computed(() => {
  return [
    {
      title: t('common.phoneNumber'),
      value: AuthStore.authInfo?.person_phone,
      icon: 'mdi-phone-outline'
    },
    {
      title: t('common.birthdate'),
      value: CommonStore.profileInfo?.birthdate,
      icon: 'mdi-cake-variant-outline'
    },
    {
      title: t('common.ExpectedSalary'),
      value: CVStore.getSelectedCV?.salary && `${formatPrice(CVStore.getSelectedCV.salary)} uzs`,
      icon: 'mdi-currency-usd'
    },
    {
      title: t('common.email'),
      value: AuthStore.authInfo?.email,
      icon: 'mdi-email-outline'
    },
    {
      title: t('common.AddressResidence'),
      value: selectedTab.value === TabsEnum.resume && CVStore.getSelectedCV?.address ?  CVStore.getSelectedCV.address : CommonStore.profileInfo?.address,
      icon: 'mdi-map-marker-outline'
    },
    {
      title: t('common.jobType'),
      value: CVStore.getSelectedCV?.work_type_id && CVStore.getAppropriateWorkTypeName(CVStore.getSelectedCV.work_type_id),
      icon: 'mdi-briefcase-variant-outline'
    }
  ]
});
const computedSocialNetworks = computed(() => {
  if(selectedTab.value === TabsEnum.lens || !CVStore.getSelectedCV?.social_medias.length) return [];

  return CVStore.getSelectedCV?.social_medias.map(sn => {
    switch (sn.social_media_id) {
      case 1: return {
        icon: '/img/social-networks/facebook.svg',
        link: sn.link
      }
      case 2: return {
        icon: '/img/social-networks/instagram.svg',
        link: sn.link
      }
      case 3: return {
        icon: '/img/social-networks/telegram.svg',
        link: sn.link
      }
      case 4: return {
        icon: '/img/social-networks/linkedin.svg',
        link: sn.link
      }
    }
  })
})
const computedWorkbook = computed(() => {
  if(!CommonStore.historyWorkBook.length && !CVStore.getSelectedCV?.work_histories.length) return [];

  if(selectedTab.value === TabsEnum.resume) {
    return CVStore.getSelectedCV?.work_histories.map(cv => {
      return {
        organization: cv.company_name,
        positions: [
          {
            position_name: cv.position,
            date_start: cv.date_start,
            date_stop: cv.date_stop,
            work_type: cv.work_type_id
          }
        ]
      }
    });
  }

  return CommonStore.historyWorkBook;
});
const computedEducation = computed(() => {
  if(!CommonStore.diplomas.length && !CVStore.getSelectedCV?.education_histories.length) return [];

  if(selectedTab.value === TabsEnum.resume) {
    return CVStore.getSelectedCV?.education_histories.map(edu => {
      return {
        institution_name: edu.education_name,
        edu_starting_date: edu.start_year,
        edu_finishing_date: edu.stop_year,
        speciality_name: edu.specialty_name,
        degree_name: edu.edu_type_id,
      }
    });
  }

  return CommonStore.diplomas;
});
const computedPersonalQualities = computed(() => {
  if(!CVStore.getSelectedCV?.personal_qualities.length) return [];

  return CVStore.getSelectedCV.personal_qualities.map(quality => {
    const foundQuality = CVStore.personalQualities.find(i => i.value === quality);

    return foundQuality?.name ?? quality;
  })
})
const computedLangs = computed(() => {
  if(!CVStore.getSelectedCV?.languages.length) return [];

  return CVStore.getSelectedCV.languages.map(lang => {
    const foundLang = CommonStore.languages.find(i => i.id === lang.language_id);
    const foundLevel = CommonStore.languageLevels.find(i => i.id === lang.level_id);

    return {
      lang: foundLang?.name ?? lang.language_id,
      level: foundLevel?.name ?? lang.level_id
    };
  })
})
</script>

<template>
  <div
      class="bg-white pa-5"
      style="border-radius: 10px"
  >
<!--    <v-progress-linear-->
<!--        v-if="isRequestLoading('getCVsList')"-->
<!--        indeterminate-->
<!--        color="#2988F5"-->
<!--    />-->

    <div
        class="d-flex mb-5"
        style="height: 48px"
    >
      <template v-if="CVStore.cvList.length">
        <v-btn-toggle
            v-model="selectedTab"
            group
            mandatory
            color="#2988F5"
            style="background-color: #F7F9FB; box-shadow: inset 0 3px 8px rgba(85, 85, 85, 0.1);border-radius: 50px"
        >
          <v-btn
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              style="background: transparent; border-radius: 50px"
              class="btn--blue no-uppercase"
          >
            {{ tab.title }}
          </v-btn>
        </v-btn-toggle>
      </template>

      <h3
          v-else
          class="d-flex align-center"
      >
        {{ $t('cabinet.lens') }}
      </h3>

      <v-btn
          small
          variant="text"
          style="color:#2988F5;"
          class="no-uppercase ml-auto"
      >
        <svg
            data-src="/img/icons/download.svg"
            class="mr-2"
            color="#2988F5"
        />
        {{ $t('common.downloadPDF') }}
      </v-btn>
    </div>

    <v-skeleton-loader
        v-if="isRequestLoading('getCVsList')"
        type="list-item-avatar"
        class="resume__skeleton"
    />

    <div
        v-else
        class="d-flex pb-3 mb-5"
    >
      <div class="resume__avatar personal-info__avatar">
        <v-progress-circular
            v-if="isRequestLoading('getProfilePhotoApi')"
            indeterminate
        />
        <img
            v-else-if="selectedTab === TabsEnum.lens"
            :src="CommonStore.profilePhoto"
            class="resume__avatar__img"
            alt=""
        />
        <img
            v-else
            :src="CVStore.getSelectedCV?.avatar!"
            alt=""
            class="resume__avatar__img"
        />
      </div>

      <div class="d-flex flex-column">
        <h2 class="resume__name">{{ CommonStore.profileInfo?.fullName }}</h2>
        <h3 class="resume__position">
          {{ selectedTab === TabsEnum.lens ?
            CommonStore.computedPositions : CVStore.getSelectedCV?.position_name }}
        </h3>
        <div class="resume__social-nets">
          <a
              v-for="(sn, snIndex) in computedSocialNetworks"
              :key="snIndex"
              :href="sn.link"
              class="resume__social-net"
          >
            <svg
                :data-src="sn.icon"
            />
          </a>
        </div>
      </div>
    </div>

    <!--      About-->
    <div
        v-if="selectedTab === TabsEnum.resume && CVStore.getSelectedCV?.about"
        class="d-flex flex-column mb-7"
    >
      <v-skeleton-loader
          v-if="isRequestLoading('getCVsList')"
          type="paragraph"
      />

      <template v-else>
        <h4 class="block-title--14 mb-2">
          {{ $t('title.aboutself') }}
        </h4>
        <p class="resume__info-card__value">{{ CVStore.getSelectedCV?.about }}</p>
      </template>
    </div>

    <div class="d-flex flex-column">
      <h4 class="block-title--14 mb-5">
        {{ $t('title.personalData') }}
      </h4>

      <v-row>
        <template
            v-for="(item, index) in personalInfo"
            :key="index"
        >
          <v-col
              v-if="item.value"
              md="6"
              lg="4"
          >
            <div class="resume__info-card">
              <div class="resume__info-card__icon">
                <v-icon
                    :icon="item.icon"
                    color="#718193"
                    style="font-size: 18px"
                />
              </div>
              <div class="d-flex flex-column">
                <p class="resume__info-card__value">{{ item.value }}</p>
                <v-tooltip
                    activator="parent"
                    location="top"
                >
                  {{ item.value }}
                </v-tooltip>
                <p class="resume__info-card__title">{{ item.title }}</p>
              </div>
            </div>
          </v-col>
        </template>
      </v-row>
    </div>

    <!--      Relatives-->
    <template v-if="selectedTab === TabsEnum.lens">
      <v-divider class="mt-7"/>

      <template v-if="isRequestLoading('getRelatives')">
        <v-skeleton-loader
            v-for="skeleton in 5"
            :key="skeleton"
            type="list-item-avatar"
            class="resume__skeleton mb-0"
        />
      </template>

      <div class="d-flex flex-column mt-7">
        <h4 class="block-title--14 mb-5">
          {{ $t('common.relatives') }}
        </h4>

        <div
            v-if="CommonStore.relatives.length"
            class="d-flex flex-column"
        >
          <div
              v-for="(item, index) in CommonStore.relatives"
              :key="index"
              class="resume__experience"
          >
            <div class="resume__experience__avatar">
              <img
                  :src="item.gender === 'male' ? '/img/icons/male.svg' : '/img/icons/female.svg'"
                  alt=""
              />
            </div>

            <div class="resume__experience__desc">
              <h3 class="resume__experience__company">{{ item.fullName }} ({{ $t(`relatives.typeId.${item.relativeType}`) }})</h3>

              <div class="d-flex text-truncate">
                <div class="resume__experience__detail">
                  {{ dateFormat(new Date(item.birthDate)) }}
                </div>
                <div
                    v-if="item.workAndPosition"
                    class="resume__experience__detail"
                >
                  {{ item.workAndPosition }}
                </div>
              </div>
              <div
                  v-if="item.address"
                  class="resume__experience__address"
              >
                {{ $t('common.lives') }}: {{ item.address }}
              </div>
            </div>
          </div>
        </div>
        <template v-else>{{ $t('common.noData') }}</template>
      </div>
    </template>

    <v-divider class="my-7"/>

    <!--      WorkBook-->
    <div class="d-flex flex-column">
      <h4 class="block-title--14 mb-5">
        {{ $t('common.experience') }}
      </h4>

      <template v-if="isRequestLoading('getWorkbook')">
        <v-skeleton-loader
            v-for="skeleton in 5"
            :key="skeleton"
            type="list-item-avatar"
            class="resume__skeleton mb-0"
        />
      </template>
      <div
          v-else-if="computedWorkbook?.length"
          class="d-flex flex-column"
      >
        <div
            v-for="(item, index) in computedWorkbook"
            :key="index"
            class="resume__experience"
        >
          <svg
              data-src="/img/icons/empty-work-circle.svg"
              class="resume__experience__icon"
          />

          <div class="d-flex flex-column flex-1-1 pr-4">
            <h3 class="resume__experience__company">{{ item.organization }}</h3>
            <div class="d-flex flex-wrap">
              <div class="resume__experience__detail">
                {{ item.positions[0].position_name }}
              </div>
              <div class="resume__experience__detail">
                {{ dateFormat(new Date(item.positions[0].date_start)) }} - {{ item.positions[0].date_stop === null ? $t('common.UntilNow') : dateFormat(new Date(item.positions[0].date_stop)) }}
              </div>
            </div>
          </div>

          <div class="resume__experience__btn">
            {{ CVStore.getAppropriateWorkTypeName(item.positions[0].work_type) }}
          </div>
        </div>
      </div>
      <template v-else>{{ $t('common.noData')  }}</template>
    </div>

    <v-divider class="my-7"/>

    <!--      Education-->
    <div class="d-flex flex-column">
      <h4 class="block-title--14 mb-5">
        {{ $t('common.Education') }}
      </h4>

      <template v-if="isRequestLoading('getDiplomaApi')">
        <v-skeleton-loader
            v-for="skeleton in 5"
            :key="skeleton"
            type="paragraph"
            class="resume__skeleton mb-0"
        />
      </template>
      <div
          v-else-if="computedEducation?.length"
          class="d-flex flex-column"
      >
        <div
            v-for="(item, index) in computedEducation"
            :key="index"
            class="resume__experience"
        >
          <div class="d-flex flex-column flex-1-1">
            <h3 class="resume__experience__company">{{ item.institution_name }}</h3>
            <div class="d-flex flex-wrap">
              <div class="resume__experience__detail">
                {{ dateFormat(new Date(item.edu_starting_date)) }} - {{ item.edu_finishing_date === null ? $t('common.UntilNow') : dateFormat(new Date(item.edu_finishing_date)) }}
              </div>
              <div class="resume__experience__detail">
                {{ item.speciality_name }}
              </div>
              <div class="resume__experience__detail">
                {{ item.degree_name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>{{ $t('common.noData')  }}</template>
    </div>

    <template v-if="selectedTab === TabsEnum.resume">
      <v-divider class="my-7"/>

      <!--        Driver License-->
      <template v-if="CVStore.getSelectedCV?.driving_experience?.length">
        <div class="d-flex flex-column">
          <h4 class="block-title--14 mb-5">
            Опыт вождения
          </h4>

          <v-row>
            <v-col
                md="6"
                lg="6"
            >
              <div class="resume__info-card">
                <div class="resume__info-card__icon">
                  <svg
                      data-src="/img/icons/document.svg"
                  />
                </div>
                <div class="d-flex flex-column">
                  <p class="resume__info-card__value">
                    {{ CVStore.getSelectedCV.driving_experience.join(', ') }}
                  </p>
                  <p class="resume__info-card__title">Права категории</p>
                </div>
              </div>
            </v-col>
            <v-col
                v-if="CVStore.getSelectedCV?.has_car"
                md="6"
                lg="6"
            >
              <div class="resume__info-card">
                <div class="resume__info-card__icon">
                  <svg
                      data-src="/img/icons/car.svg"
                  />
                </div>
                <div class="d-flex flex-column">
                  <p class="resume__info-card__value">Есть личный автомобиль</p>
                  <p class="resume__info-card__title">Автомобиль</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-7"/>
      </template>

      <!--        Personal Qualities-->
      <template v-if="computedPersonalQualities.length">
        <div class="d-flex flex-column">
          <h4 class="block-title--14">
            {{ $t('common.keySkills') }}
          </h4>

          <div class="resume__skills">
            <div
                v-for="(item, index) in computedPersonalQualities"
                :key="index"
                class="resume__skill"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <v-divider class="my-7"/>
      </template>

      <!--        Languages-->
      <div class="d-flex flex-column">
        <h4 class="block-title--14">
          {{ $t('common.Language') }}
        </h4>

        <div class="resume__langs">
          <div class="resume__lang">
            <!--            <div class="resume__lang__code">{{ item.code }}</div>-->

            <div class="d-flex flex-column">
              <p class="resume__lang__value">{{ CommonStore.getAppropriateLangName(CVStore.activeCV.native_language_id) }}</p>
              <p class="resume__lang__degree">{{ $t('nativeLang') }}</p>
            </div>
          </div>
          <div
              v-for="(item, index) in computedLangs"
              :key="index"
              class="resume__lang"
          >
            <!--            <div class="resume__lang__code">{{ // item.code }}</div>-->

            <div class="d-flex flex-column">
              <p class="resume__lang__value">{{ item.lang }}</p>
              <v-tooltip
                  activator="parent"
                  location="end"
              >
                {{ item.lang }}
              </v-tooltip>
              <p class="resume__lang__degree">{{ item.level }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.v-btn--active.btn--blue {
  background-color: #2988F5 !important;
  color: #fff !important;
}

.resume {
  &__avatar {
    min-width: 120px;
    max-width: 120px;
    max-height: 150px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 20px;

    &__img {
      width: 100%;
      max-height: 100%;
      align-self: flex-start;
      object-fit: contain;
      object-position: top;
      border-radius: 10px;
    }

    .app-img {
      width: 100%;
    }
  }

  &__name {
    font-weight: 500;
    font-size: 22px;
    line-height: 28px;
    letter-spacing: -0.025em;
    color: #373B55;
    margin-bottom: 10px;
  }

  &__position {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: #373B55;
  }

  &__social-nets {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  &__social-net {
    display: flex;
    margin-right: 20px;
    width: 20px;
    height: 20px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.resume__skeleton {
  margin: 0 -16px -16px;
}

.resume__info-card {
  display: flex;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    max-width: 32px;
    height: 32px;
    border-radius: 6px;
    background: #F1F5F9;
    margin-right: 10px;
  }

  .flex-column {
    overflow-x: hidden;
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718193;
    margin-top: 3px;
  }

  &__value {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #373B55;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}

.resume__experience {
  display: flex;

  & + & {
    margin-top: 30px;
  }

  &__avatar {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #F1F5F9;
    display: flex;
    justify-content: center;
    align-self: flex-start;
    margin-right: 10px;
    overflow: hidden;
    padding-top: 8px;

    img {
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  &__icon {
    min-width: 54px;
    max-width: 54px;
    height: 54px;
    margin-right: 10px;
  }

  &__desc {
    display: flex;
    flex-direction: column;
    width: calc(100% - 54px - 10px);
  }

  &__address {
    width: fit-content;
    background: #F1F5F9;
    border-radius: 5px;
    padding: 5px;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718193;
    margin-top: 6px;
  }

  &__company {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #373B55;
    margin-bottom: 8.5px;
  }

  &__detail {
    display: flex;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718193;

    &:not(.resume__experience__detail:last-child):after {
      content: '';
      display: flex;
      min-width: 3px;
      max-width: 3px;
      border-radius: 50%;
      height: 3px;
      background: #718193;
      margin: 7px 10px 0;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    align-self: flex-start;
    background: #F1F5F9;
    border-radius: 5px;
    font-weight: 400;
    font-size: 12px;
    color: #718193;
    padding: 5px;
    white-space: nowrap;
  }
}

.resume__skills {
  margin: 0 -5px;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
}

.resume__skill {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 38px;
  padding: 0 10px;
  background: #F1F5F9;
  border-radius: 10px;
  margin: 10px 5px 0;
  white-space: nowrap;
  font-weight: 400;
  font-size: 14px;
  color: #718193;
}

.resume__langs {
  margin: 0 -10px;
  display: flex;
  flex-wrap: wrap;
}

.resume__lang {
  display: flex;
  align-items: center;
  margin: 20px 10px 0;
  background: #F1F5F9;
  border-radius: 10px;
  padding: 10px;

  &__code {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #718193;
    border-radius: 50%;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    margin-right: 10px;
  }

  &__value {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #373B55;
    margin-bottom: 3px;
  }

  &__degree {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718193;
  }
}
</style>