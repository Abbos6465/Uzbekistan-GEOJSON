<script
    setup
    lang="ts"
>
import { Dialog } from "@/components/UI";
import { computed } from "vue";
import useLoading from "@/composables/useLoading";
import { useAuthStore } from "@/store/Auth";
import { useCommonStore } from "@/store/Common";
import { useI18n } from "vue-i18n";
import commonApi from "@/api/commonApi";
import { createThenClickDownloadLink } from "@/utils/helper";

type PropsType = {
  modelValue: boolean
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {changeIsRequestLoading, isRequestLoading} = useLoading();
const {locale} = useI18n();

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

async function downloadReference() {
  changeIsRequestLoading('downloadReference', true);
  return await commonApi
      .getReferenceDownloadApi()
      .then((data) => {
        if (!data) return;

        createThenClickDownloadLink(`Reference ${ AuthStore.fullName }`, data);
        return Promise.resolve();
      })
      .finally(() => {
        changeIsRequestLoading('downloadReference', false);
        computedModelValue.value = false;
      });
}
</script>

<template>
  <Dialog
      v-model="computedModelValue"
      width="750px"
  >
    <template #title>Reference</template>

    <template #default>
      <div class="pt-4">
        <div class="d-flex">
          <h4 class="block-title--16 soft-black mr-1">
            {{ $t("main.fullname") }}:
          </h4>
          <p class="block-title--16 mr-1">{{ AuthStore.fullName }}</p>
        </div>

        <div class="mt-2 d-flex">
          <h4 class="block-title--16 soft-black mr-1">JShShIR:</h4>
          <p class="block-title--16">{{ AuthStore.authInfo?.person_pin }}</p>
        </div>

        <div class="mt-2 d-flex">
          <h4 class="block-title--16 soft-black mr-1">Passport:</h4>
          <p class="block-title--16">{{ AuthStore.authInfo?.person_passport }}</p>
        </div>

        <div class="mt-2 d-flex">
          <h4 class="block-title--16 soft-black mr-1">Korxona INNsi:</h4>
          <p class="block-title--16">{{ CommonStore.computedActiveJob?.company_tin }}</p>
        </div>

        <h3 class="reference__title">Ma'lumotnoma</h3>

        <article class="reference__text">
          <strong>{{ CommonStore.computedActiveJob?.company_name }}</strong>da
          <strong>{{
              locale === 'ru' ? CommonStore.computedActiveJob?.position[0].position_name_ru : CommonStore.computedActiveJob?.position[0].position_name
            }}</strong>
          lavozimida bugungi kunga qadar mehnat faoliyatini olib
          borayotgani ma’lumot qilinadi.
        </article>

        <v-btn
            height="46px"
            elevation="0"
            color="#2988F5"
            class="text-white rounded-lg no-uppercase w-100 mt-6"
            style="font-size: 16px"
            :loading="isRequestLoading('downloadReference')"
            @click="downloadReference"
        >
          {{ $t("main.download") }}

          <svg
              data-src="/img/icons/download.svg"
              color="#fff"
              class="ml-3"
          />
        </v-btn>
      </div>
    </template>
  </Dialog>
</template>