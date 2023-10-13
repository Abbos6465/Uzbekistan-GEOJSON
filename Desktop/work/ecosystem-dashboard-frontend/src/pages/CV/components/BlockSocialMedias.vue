<script
    setup
    lang="ts"
>
import { AppInput, AppSelect } from "@/components/UI";
import { computed, ref } from "vue";
import type { SocialMediaType } from "@/pages/CV/types";

type NewSocialMediaType = {
  link: string
  social_media_id: number | null
}

type PropsType = {
  modelValue: NewSocialMediaType[]
  items: SocialMediaType[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

const computedItemsList = computed(() => {
  if(!props.items.length) return [];

  return props.items.filter(item => {
    const foundItem = props.modelValue.find(i => +i.social_media_id! === +item.id);

    if(!foundItem) return item;
  })
})

const newSocialMedia = ref<NewSocialMediaType>({
  link: '',
  social_media_id: null
});

function addSocialMedia() {
  if(!newSocialMedia.value.social_media_id || !newSocialMedia.value.link) return;

  computedModelValue.value.push(newSocialMedia.value);
  newSocialMedia.value = {
    link: '',
    social_media_id: null
  }
}

function removeSocialMedia(index: number) {
  computedModelValue.value.splice(index, 1);
}
</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--bordered block-title--20">{{ $t('cv.socialMedia') }}</h2>

    <v-row class="pt-5">
      <v-col
          v-for="(item, index) in computedModelValue"
          :key="index"
          md="6"
      >
        <div class="d-flex align-end w-100">
          <AppInput
              v-model="item.link"
              :label="items.find(i => i.id === item.social_media_id)?.name"
              :placeholder="$t('cv.instagram')"
              class="flex-grow-1"
          />
          <v-btn
              icon
              elevation="0"
              height="46px"
              variant="outlined"
              class="rounded-lg v-btn--gray ml-2"
              @click="removeSocialMedia(index)"
          >
            <svg
                data-src="/img/icons/trash-can.svg"
                color="#CB1520"
            />
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <template v-if="computedItemsList.length">
      <v-divider
          v-if="computedModelValue.length"
          class="mt-10 mb-5"
      />

      <v-row>
        <v-col md="6">
          <app-select
              v-model="newSocialMedia.social_media_id"
              :items="computedItemsList"
              :label="$t('cv.socialNetwork')"
              item-title="name"
              item-value="id"
              class="flex-grow-1"
          />
        </v-col>
        <v-col md="6">
          <app-input
              v-model="newSocialMedia.link"
              :label="$t('cv.link')"
          />
        </v-col>
        <v-col md="12">
          <v-btn
              height="46px"
              elevation="0"
              class="v-btn--soft-blue rounded-lg ml-auto d-flex"
              @click="addSocialMedia"
          >
            {{ $t('common.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>