<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import FancyBox from "@/components/UI/FancyBox.vue";
import Rate from "@/components/UI/Rate.vue";
import Dialog from "@/components/UI/Dialog.vue";
import SaveRate from "@/components/UI/SaveRate.vue";
import QualificationApi from "@/pages/Qualification/api";
import {useQualificationStore} from "@/pages/Qualification/store";
import {useI18n} from "vue-i18n";


const btnPrev = ref(null);
const btnNext = ref(null);
const isViewed = ref(false);
const videoId = ref(null);
const ratingModal = ref(false);
const videoRate = ref(0);
const videos = ref([]);
const QualificationStore = useQualificationStore();
const {locale, t} = useI18n();

function changeRate(value) {
  videoRate.value = value;
}

function saveRateHandler() {
  const params = {
    rate: Number(videoRate.value),
    video_id: Number(videoId.value)
  }
  saveRateModule(params);
}

async function saveRateModule(params) {
  const newParams = {...params, ...{module: 'rate_video'}};
  QualificationStore.saveRateModule(newParams)
      .then(res => {
        ratingModal.value = false;
        getVideos();
      })
      .catch(err => {
        console.log(err);
      })
}

function videoViewed(value) {
  isViewed.value = value;
}

function videoClosed(id) {
  if (isViewed) {
    ratingModal.value = true;
    videoId.value = id;
  }
  getVideo(id);
}

async function getVideos(params = {}) {
  QualificationApi.getVideos(params)
      .then(res => {
        videos.value = res;
      })
}

async function getVideo(params = {}) {
  QualificationApi.getVideo(params)
      .then(res => {
        getVideos();
      })
}


onMounted(() => {
  getVideos();
})

</script>

