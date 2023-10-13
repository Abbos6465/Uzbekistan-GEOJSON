<script
    setup
    lang="ts"
>
import { useCommonStore } from "@/store/Common";
import useLoading from "@/composables/useLoading";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/Auth";

type ContactsType = 'phone' | 'email' | 'address';

const {t} = useI18n();
const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {isRequestLoading} = useLoading();

const contacts = computed(() => {
  return {
    phone: AuthStore.authInfo?.person_phone,
    email: AuthStore.authInfo?.email,
    address: CommonStore.profileInfo?.address,
  }
})
const personalInfo = computed(() => {
  return [
    {
      title: t('cabinet.pinfl'),
      value: CommonStore.profileInfo?.pin
    },
    {
      title: t('cabinet.DateBirth'),
      value: CommonStore.profileInfo?.birthdate
    },
    {
      title: t('cabinet.CountryBirth'),
      value: CommonStore.profileInfo?.birthCountry
    },
    {
      title: t('cabinet.PassportSeriesNumber'),
      value: CommonStore.profileInfo?.documentId
    },
    {
      title: t('cabinet.gender'),
      value: t(`gender.${CommonStore.profileInfo?.gender}`)
    },
    {
      title: t('cabinet.birthCity'),
      value: CommonStore.profileInfo?.birthCity
    },
    {
      title: t('cabinet.documentFrom'),
      value: CommonStore.profileInfo?.documentFrom
    },
    {
      title: t('cabinet.documentGivenFrom'),
      value: CommonStore.profileInfo?.documentGivenFrom
    },
    {
      title: t('cabinet.nationality'),
      value: CommonStore.profileInfo?.nationality
    },
    {
      title: t('cabinet.documentUntil'),
      value: CommonStore.profileInfo?.documentUntil
    },
    {
      title: t('cabinet.citizenship'),
      value: CommonStore.profileInfo?.citizenship
    }
  ]
})

function generateSuitIcon(key: ContactsType) {
  switch (key) {
    case 'phone':
      return 'mdi-phone-outline'
    case 'email':
      return 'mdi-email-outline'
    case 'address':
      return 'mdi-map-marker-outline'
  }
}
</script>

<template>
  <div
      class="bg-white pa-5"
      style="border-radius: 10px"
  >
    <div
        class="d-flex mb-5"
        style="height: 48px"
    >
      <h3 class="mr-6">{{ $t('cabinet.PersonalData') }}</h3>

<!--      <v-btn-->
<!--          small-->
<!--          variant="text"-->
<!--          style="color:#2988F5;"-->
<!--          class="no-uppercase ml-auto"-->
<!--          :to="{-->
<!--            name: 'CabinetPersonalInfoEdit'-->
<!--          }"-->
<!--      >-->
<!--        <v-icon-->
<!--            icon="mdi-pencil-outline"-->
<!--            class="mr-2"-->
<!--            color="#2988F5"-->
<!--        />-->
<!--        {{ $t('cabinet.edit') }}-->
<!--      </v-btn>-->
    </div>

    <div class="d-flex">
      <div class="resume__avatar">
        <v-progress-circular
            v-if="isRequestLoading('getProfilePhotoApi')"
            indeterminate
        />
        <img
            v-else-if="CommonStore.profilePhoto"
            :src="CommonStore.profilePhoto"
            class="resume__avatar__img"
            alt=""
        />
        <img
            v-else
            :src="CommonStore.profileInfo?.gender === 'male' ? '/img/avatars/avatar-man1.svg' : '/img/avatars/avatar-woman.svg'"
            class="resume__avatar__img"
            alt=""
        />
      </div>

      <div class="d-flex flex-column">

        <h2 class="resume__name">{{ CommonStore.profileInfo?.fullName }}</h2>

        <h3 class="resume__position">{{ CommonStore.computedPositions }}</h3>

        <div class="d-flex flex-column">
          <div
              v-for="(item, key) in contacts"
              :key="key"
              class="personal-info__contact"
          >
            <div class="personal-info__contact__icon">
              <v-icon
                  :icon="generateSuitIcon(key)"
                  color="#2988F5"
                  style="font-size: 18px"
              />
            </div>
            <p class="personal-info__contact__value">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>

    <v-divider class="my-5"/>

    <v-row>
      <v-col
          v-for="(item, index) in personalInfo"
          :key="index"
          md="4"
      >
        <div class="personal-info__card">
          <h5 class="personal-info__card__title">
            {{ item.title }}
          </h5>
          <p class="personal-info__card__value">
            {{ item.value }}
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style
    lang="scss"
    scoped
>
.personal-info {
  &__name {
    font-weight: 600;
    font-size: 26px;
    line-height: 32px;
    color: #373B55;
    margin-bottom: 10px;
  }

  &__position {
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    color: #373B55;
  }

  &__portrait {
    display: flex;
    align-items: center;
    justify-content: center;
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

  &__card {
    height: 100%;
    padding: 0 0 12px;
    border-bottom: 1px solid #E8EEF3;

    &__title {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #718193;
      margin-bottom: 10px;
    }

    &__value {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: #373B55;
    }
  }

  &__contact {
    display: flex;
    align-items: center;
    margin-top: 20px;

    &__icon {
      min-width: 30px;
      max-width: 30px;
      height: 30px;
      background: #F1F5F9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    &__value {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: #373B55;
    }
  }
}
</style>