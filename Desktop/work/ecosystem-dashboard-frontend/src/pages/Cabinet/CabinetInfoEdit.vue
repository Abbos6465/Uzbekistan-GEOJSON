<script setup lang="ts">
import { ref } from "vue";
import { AppInput } from "@/components/UI";

const data = ref({
  phoneNumber: '',
  email: '',
  address: '',
})

</script>

<template>
  <v-row>
    <v-col md="12">
      <div class="bg-white rounded-lg pa-5">
        <h2 class="personal-info-edit__title">
          {{ $t('cabinet.EditPersonalData') }}
        </h2>

        <v-divider class="mt-5 mb-8"/>

        <AppInput
            v-model="data.phoneNumber"
            class="mb-8"
        >
          <template #label>
            {{  $t('common.phoneNumber') }}
          </template>
        </AppInput>

        <AppInput
            v-model="data.email"
            class="mb-8"
        >
          <template #label>
            {{ $t('common.email') }}
          </template>
        </AppInput>

        <AppInput
            v-model="data.address"
            class="mb-8"
        >
          <template #label>
            {{ $t('cabinet.PlaceResidence') }}
          </template>
        </AppInput>

        <v-btn
            color="#2988F5"
            class="d-flex text-white ml-auto no-uppercase text-subtitle-1 rounded-lg"
            height="46px"
            min-width="118px"
        >
          {{ $t('cabinet.save') }}
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.personal-info-edit__title {
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #373B55;
}
</style>