<template>
  <div class="video-courses pa-5 bg-white pa-5 rounded-lg w-100">
    <div class="d-flex mb-5 align-center justify-space-between">
      <div class="title block-title--20">
        {{ $t('qualification.VideoCourses') }}
      </div>
      <div class="swiper-btns" v-if="videos.length>0">
        <button ref="btnPrev" class="prev-btn v-theme--light">
          <img src="/img/icons/prev.svg"/>
        </button>
        <button ref="btnNext" class="next-btn v-theme--light">
          <img src="/img/icons/next.svg"/>
        </button>
      </div>
    </div>
    <v-divider :thickness="1"/>
    <template v-if="videos.length>0">
      <div class="grid mt-5" v-if="videos">
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
								fill: 'row',
							},

            '700': {
             slidesPerView: 2,
              spaceBetween:10
            },
            '960': {
              slidesPerView: 1,
              spaceBetween:40
            },
            '1200': {
              slidesPerView: 2,
              spaceBetween:15
            },
            '1800': {
              slidesPerView: 3,
              spaceBetween:20
            },
            '1920': {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }"
            class="video-courses-swiper"
        >
          <swiper-slide
              v-for="(data, index) in videos"
              :key="`video-${data.id}`"
          >
            <div class="item">
              <div class="item_header">
                <div class="video_time">
                  {{ data.duration_time }}
                </div>
                <FancyBox
                    :options="{
                    Carousel: {
                      infinite: false,
                    },
                  }"
                    @isClosed="videoClosed(data.id)"
                    @isViewed="videoViewed"
                    :view="true"
                >

                  <a
                      class="video-link"
                      data-fancybox="video"
                      :href="data.url"
                  >
                    <img
                        :src="data.thumbnail ?? '/img/our-systems/test-video.png'"
                        class="video-link__img"
                    >
                  </a>
                </FancyBox>

                <div class="item__title mt-3">
                  {{ locale == 'uz' ? data.name_uz : data.name_ru }}
                </div>
              </div>
              <div class="item_body mt-2">
                <div class="course-name">
                  {{ locale == 'uz' ? data.category_name_uz : data.category_name_ru }}
                </div>
                <div class="mt-5">
                  <Rate
                      :rate="data.rate"
                      imgClassName="kitchen-rate__img"
                      textClassName="kitchen-rate__text"/>
                </div>
                <div class="video-viewed">
                  <svg data-src="/img/icons/view.svg" class="icon"></svg>
                  <span>
                {{ data.view_count }}
              </span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="mt-5 d-flex justify-end">
        <a target="_blank" href="https://prof-ivory.vercel.app/video-courses">
          <span class="mr-2 text-blue">{{ t('qualification.ViewAll') }}</span>
          <svg data-src="/img/icons/next.svg" class="popular-courses__all-icon"></svg>
        </a>
      </div>
    </template>
    <div v-else class="w-100 mt-5 pa-4 d-flex align-center justify-center border rounded-lg">
      {{ t('qualification.There-is-no-information') }}
    </div>
  </div>
  <Dialog v-model="ratingModal" width="550px">
    <template #title>
      <div class="rating-modal__title">
        {{ t('qualification.You-have-finished-watching-this-video-course') }}.
      </div>
    </template>
    <div class="rating-modal_body">
      <div class="rating-modal__subTitle">
        {{ t('qualification.How-useful-was-it-for-you') }}?
      </div>
      <div class="video_add_rate mt-4">
        <SaveRate :rate="videoRate" @rateChange="changeRate"/>

        <div class="d-flex align-center justify-center mt-5">
          <button class="v-btn--primary px-16 py-5 rounded-xl" @click="saveRateHandler">
            <span class="text-white block-title--20 text-h5">
              {{ t('qualification.Estimate') }}
            </span>
          </button>
        </div>
        <div class="d-flex text-blue-grey align-center justify-center block-title--20 mt-8 text-h5 pb-8">
          {{ t('qualification.THANK-YOU-FOR-WATCHING') }}!
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
.video-courses {

  .grid {
    padding: 20px 0;


    .swiper {
      padding-bottom: 5px;


      .swiper-wrapper {
        padding-right: 500px !important;

        .item {
          width: 99%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          padding-bottom: 15px;
          border-radius: 10px;
          border: 0.5px solid #E2E2E2;
          background: #FFF;
          box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.05);

          &_header {
            position: relative;

            .video_time {
              top: 10px;
              left: 8px;
              position: absolute;
              z-index: 10;
              color: #FFF;
              font-size: 18px;
              font-weight: 400;
            }

            .item__title {
              font-size: 18px;
              color: #373B55;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              -o-text-overflow: ellipsis;
              text-overflow: ellipsis;
              overflow: hidden;
              min-height: 54px;
              font-weight: 600;
            }
          }

          &_body {
            .course-name {
              font-size: 16px;
              font-weight: 400;
              color: #718193;
            }

            .video-viewed {
              margin-top: 10px;
              display: flex;
              align-items: center;
              gap: 10px;

              .icon {
                width: 17px;
                height: 13px;

                path {
                  stroke: #C0C0C0;
                }
              }

              span {
                font-size: 14px;
                margin-bottom: -5px;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}

.prev-btn, .next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F1F5F9;
  width: 40px;
  height: 40px;
}

.swiper-btns {
  display: flex;
  align-items: center;
  gap: 10px;

  .swiper-button-disabled {
    opacity: 0.5;
  }
}

.video-link {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.6s ease-in-out;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    //width: 240px;
    min-height: 200px;
  }

  &::before {
    position: absolute;
    content: '';
    z-index: 10;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    background-color: rgba(244, 244, 244, 0.5);
    background-image: url('/img/icons/video_play.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
  }

  &:hover {
    &::before {
      transform: scale(1.1);
    }
  }
}

.rating-modal__title {
  padding-top: 40px;
  text-align: center;
  margin: 0 auto;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-modal__subTitle {
  color: #07274bcc;
  text-align: center;
  font-size: 22px;
  font-weight: 400;
  width: 75%;
  margin: 0 auto;
  margin-top: 20px;
}

</style>