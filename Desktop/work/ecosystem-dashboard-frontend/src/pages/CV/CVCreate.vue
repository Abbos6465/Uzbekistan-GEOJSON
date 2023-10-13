<script
    setup
    lang="ts"
>
import { ref } from "vue";
import useCookies from "@/composables/useCookies";
import type { NewCVType, } from "@/pages/CV/types";
import CVForm from "@/pages/CV/components/CVForm.vue";
import CVApi from "@/pages/CV/api";
import useToast from "@/components/UI/AppToast/useToast";
import {useI18n} from "vue-i18n";

enum cookiesName {
  creatingCV = 'CREATING_CV'
}

const {toast} = useToast();
const {t} = useI18n()
// useCookies(data, cookiesName.creatingCV);

async function createCV(form: NewCVType) {
  return await CVApi
      .createCVApi(form)
      .then(({data}) => {
        if(data.result.success) {
          toast.success(t('cv.CVSddedSuccessfully'));
          return Promise.resolve();
        }
      })
}

</script>

<template>
  <CVForm :submit="createCV"/>
</template>