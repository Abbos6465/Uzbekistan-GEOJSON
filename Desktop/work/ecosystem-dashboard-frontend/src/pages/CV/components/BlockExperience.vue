<script
    setup
    lang="ts"
>
import { computed, ref, watch } from "vue";
import type { OrganizationDataType } from "@/pages/CV/types";
import { ExperienceCard, ExperienceFormDialog } from "./index";
import { AppInput, AppSelect, DatePicker, Switcher } from "@/components/UI";
import { useCVStore } from "@/pages/CV/store";
import { useI18n } from "vue-i18n";

type PropsType = {
  modelValue: OrganizationDataType[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const CVStore = useCVStore();
const { t } = useI18n();

const isExperienceFormDialogOpen = ref(false);
const formForDialog = ref<OrganizationDataType>({
  company_name: '',
  company_tin: null,
  position: '',
  date_start: '',
  date_stop: '',
  work_type_id: '',
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
  const clonedExperiences: OrganizationDataType[] = JSON.parse(JSON.stringify(computedModelValue.value));
  return clonedExperiences.map(item => {
    item.details = [
        item.position,
        `${item.date_start} - ${item.date_stop === null ? t('common.UntilNow') : item.date_stop}`,
        CVStore?.workTypes?.find((f) => f.id == item.work_type_id)?.name
    ];

    return item;
  })
})

function addExperience(form: OrganizationDataType) {
  form.work_type_id = '' + form.work_type_id;
  if(form.date_start) form.date_start = '' + form.date_start;
  if(form.date_stop) form.date_stop = '' + form.date_stop;

  const formForExperience = JSON.parse(JSON.stringify(form));
  delete formForExperience.until;
  computedModelValue.value.push(formForExperience)
}

function deleteExperience(index: number) {
  computedModelValue.value.splice(index, 1)
}

function updateExperience(form: OrganizationDataType) {
  if(openedExperienceIndex.value === null) return;

  form.work_type_id = '' + form.work_type_id;
  if(form.date_start) form.date_start = '' + form.date_start;
  if(form.date_stop) form.date_stop = '' + form.date_stop;

  computedModelValue.value[openedExperienceIndex.value] = form;
}

function resetFormData() {
  formForDialog.value = {
    company_name: '',
    company_tin: null,
    position: '',
    date_start: '',
    date_stop: '',
    work_type_id: '',
    until: false
  }
}

function openEditorDialog(index: number) {
  const foundItem = computedModelValue.value[index];
  openedExperienceIndex.value = index;

  if(!foundItem) return;

  formForDialog.value = JSON.parse(JSON.stringify(foundItem));
  if(formForDialog.value.date_stop === null) formForDialog.value.until = true;
  isExperienceFormDialogOpen.value = true;
}

function onDialogSubmit(form: OrganizationDataType) {
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
    <h2 class="block-title--bordered block-title--20 mb-8">{{ $t('common.experience') }}</h2>

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
      {{ $t('cv.Enter-organizations-you-have-worked-for-previously') }}
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
      {{ $t('cv.Add-work-experience') }}
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
          {{ formForDialog.id ? $t('cv.edit-work-experience') : $t('cv.Add-work-experience') }}
        </template>

        <template #content="{form, until}">
          <v-col md="4">
            <AppInput
                v-model="form.company_name"
                :label="$t('main.Organization')"
                :placeholder="$t('cv.nameOrganization')"
                class="mt-5"
                required
            />
          </v-col>
          <v-col md="4">
            <AppSelect
                v-model="form.work_type_id"
                :items="CVStore.workTypes"
                item-title="name"
                :label="$t('common.jobType')"
                :placeholder="$t('common.jobType')"
                class="mt-5"
                required
            />
          </v-col>
          <v-col md="4">
            <AppInput
                v-model="form.position"
                :label="$t('common.jobTitle')"
                :placeholder="$t('common.jobTitle')"
                class="mt-5"
                required
            />
          </v-col>

          <v-col md="4">
            <DatePicker
                v-model="form.date_start"
                :label="$t('cv.startDate')"
                :placeholder="$t('common.enterDate')"
                format="yyyy-MM-dd"
                class="mt-5"
                required
                teleport
            />
          </v-col>
          <v-col md="4">
            <DatePicker
                v-model="form.date_stop"
                :disabled="form.until"
                :label="$t('cv.startDate')"
                :placeholder="$t('common.enterDate')"
                format="yyyy-MM-dd"
                class="mt-5"
                required
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

<style lang="scss">

</style>