<template>
  <div class="empty-cv">
    <svg
        data-src="/img/icons/cv-doc.svg"
        class="empty-cv__icon"
    />

    <h4 class="empty-cv__title">{{ $t('cv.You-do-not-have-an-active-resume') }}</h4>
    <p class="empty-cv__text">{{ $t('cv.Create-your-resume-and-get-answers-to-new-vacancies') }}</p>

    <v-btn
        height="46px"
        class="rounded-lg no-uppercase v-btn--primary"
        elevation="0"
        :to="{name: 'CV Create'}"
    >
      <v-icon
          icon="mdi-plus"
          color="#fff"
          class="mr-2"
      />
      {{ $t('cv.create-resume') }}
    </v-btn>
  </div>
</template>

<style lang="scss">
.empty-cv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 68px 0;

  &__icon {
    width: 65px;
    height: 70px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    color: $soft-black;
    margin-bottom: 12px;
  }
}
</style>