<script
    setup
    lang="ts"
>
import type { VacanciesType } from "@/types";
import { format } from "date-fns";
import {useI18n} from "vue-i18n";
import ViewIcon from "@/pages/Main/components/icons/ViewIcon.vue";
import CalendarIcon from "@/pages/Main/components/icons/CalendarIcon.vue";
import TouchIcon from "@/pages/Main/components/icons/TouchIcon.vue";

type PropsType = {
  data: VacanciesType[]
}

defineProps<PropsType>();

const {t, locale} = useI18n();

</script>

<template>
  <div class="suitable-vacancies">
    <div class="suitable-vacancies__header">
      <a
          href="https://ish.mehnat.uz/"
          class="link link--blue"
      >
        {{ t('main.viewAllVacancies') }}

        <v-icon
            icon="mdi-chevron-right"
            color="#2988F5"
        />
      </a>
    </div>

    <div
        :class="{'hasScroll--y': data.length > 2}"
    >
      <div class="d-flex flex-column" style="max-height: 480px">
        <div
            v-for="(item, index) in data"
            :key="index"
            class="suitable-vacancy"
        >
          <div class="d-flex align-start">
            <div class="d-flex flex-column">
              <h2 class="block-title--16 mb-2">{{ locale === 'ru' ? item.position_name_ru : item.position_name }}</h2>
              <h4
                  v-if="item.position_salary && !item.hide_salary"
                  class="suitable-vacancy__salary"
              >
                {{ $t('common.start') }} {{ item.position_salary }} {{ $t('main.sum') }}
              </h4>
            </div>

            <div class="d-flex align-center ml-auto pl-4">
              <div
                  v-if="item.views"
                  class="block-title--14 d-flex align-center"
              >
                <view-icon />
                <span style="margin-bottom: -3px; margin-left: 5px">{{ item.views }}</span>
              </div>
              <div class="block-title--14 d-flex align-center ml-5">
                <calendar-icon />
                <span style="margin-bottom: -3px; margin-left: 5px">{{ format(new Date(item.created_at), 'dd.MM.yyyy') }}</span>
              </div>
            </div>
          </div>

          <h5 class="block-title--14">{{ item.position_duties }}</h5>

          <v-divider
              color="#E2E2E2"
              style="opacity: 1"
              class="my-2"
          />

          <div class="d-flex">
<!--            <div class="d-flex flex-column">-->
<!--              <span class="block-title&#45;&#45;14">Всего:</span>-->
<!--              <span class="block-title&#45;&#45;14" style="color: #373B55; font-weight: 500">{{ item.company_oked }} откликов</span>-->
<!--            </div>-->

            <v-btn
                height="46px"
                elevation="0"
                class="v-btn--soft-blue rounded-lg ml-auto no-uppercase"
                tag="a"
                target="_blank"
                :href="`https://ish.mehnat.uz/vacancies/${item.id}`"
            >
              <touch-icon />

              {{ t('main.willRespons') }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.suitable-vacancies {
  &__header {
    display: flex;
    justify-content: flex-end;
    padding: 15px 10px;
    border-radius: 0 10px 0 0;
    margin-bottom: 20px;
  }
}

.suitable-vacancy {
  background: #F5F7FB;
  padding: 10px;
  border-radius: 10px;

  & + & {
    margin-top: 20px;
  }

  &__salary {
    color: $blue-color;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 8px;
  }
}
</style>