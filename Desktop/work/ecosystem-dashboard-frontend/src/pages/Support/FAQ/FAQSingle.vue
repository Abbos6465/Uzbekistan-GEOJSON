<script setup lang="ts">

</script>

<template>
  <!--      FAQ       -->
  <div class="bg-white rounded-lg pa-5 d-flex flex-column">
    <h2 class="block-title--20 mb-4">{{ $t('support.FAQ') }}</h2>

    <v-expansion-panels>
      <v-expansion-panel class="faq__accordion">
        <v-expansion-panel-title>
          {{ $t('support.Where-can-I-see-service-requests-sent-through-the-system') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ $t('support.You-can-view-requests-for-services-sent-from-the-system-in-your-personal-account-through-the-my-requests-section') }}
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq__accordion">
        <v-expansion-panel-title>
          {{ $t('support.Where-can-I-see-service-requests-sent-through-the-system') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ $t('support.You-can-view-requests-for-services-sent-from-the-system-in-your-personal-account-through-the-my-requests-section') }}
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq__accordion">
        <v-expansion-panel-title>
          {{ $t('support.Where-can-I-see-service-requests-sent-through-the-system') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ $t('support.You-can-view-requests-for-services-sent-from-the-system-in-your-personal-account-through-the-my-requests-section') }}
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq__accordion">
        <v-expansion-panel-title>
          {{ $t('support.Where-can-I-see-service-requests-sent-through-the-system') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ $t('support.You-can-view-requests-for-services-sent-from-the-system-in-your-personal-account-through-the-my-requests-section') }}
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq__accordion">
        <v-expansion-panel-title>
          {{ $t('support.Where-can-I-see-service-requests-sent-through-the-system') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ $t('support.You-can-view-requests-for-services-sent-from-the-system-in-your-personal-account-through-the-my-requests-section') }}
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>
  </div>
</template>

<style lang="scss">
.faq__accordion {
  border-radius: 10px!important;

  &:after {
    display: none;
  }

  &.v-expansion-panel {
    background: unset!important;

    .v-expansion-panel-text__wrapper {
      font-size: 14px;
      color: $black-color;
      border-radius: 0 0 10px 10px;
    }
  }

  .v-expansion-panel {

    &__shadow {
      box-shadow: 0 4px 9px rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }

    &-title {
      border-radius: 10px;

      &__overlay {
        border-radius: 10px;
      }

      &--active {
        .v-expansion-panel-title__overlay {
          background-color: white;
        }
      }
    }

    &-text {
      &__wrapper {
        padding: 20px;
        background: #F1F5F9;
      }
    }
  }

  & + & {
    margin-top: 15px;
  }
}
</style>