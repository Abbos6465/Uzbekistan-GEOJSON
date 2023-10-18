<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Rate from "@/components/UI/Rate.vue";
import QualificationApi from "@/pages/Qualification/api";
import {useI18n} from "vue-i18n";

const btnPrev = ref(null);
const btnNext = ref(null);

const {t, locale} = useI18n();

const directions = ref([]);

async function getDirections() {
  QualificationApi.getDirections()
      .then(res => {
        directions.value = res;
      })
      .catch(err => {
        console.log(err);
      })
}

onMounted(() => {
  getDirections();
})

</script>

<template>
  <div class="popular-courses pa-5 bg-white pa-5 rounded-lg w-100">
    <div class="popular-courses_header d-flex align-center justify-space-between mb-5">
      <div class="title block-title--20">
        {{ $t('qualification.PopularCourses') }}
      </div>
      <div
          class="swiper-btns"
          v-if="directions.length>0"
      >
        <button
            ref="btnPrev"
            class="prev-btn v-theme--light"
        >
          <svg data-src="/img/icons/prev.svg"></svg>
        </button>
        <button
            ref="btnNext"
            class="next-btn v-theme--light"
        >
          <svg data-src="/img/icons/next.svg"></svg>
        </button>
      </div>
    </div>
    <v-divider :thickness="1"/>
    <div
        class="grid mt-5"
        v-if="directions.length>0"
    >
      <swiper
          :slidesPerView="1"
          :spaceBetween="10"
          :navigation="{
            prevEl: btnPrev,
            nextEl: btnNext,
          }"
          :modules="[Navigation]"
          :grab-cursor="true"
          :breakpoints="{
							'576': {
								slidesPerView: 1,
								spaceBetween: 10,
							},

							'700': {
								slidesPerView: 2,
								spaceBetween: 15,
							},

							'960': {
								slidesPerView: 1,
								spaceBetween: 20,
							},

							'1500': {
								slidesPerView: 2,
								spaceBetween: 20,
							}
						}"
          class="mySwiper swiper popular-courses-swiper"
      >
        <swiper-slide
            v-for="data in directions"
            :key="data.id"
            class=""
        >
          <a target="_blank" :href="`https://prof-ivory.vercel.app/popular-courses/${data.id}`" class="item">
            <div class="item_header">
              <div class="title">
                {{ locale == 'uz' ? data.direction_name_uz : data.direction_name_ru }}
              </div>
              <div class="mt-7">
                <Rate
                    :rate="data.rate"
                    imgClassName="kitchen-rate__img"
                    textClassName="kitchen-rate__text"
                />
              </div>
              <div class="edu_name">
                {{ data.organization_name }}
              </div>
              <div class="region_name">
                {{ locale == 'uz' ? data.region_name_uz : data.region_name_ru }}
              </div>
            </div>
            <div class="item_body">
              <v-divider :thickness="1"/>
              <div class="contents">
              <span class="text">
                {{
                  data.info ?? 'Веб дастурлаш курсида сиз асосий дастурлаш тилларини ўрганасиз, замонавий веб-сайтларни'
                }}
              </span>
                <span class="link">
                  <svg data-src="/img/icons/arrow-up.svg" class="link__icon"></svg>
                </span>
              </div>
            </div>
          </a>
        </swiper-slide>
      </swiper>
      <div class="mt-5 d-flex justify-end">
        <a target="_blank" href="https://prof-ivory.vercel.app/popular-courses">
          <span class="mr-2 text-blue">{{ t('qualification.ViewAll') }}</span>
          <svg data-src="/img/icons/next.svg" class="popular-courses__all-icon"></svg>
        </a>
      </div>
    </div>
    <div v-else class="w-100 mt-5 pa-4 d-flex align-center justify-center border rounded-lg">
      {{ t('qualification.There-is-no-information') }}
    </div>
  </div>
</template>

<style lang="scss">

.popular-courses {

  .grid {

    .swiper {

      .swiper-wrapper {
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 20px 0;

        .item {
          text-decoration: none;
          width: 99%;
          box-sizing: border-box !important;
          border-radius: 10px;
          border: 0.5px solid #E2E2E2;
          background: #FFF;
          box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.05);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            color: #373B55;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 20px;
            min-height: 60px;
            font-weight: 600;
          }

          .edu_name {
            margin-top: 26.5px;
            font-size: 14px;
            font-weight: 500;
            color: #373B55;
            min-height: 44px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .region_name {
            margin-bottom: 26.5px;
            font-size: 14px;
            font-weight: 400;
            color: #373B55;
          }

          &_body {
            width: 100%;

            .contents {
              margin-top: 26.5px;
              display: flex;
              align-items: end;
              justify-content: space-between;
              gap: 5px;

              .text {
                width: 85%;
                font-size: 14px;
                font-weight: 400;
                color: #718193;
                max-height: 85px;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .link {
                display: flex;
                transform: rotate(90deg);

                &__icon {

                  path {
                    stroke: #2988F5;
                  }
                }
              }

            }
          }
        }
      }
    }
  }
}

.popular-courses__all-icon {
  //width: 7px;
  //height: 12px;

  path {
    fill: #2988F5;

  }
}

</style>