<script
    setup
    lang="ts"
>
import { computed, reactive, watch, ref } from "vue";
import type { EducationDataType } from "@/pages/CV/types";
import { ExperienceFormDialog, ExperienceCard } from "./index";
import { AppInput, AppSelect, DatePicker, Switcher } from "@/components/UI";
import {useI18n} from "vue-i18n";

type PropsType = {
  modelValue: EducationDataType[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const {t} = useI18n()
const jobTypesList = reactive([
  {
    value: 1,
    label: t('cv.bachelor')
  },
  {
    value: 2,
    label: t('cv.master')
  },
  {
    value: 3,
    label: t('cv.Specialist')
  },
]);
const isExperienceFormDialogOpen = ref(false);
const formForDialog = ref<EducationDataType>({
  edu_type_id: '',
  education_name: '',
  faculty_name: '',
  start_year: '',
  stop_year: '',
  specialty_name: '',
  until: false
});
const openedExperienceIndex = ref<number | null>(null);

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

const computedExperiences = computed(() => {
  const clonedEducations: EducationDataType[] = JSON.parse(JSON.stringify(computedModelValue.value));
  return clonedEducations.map(item => {
    item.details = [
        `${item.start_year} - ${item.stop_year === null ? t('common.UntilNow') : item.stop_year}`,
        item.faculty_name
    ];

    return item;
  })
})

function addExperience(form: EducationDataType) {
  form.edu_type_id = '' + form.edu_type_id;
  if(form.start_year) form.start_year = '' + form.start_year;
  if(form.stop_year) form.stop_year = '' + form.stop_year;

  const formForExperience = JSON.parse(JSON.stringify(form));
  delete formForExperience.until;
  computedModelValue.value.push(formForExperience);
}

function deleteExperience(index: number) {
  computedModelValue.value.splice(index, 1)
}

function updateExperience(form: EducationDataType) {
  if(openedExperienceIndex.value === null) return;

  form.edu_type_id = '' + form.edu_type_id;
  if(form.start_year) form.start_year = '' + form.start_year;
  if(form.stop_year) form.stop_year = '' + form.stop_year;
  computedModelValue.value[openedExperienceIndex.value] = form;
}

function resetFormData() {
  formForDialog.value = {
    edu_type_id: '',
    education_name: '',
    faculty_name: '',
    start_year: '',
    stop_year: '',
    specialty_name: '',
    until: false
  }
}

function openEditorDialog(index: number) {
  const foundItem = computedModelValue.value[index];
  openedExperienceIndex.value = index;

  if(!foundItem) return;

  formForDialog.value = JSON.parse(JSON.stringify(foundItem));
  if(formForDialog.value.stop_year === null) formForDialog.value.until = true;
  isExperienceFormDialogOpen.value = true;
}

function onDialogSubmit(form: EducationDataType) {
  if (openedExperienceIndex.value !== null) {
    updateExperience(form)
  } else {
    addExperience(form)
  }
}

watch(isExperienceFormDialogOpen, (newValue) => {
  if(!newValue) {
    openedExperienceIndex.value = null;
  }
})
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--bordered block-title--20 mb-8">{{ $t('common.Education') }}</h2>

    <div
        v-if="computedModelValue.length"
        class="d-flex flex-column"
    >
      <ExperienceCard
          v-for="(experience, index) in computedExperiences"
          :key="index"
          :data="experience"
          @delete="deleteExperience(index)"
          @edit="openEditorDialog(index)"
      />
    </div>

    <h4
        v-else
        class="block-subtitle--18 mb-8"
    >
     {{ $t('cv.includeSchoolsAttended') }}
    </h4>

    <v-btn
        class="v-btn--soft-blue no-uppercase rounded-lg"
        height="46px"
        elevation="0"
        @click="isExperienceFormDialogOpen = true"
    >
      <v-icon
          icon="mdi-plus"
          class="mr-2"
          size="25px"
      />
      {{ $t('cv.addEducation') }}
    </v-btn>

    <teleport to="body">
      <ExperienceFormDialog
          v-model:is-open="isExperienceFormDialogOpen"
          :form-data="formForDialog"
          :index="openedExperienceIndex"
          @reset="resetFormData"
          @submit="onDialogSubmit"
      >
        <template #title>
          {{ formForDialog.id ? $t('cv.editEducation') : $t('cv.addEducation') }}
        </template>

        <template #content="{form}">
          <v-col md="4">
            <AppInput
                v-model="form.education_name"
                :label="$t('cv.NameEducationalInstitution')"
                :placeholder="$t('cv.enterNameEducationalInstitution')"
                class="mt-5"
                required
            />
          </v-col>
          <v-col md="4">
            <AppInput
                v-model="form.faculty_name"
                :label="$t('cv.facultyName')"
                :placeholder="$t('cv.enterFacultyName')"
                class="mt-5"
                required
            />
          </v-col>
          <v-col md="4">
            <AppInput
                v-model="form.specialty_name"
                :label="$t('cv.specialtyName')"
                :placeholder="$t('cv.enterSpecialtyName')"
                class="mt-5"
                required
            />
          </v-col>
          <v-col md="4">
            <AppSelect
                v-model="form.edu_type_id"
                :items="jobTypesList"
                :label="$t('cv.degree')"
                :placeholder="$t('cv.enterDegree')"
                class="mt-5"
                required
                item-title="label"
                item-value="value"
            />
          </v-col>

          <v-col md="4">
            <DatePicker
                v-model="form.start_year"
                :label="$t('cv.startDateStudy')"
                :placeholder="$t('common.enterDate')"
                class="mt-5"
                required
                year-picker
                teleport
            />
          </v-col>
          <v-col md="4">
            <DatePicker
                v-model="form.stop_year"
                :disabled="form.until"
                :label="$t('cv.stopDateStudy')"
                :placeholder="$t('common.enterDate')"
                class="mt-5"
                required
                year-picker
                teleport
            />

            <Switcher
                v-model="form.until"
                :label="$t('common.UntilNow')"
                class="mt-3"
            />
          </v-col>
        </template>
      </ExperienceFormDialog>
    </teleport>
  </div>
</template>