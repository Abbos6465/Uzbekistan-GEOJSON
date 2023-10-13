<script setup lang="ts">
import { PersonalInfo } from "./components";
import {Resume} from "@/components/Composite"
import { onMounted } from "vue";
import { useCommonStore } from "@/store/Common";
import { useCVStore } from "@/pages/CV/store";
import useLoading from "@/composables/useLoading";
import { setFixedPosition } from "@/utils/helper"

const CommonStore = useCommonStore();
const CVStore = useCVStore();
const {changeIsRequestLoading} = useLoading();

onMounted(() => {
  Promise.all([
    CommonStore.getProfilePhoto(),
    CommonStore.getProfileInfo(),
    CommonStore.getCurrentJobsList(),
    CommonStore.getRelatives(),
    CommonStore.getWorkbook(),
    CommonStore.getDiplomas(),
    CommonStore.getLanguages(),
    CommonStore.getLanguageLevels(),
    CVStore.getCVsList(),
    CVStore.getWorkTypes(),
    CVStore.getPersonalQualities()
  ])

  window.addEventListener('scroll',() => {
    setFixedPosition('personal-info-section', 60)
  })
})
</script>

<template>
  <v-row>
    <v-col md="6">
      <PersonalInfo id="personal-info-section"/>
    </v-col>
    <v-col md="6">
      <Resume id="resume-section"/>
    </v-col>
  </v-row>
</template>