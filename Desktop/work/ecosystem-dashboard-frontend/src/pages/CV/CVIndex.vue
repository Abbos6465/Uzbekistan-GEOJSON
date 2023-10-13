<script setup lang="ts">
import { onMounted, ref } from "vue";
import {EmptyCV, CVCard} from "./components";
import { Resume } from "@/components/Composite";
import CVApi from "@/pages/CV/api";
import useLoading from "@/composables/useLoading";
import { useCVStore } from "@/pages/CV/store";
import { useCommonStore } from "@/store/Common";
import {setFixedPosition} from "@/utils/helper";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';
import useToast from "@/components/UI/AppToast/useToast";
import Dialog from "@/components/UI/Dialog.vue";

const CVStore = useCVStore();
const CommonStore = useCommonStore();
const {toast} = useToast();
const {changeIsRequestLoading, isRequestLoading} = useLoading();

const isConfirmationDialogOpen = ref(false);
const deletingCVID = ref<number | null>(null);

function openConfirmationDialog(id: number) {
  deletingCVID.value = id;
  isConfirmationDialogOpen.value = true;
}

async function deleteCV() {
  if(!deletingCVID.value) return;

  changeIsRequestLoading('deleteCV', true);
  await CVApi
      .deleteCVApi(deletingCVID.value)
      .then(({data}) => {
        if(data.result.success) {
          CVStore.getCVsList();
          toast.success('CV успешно удалено!');
          return Promise.resolve();
        }
      })
      .finally(() => {
        changeIsRequestLoading('deleteCV', false);
        isConfirmationDialogOpen.value = false;
      })
}

async function makeMain(id: number) {
  await CVApi
      .changeCVStatusApi('' + id)
      .then(() => {
        CVStore.cvList.forEach(item => {
          item.active = item.id === id;

          return item;
        })
      })
      .catch(() => {
        CVStore.cvList.forEach(cv => {
          if(cv.id === id) cv.active = false;
        })
      });
}

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
    setFixedPosition('resumes-section', 60)
  })
})

</script>

<template>
  <div>
    <v-row>
      <v-col md="6">
        <div id="resumes-section" class="bg-white rounded-lg pa-5">
          <div
              class="d-flex align-center mb-4"
              style="height: 46px"
          >
            <h2 class="block-title--20 mr-2">{{ $t('cv.your-cv') }}</h2>

            <v-btn
                v-if="CVStore.cvList.length"
                height="46px"
                elevation="0"
                class="v-btn--primary rounded-lg no-uppercase ml-auto"
                :to="{name: 'CV Create'}"
            >
              <v-icon
                  icon="mdi-plus"
                  color="#fff"
                  size="26px"
                  class="mr-2"
              />

              {{ $t('cv.create-resume') }}
            </v-btn>
          </div>

          <v-skeleton-loader
              v-if="isRequestLoading('getCVsList')"
              type="article"
              style="height: 146px; margin: 0 -16px -16px"
          />

          <div
              v-else-if="CVStore.cvList.length"
              class="d-flex flex-column"
          >
            <CVCard
                v-for="(card, index) in CVStore.cvList"
                :data="card"
                :key="index"
                @change="makeMain"
                @delete="openConfirmationDialog"
                @click="CVStore.selectCV(card.id)"
            />
          </div>

          <EmptyCV v-else />
        </div>
      </v-col>
      <v-col md="6">
        <Resume />
      </v-col>
    </v-row>

    <Dialog
        v-model="isConfirmationDialogOpen"
        width="520px"
        hide-close-icon
    >
      <svg
          data-src="/img/icons/trash.svg"
          class="mx-auto d-flex mb-6"
      />

      <h3 class="mb-5 text-center">
        Вы действительно хотите удалить свое резюме?
      </h3>

      <p class="text-center mb-5">При удалении резюме все данные будут удалены</p>

      <div class="d-flex">
        <v-btn
            variant="outlined"
            height="47px"
            class="v-btn--gray rounded-lg mr-2"
            style="width: calc(50% - 8px)"
            @click="isConfirmationDialogOpen = false"
        >
          Отмена
        </v-btn>

        <v-btn
            height="47px"
            elevation="0"
            color="#2988F5"
            class="rounded-lg text-white ml-2"
            style="width: calc(50% - 8px)"
            :loading="isRequestLoading('deleteCV')"
            @click="deleteCV"
        >
          Удалить
        </v-btn>
      </div>

    </Dialog>
  </div>
</template>