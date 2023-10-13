<script setup lang="ts">


import {computed, onMounted, ref} from "vue";
import Rate from "@/components/UI/Rate.vue";
import {useI18n} from "vue-i18n";
import {useQualificationStore} from "@/pages/Qualification/store";

const {locale, t} = useI18n();


const QualificationStore = useQualificationStore();


const direction = computed(() => {
  return QualificationStore.current_direction;
})

</script>

<template>
  <div class="bg-white pa-5 rounded-lg h-100 my-course">
    <div class="">
      <div class="courses__rate__title rounded-xl pb-3">
        {{ t('qualification.YourCurrentRate') }}
      </div>
      <v-divider :thickness="1"/>
    </div>
    <template v-if="direction">
      <div class="courses__current__title mt-5">
        {{ locale == 'uz' ? direction.direction_name_uz : direction.direction_name_ru }}
      </div>
      <Rate
          :rate="direction.rate"
          class="mt-5"
      />
      <div class="p-0 boxes">
        <div class="box">
          <svg data-src="/img/icons/time.svg"></svg>
          <div class="box__text">
            {{ t('qualification.NumberOfHours') }}:
            <span class="box__text-content">
                  {{ direction.hourly }}
                </span>
          </div>
        </div>
        <div class="box">
          <svg data-src="/img/icons/time.svg"></svg>
          <div class="box__text">
            {{ t('qualification.TrainingPeriod') }}:
            <span class="box__text-content">
                  {{ direction.weekly }} {{t('qualification.week')}}
                </span>
          </div>
        </div>
        <div class="box">
          <svg data-src="/img/icons/users.svg"></svg>
          <div class="box__text">
            {{ t('qualification.TrainedByStudents') }}:
            <span class="box__text-content">
                  {{ direction.count_citizens }}
                </span>
          </div>
        </div>
      </div>
      <div class="about mt-5">
        <div class="about-title">
         {{t('qualification.About-the-course')}}
        </div>
        <div class="hasScroll--y">
          <div class="about-content mt-3">
            {{
              direction.info ?? 'WEB дастурлаш курсида сиз асосий дастурлаш тилларини ўрганасиз, замонавий веб-сайтларни яратишни ўрганасиз ва муваффақиятли веб-ишлаб чиқувчилар фойдаланадиган воситалар билан танишасиз. Фақат 80 та дарсда (10 ой) сиз тўлақонли касб учун барча керакли кўникмаларни ўзлаштирасиз. Курс янги бошланувчилар учун мўлжалланган ва тренинг нолдан олиб борилади. Барча маълумотлар аниқ ва тушунарли шаклда тақдим етилади ва талабалар ўзларини қулай ҳис қилишадиWEB дастурлаш курсида сиз асосий дастурлаш тилларини ўрганасиз, замонавий веб-'
            }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="w-100 mt-5 pa-4 d-flex align-center justify-center border rounded-lg">
        {{t('qualification.There-is-no-information')}}
      </div>
    </template>
  </div>
</template>