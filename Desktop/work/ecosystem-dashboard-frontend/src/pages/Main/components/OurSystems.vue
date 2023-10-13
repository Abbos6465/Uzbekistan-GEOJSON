<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {useI18n} from "vue-i18n";
import type { OurSystemsType } from "@/pages/Main/types";
import AppImg from "@/components/UI/AppImg.vue";

type PropsType = {
  items: OurSystemsType[]
}

const props = defineProps<PropsType>();
const content = ref<HTMLElement | null>(null);
const isAutoScrollPaused = ref(false);
const {t} = useI18n();
const ourSystems = reactive([
  {
    logo: '/img/our-systems/tibbiy-logo.svg',
    text: t('main.unifiedInteractiveMedicalSocialServices'),
    image: '/img/our-systems/tibbiy.png'
  },
  {
    logo: '/img/our-systems/my-mehnat-logo.svg',
    text: t('main.unifiedElectronicWorkBook'),
    image: '/img/our-systems/my-mehnat.png',
    bgColor: '#F1F2FC'
  },
  {
    logo: '/img/our-systems/mening-ishim-logo.svg',
    text: t('main.MobileApplicationMeningIshim'),
    image: '/img/our-systems/mening-ishim.png',
    bgColor: '#CFECFE'
  },
  {
    logo: '/img/our-systems/milliy-vakansiyalar-bazasi-logo.svg',
    text: t('main.NationalDatabaseVacanciesUzbekistan'),
    image: '/img/our-systems/milliy-vakansiyalar-bazasi.png',
    bgColor: '#EAF2FA'
  },
  {
    logo: '/img/our-systems/labor-migration-logo.svg',
    text: t('main.laborMigration'),
    image: '/img/our-systems/labor-migration.png',
    bgColor: '#E8F5F6'
  },
  {
    logo: '/img/our-systems/online-mahalla-logo.svg',
    text: t('main.onlineMahallaElectronicPlatform'),
    image: '/img/our-systems/online-mahalla.png',
    bgColor: '#E8EFF6'
  },
  {
    logo: '/img/our-systems/freelance-logo.svg',
    text: t('main.freelancePlatform'),
    image: '/img/our-systems/freelance.png',
    bgColor: 'rgba(102, 194, 59, 0.09)'
  },
  {
    logo: '/img/our-systems/bandlik-vazirligi-logo.svg',
    text: t('main.registerProfessionalStandards'),
    image: '/img/our-systems/bandlik-vazirligi.png',
    bgColor: '#E4EBF3'
  },
  {
    logo: '/img/our-systems/profobuchenie-logo.svg',
    text: t('main.becomeExpertYourField'),
    image: '/img/our-systems/profobuchenie.png',
    bgColor: '#EAF2FA'
  },
  {
    logo: '/img/our-systems/onlayn-magazin-logo.svg',
    text: t('main.makePurchasesOnline'),
    image: '/img/our-systems/onlayn-magazin.png',
    bgColor: 'rgba(54, 75, 224, 0.06)'
  },
  {
    logo: '/img/our-systems/mustaqil-tekshirish-logo.svg',
    text: t('main.employerOrganizationPerformanceAssessmentPortal'),
    image: '/img/our-systems/mustaqil-tekshirish.png',
    bgColor: '#EAF2FA'
  },
]);

function autoScroll() {
  const height = 300;

  function scrollTo(value: number) {
    if(!content.value) return;

    content.value.scrollTop = value;
  }

  setInterval(() => {
    if(isAutoScrollPaused.value || !content.value) return;

    const scrollHeight = content.value.scrollHeight;
    const scrollTop = content.value.scrollTop;

    if(scrollHeight < (scrollTop + height)) return scrollTo(0);

    scrollTo(scrollTop + height);
  }, 2000)
}

onMounted(() => {
  autoScroll()
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h4 class="block-title--20 mb-4">{{ t('main.ourSystems') }}</h4>

    <div
        :class="['our-systems__row', {
          'hasScroll--y': props.items.length > 2
        }]"
        @mouseover="isAutoScrollPaused = true"
        @mouseleave="isAutoScrollPaused = false"
    >
      <div
          ref="content"
          class="d-flex flex-column"
      >
        <a
            v-for="(system, index) in props.items"
            :key="index"
            :href="system.url"
            target="_blank"
            class="our-system"
        >
          <div class="w-66 d-flex flex-column">
            <img
                :src="system.image_path"
                alt=""
                class="our-system__logo"
            />

            <p class="our-system__text">{{ system.title }}</p>
          </div>

<!--          <img-->
<!--              :src="system.image"-->
<!--              alt=""-->
<!--              class="our-system__image"-->
<!--          />-->
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.our-systems__row {
  //padding-top: 10px;

  &.hasScroll--y {
    &:after {
      //top: 20px;
    }

    > div {
      max-height: 270px;
      //padding-top: 20px;
      //margin-top: -20px;

      &::-webkit-scrollbar-track-piece {
        background: transparent;
        //margin-top: 20px;
      }
    }
  }
}

.our-system {
  min-height: 120px;
  max-height: 120px;
  display: flex;
  align-items: center;
  background: #EFF5FC;
  border-radius: 10px;
  padding: 14px 15px;
  position: relative;

  & + & {
    margin-top: 30px;
  }

  &__logo {
    width: fit-content;
    height: 32px;
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $black-color;
    margin-top: 10px;
    @include text-ellipsis(2);
  }

  &__image {
    position: absolute;
    right: 0;
    bottom: 0;
    height: calc(100% + 20px);
    max-width: 34%;
    object-fit: contain;
    object-position: bottom;
    border-bottom-right-radius: 10px;
  }
}
</style>