<script setup lang="ts">
import { computed, type Ref, ref } from "vue";
import { Dialog, Chip } from "@/components/UI";
import type { HobbyType } from "@/pages/CV/types";
import AppImg from "@/components/UI/AppImg.vue";

type PropsType = {
  modelValue: number[] | string[]
  items: HobbyType[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    if(!props.modelValue.length) return [];
    const items: any[] = [];

    props.items.forEach(item => items.push(...item.children))

    return props.modelValue.map(active => {
      return items.find(item => +item.id === +active)
    })
  },
  set(newValue) {
    const modifiedValue = newValue.map(i => {
      if(typeof i === 'object') {
        i = i.id
      }

      return i;
    })
    emit('update:modelValue', modifiedValue);
  }
})

const selectedInterests: Ref<number[]> = ref([]);
const isInterestsDialogOpen = ref(false);

function removeActiveInterest(id: number) {
  computedModelValue.value = computedModelValue.value.filter(item => {
    if(typeof item === 'object') return +item.id !== id;

    return +item !== +id
  });
}

function openInterestsDialog() {
  selectedInterests.value = JSON
      .parse(JSON.stringify(computedModelValue.value))
      .map(i => {
        if(typeof i === 'object') i = i.id;

        return i;
      });

  isInterestsDialogOpen.value = true;
}

function toggleInterest(id: number) {
  if(selectedInterests.value.includes(id)) {
    const idIndex = selectedInterests.value.findIndex(item => item === id);
    selectedInterests.value.splice(idIndex, 1);
  }
  else {
    selectedInterests.value.push(id);
  }
}

function submitInterests() {
  computedModelValue.value = JSON.parse(JSON.stringify(selectedInterests.value));
  isInterestsDialogOpen.value = false;
}
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--bordered block-title--20 mb-8">{{ $t('cv.interest') }}</h2>

    <h4 class="block-subtitle--18 mb-8">
      {{ $t('cv.you-can-make-your-resume-more-colorful-by-adding-your-interests') }}
    </h4>

    <div
        v-if="computedModelValue.length"
        class="d-flex flex-wrap mb-5"
    >
      <template
          v-for="(item, itemIndex) in computedModelValue"
          :key="itemIndex"
      >
        <Chip
            v-if="item"
            :title="item.name"
            removable
            @remove="removeActiveInterest(item.id)"
        >
          <template #icon>
            <img
                :src="item.img_path"
                alt=""
            />
          </template>
        </Chip>
      </template>
    </div>

    <v-btn
        class="v-btn--soft-blue no-uppercase rounded-lg"
        height="46px"
        elevation="0"
        @click="openInterestsDialog"
    >
      <v-icon
          icon="mdi-plus"
          class="mr-2"
          size="25px"
      />
      {{ $t('cv.addInterest') }}
    </v-btn>

    <teleport to="body">
      <Dialog
          v-model="isInterestsDialogOpen"
          width="750px"
      >
        <template #header>
          <h3 class="block-title--20 mx-auto mb-5 px-10">{{ $t('cv.interest') }}</h3>
          <h4 class="block-title--16 mx-auto mb-7 px-10">{{ $t('cv.you-can-make-your-resume-more-colorful-by-adding-your-interests') }}</h4>
        </template>

        <div
            style="border-radius: 10px; border: 1px solid #E8EEF3; max-height: 420px;padding: 10px"
            class="overflow-x-auto"
        >
          <div
              v-for="(interest, index) in items"
              :key="index"
              class="interests-block__category"
          >
            <h2 class="block-title--16 mb-4">{{ interest.name }}</h2>

            <v-chip
                v-for="(item, itemIndex) in interest.children"
                :key="itemIndex"
                variant="outlined"
                :class="[
                    'interests-block__chip',
                    'chip--gray',
                      {'chip--active': selectedInterests.includes(item.id)}
                    ]"
                @click="toggleInterest(item.id)"
            >
              <img
                  v-if="item.img_path"
                  :src="item.img_path"
                  alt=""
                  style="margin-right: 10px; width: 30px; height: 30px;"
              />
              {{ item?.name }}
            </v-chip>
          </div>
        </div>

        <div class="d-flex mt-7">
          <v-btn
              height="47px"
              variant="outlined"
              class="v-btn--gray no-uppercase rounded-lg flex-grow-1 mr-3"
              @click="isInterestsDialogOpen = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>

          <v-btn
              height="47px"
              elevation="0"
              class="v-btn--primary no-uppercase rounded-lg flex-grow-1 ml-3"
              @click="submitInterests"
          >
            {{ $t('common.ready') }}
          </v-btn>
        </div>
      </Dialog>
    </teleport>
  </div>
</template>

<style lang="scss">
.interests-block {
  &__category {
    & + & {
      margin-top: 15px;
    }
  }

  &__chip {
    height: 40px!important;
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
</style>