<script
    setup
    lang="ts"
>
import { onMounted, ref } from "vue";
import CVForm from "@/pages/CV/components/CVForm.vue";
import type { NewCVType } from "@/pages/CV/types";
import CVApi from "@/pages/CV/api";
import { useRoute } from "vue-router";
import useBreadCrumbs from "@/components/UI/BreadCrumbs/useBreadCrumbs";
import useToast from "@/components/UI/AppToast/useToast";
import axiosInstance from "@/api/axiosInstance";
import useLoading from "@/composables/useLoading";

const route = useRoute();
const {toast} = useToast();
const {changeIsRequestLoading} = useLoading();
const { initBreadCrumbs } = useBreadCrumbs();

const data = ref<NewCVType>({
  salary: '',
  email: '',
  address: '',
  work_type_id: '',
  avatar: '',
  about: '',
  position_name: '',
  social_medias: [],
  driving_experience: [],
  education_histories: [],
  hobbies: [],
  languages: [],
  native_language_id: null,
  personal_qualities: [],
  work_histories: [],
  has_car: false
});
const loadedAvatar = ref<string | null>(null);

async function getCV() {
  changeIsRequestLoading('getCV', true);
  const response = await CVApi
      .getCVApi('' + route.params.id)
      .finally(() => {
        changeIsRequestLoading('getCV', false);
      });
  data.value = {
    ...data.value,
    ...response
  };

  loadedAvatar.value = data.value.avatar;
  delete data.value.avatar;

  // changeIsRequestLoading('uploadImage', true);
  // loadedAvatar.value = await getImg(data.value.avatar)
  //     .finally(() => {
  //       delete data.value.avatar;
  //       changeIsRequestLoading('uploadImage', false);
  //     });
}

async function getImg(url: string): Promise<string> {
  const { data } = await axiosInstance.get(url);
  return data;
}

async function updateCV(form: NewCVType) {
  return await CVApi
      .updateCVApi(form.id!, form)
      .then(({data}) => {
        if(data.result.success) {
          toast.success('cv.CVSuccessfullyUpdated');
          return Promise.resolve();
        }
      })
}

onMounted(() => {
  getCV()
      .then(() => {
        initBreadCrumbs([
          ...route.meta.breadCrumbs,
          { title: data.value.position_name }
        ])
      })
})
</script>

<template>
  <CVForm
      :form="data"
      :submit="updateCV"
      :avatar="loadedAvatar"
  />
</template>