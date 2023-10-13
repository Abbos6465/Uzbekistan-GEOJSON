<script
    setup
    lang="ts"
>
import {onMounted, ref} from "vue";
import MyCourses from "@/pages/Qualification/modules/Courses.vue";
import MyActiveCourse from "@/pages/Qualification/modules/ActiveCourse.vue";
import VideoCourses from "@/pages/Qualification/modules/VideoCourses.vue";
import PopularCourses from "@/pages/Qualification/modules/PopularCourses.vue";
import MyApplications from "@/pages/Qualification/modules/Applications.vue";
import Dialog from "@/components/UI/Dialog.vue";
import AboutDialog from "@/components/UI/AboutDialog.vue";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n();

const welcomeModal = ref(false);
const applyModal = ref(false);
const videoCoursesModal = ref(false);

function modalClose(isVideoModalOpen) {
  isVideoModalOpen.value = true;
}

function welcomeModalClose() {
  modalClose(applyModal);
}

function applyModalClose() {
  modalClose(videoCoursesModal);
}

function videoCoursesModalClose() {
  localStorage.setItem('QualificationPageOpen', "1");
}

onMounted(() => {
  if (!localStorage.getItem('QualificationPageOpen')) {
    welcomeModal.value = true;
  }
})

</script>

<template>
  <v-row class=" d-flex align-stretch">
    <v-col
        lg="7"
        xl="8"
        md="12"
    >
      <AboutDialog
          v-model="applyModal"
          aboutWidth="635px"
          @close="applyModalClose"
      >
        <MyCourses/>
        <template #about>
            {{t('qualification.Apply-for-the-course-you-need-and-do-what-you-love')}}
        </template>
      </AboutDialog>
    </v-col>
    <v-col
        lg="5"
        xl="4"
        md="5">
      <MyActiveCourse/>
    </v-col>
    <v-col
        lg="7"
        xl="8"
        md="7"
    >
      <AboutDialog
          v-model="videoCoursesModal"
          aboutWidth="635px"
          @close="videoCoursesModalClose"
      >
        <VideoCourses/>
        <template #about>
          {{t('qualification.And-also-watch-a-variety-of-video-courses-without-leaving-your-account')}}
        </template>
      </AboutDialog>
    </v-col>
    <v-col
        lg="5"
        xl="4"
        md="5"
    >
      <PopularCourses/>
    </v-col>
    <v-col
        lg="7"
        xl="8"
        md="7"
    >
      <MyApplications/>
    </v-col>
  </v-row>
  <Dialog v-model="welcomeModal" width="550px" class="welcome-modal" :outsideClose="true" @close="welcomeModalClose">
    <div class="welcome-modal__icon_wrapper">
      <svg data-src="/img/icons/edu.svg" />
    </div>
    <div class="welcome-modal__title block-title--20 text-center mt-5">
      {{t('qualification.Welcome-to-the-personal-account-of-the-professional-training-website')}}!
    </div>
    <div class="welcome-modal__text">
      {{t('qualification.Here-you-will-find-courses-in-various-fields-learn-a-new-profession-and-get-a-certificate')}}
    </div>
  </Dialog>
</template>

<style lang="scss">
.courses {
  &__tabs {
    margin-bottom: 15px;
    --v-tabs-height: 40px !important;
    z-index: 1;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: $gray-stroke;
      z-index: -1;
    }
  }

  &__tab {
    .v-tab__slider {
      color: $blue-color;
      bottom: 0 !important;
      z-index: 2;
    }

    &__counter {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px 5px 0 3px;
      min-width: 18px;
      height: 18px;
      border-radius: 98px;
      background: rgba(41, 136, 245, 0.20);
      font-size: 12px;
      font-weight: 500;
      line-height: normal;
      margin-left: 10px;
      color: $blue-color;
    }

    &--active {
      color: $blue-color;
    }
  }

  &__table__status {
    display: flex;
    padding: 6px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 5px;

    span {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    &-ended {
      background: rgba(240, 101, 72, 0.20);

      span {
        color: #F06548;
      }
    }

    &-started {
      background: rgba(69, 203, 133, 0.20);

      span {
        color: #45CB85;
      }
    }

    &-not_ended {
      background: #FFE0B2;

      span {
        color: #FB8C00;
      }
    }
  }

  &__rate {

    &__title {
      color: #373B55;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  &__current__title {
    color: #373B55;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;
  }
}

.qualification__stars {
  display: flex;
  align-items: center;
  gap: 10px;

  .rate_num {
    color: #373B55;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}

.my-course {
  padding: 20px;


  .boxes {
    display: flex;
    align-items: start;
    flex-wrap: wrap;
    margin-top: 20px;
    gap: 10px;


    .box {
      width: calc(100% / 3 - 7px);
      min-width: 210px;
      border-radius: 10px;
      border: 0.5px solid #E2E2E2;
      background-color: #FFF !important;
      box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      padding: 10px 3px;
      gap: 8px;
      justify-content: center;

      &__text {
        font-size: 14px;
        font-weight: 400;

        &-content {
          font-weight: 500;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .about {

    &-title {
      color: #373B55;
      font-size: 16px;
      font-weight: 500;
    }

    &-content {
      color: #718193;
      overflow: auto;
      max-height: 108px;
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.welcome-modal {

  &__icon_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 96px;
      height: 96px;
    }
  }

  &__text {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #373B55;
  }
}

</style>