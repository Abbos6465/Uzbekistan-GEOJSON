<script setup lang="ts">
import { reactive } from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const questionsCategory = reactive([
  {
    id: 1,
    title: t('support.How-to-verify-an-account-through-a-bank'),
    desc: t('support.Ways-to-verify-your-account-online-and-offline')
  },
  {
    id: 2,
    title: t('support.How-to-recover-your-password'),
    desc: t('support.Password-recovery-instructions-for-different-account-levels')
  },
  {
    id: 3,
    title: t('support.What-is-consent-to-data-processing'),
    desc: t('support.Why-consent-is-needed-who-will-have-access-to-the-data-and-how-it-is-protected')
  },
  {
    id: 4,
    title: t('support.How-to-recover-your-password'),
    desc: t('support.Ways-to-verify-your-account-online-and-offline')
  },
  {
    id: 5,
    title: t('support.How-to-verify-an-account-through-a-bank'),
    desc: t('support.Ways-to-verify-your-account-online-and-offline')
  },
  {
    id: 6,
    title: t('support.How-to-verify-an-account-through-a-bank'),
    desc: t('support.Ways-to-verify-your-account-online-and-offline')
  },
]);
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--20 mb-7">{{ $t('support.allQuestions') }}</h2>

    <v-row>
      <v-col
          v-for="(category, categoryIndex) in questionsCategory"
          :key="categoryIndex"
          md="4"
      >
        <router-link
            :to="{
              name: 'FAQSingle',
              params: {
                id: category.id
              }
            }"
            class="faq__category"
        >
          <div class="d-flex flex-column justify-center mr-4">
            <div class="faq__category__title">{{ category.title }}</div>
            <div class="faq__category__text">{{ category.desc }}</div>
          </div>

          <v-icon
              icon="mdi-chevron-right"
              color="#718193"
              class="ml-auto align-self-center"
          />
        </router-link>
      </v-col>
    </v-row>
  </div>

</template>

<style lang="scss">
.faq__category {
  display: flex;
  height: 100%;
  padding: 20px 10px 20px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.05);
  transition: transform .3s;

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: normal;
    color: $black-color;
    margin-bottom: 10px;
  }

  &__text {
    font-size: 16px;
    font-weight: 400;
    line-height: normal;
    color: $black-color;
  }

  &:hover {
    transform: translateY(-5px);
  }
}
</style>