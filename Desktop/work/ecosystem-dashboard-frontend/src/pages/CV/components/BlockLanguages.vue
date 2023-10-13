<script
    setup
    lang="ts"
>
import { AppSelect } from "@/components/UI";
import { computed, inject, reactive, ref, watch, type WritableComputedRef } from "vue";
import type { LanguageLevelType, LanguageType } from "@/pages/CV/types";

type PropsType = {
  native: number | null
  extra: ExtraLangType[]
  items: LanguageType[]
  levels: LanguageLevelType[]
}

type ExtraLangType = {
  "language_id": number | null,
  "level_id": number | null
}

type ModifiedExtraLangType = {
  lang: {
    id: number | null,
    name: string,
  }
  level: {
    id: number | null
    name: string
  }
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:native', 'update:extra']);
const v$ = inject('v$');

const extraLangs = ref<ModifiedExtraLangType[]>([]);

const computedNativeLang: WritableComputedRef<LanguageType | null> = computed({
  get(): any {
    if(!props.native) return null;

    const foundLang: LanguageType | undefined = props.items.find(i => +i.id === +props.native!);
    return foundLang ?? null;
  },
  set(newValue: LanguageType): void {
    if(!newValue) return;
    emit('update:native', newValue.id)
  }
})

const computedLangsList = computed(() => {
  const selectedAlready = [computedNativeLang.value?.id];
  extraLangs.value.forEach(item => selectedAlready.push(item.lang.id!));

  return props.items.filter(item => !selectedAlready.includes(item.id));
})

const isExtraLangFieldsFilled = computed(() => {
  let isFilled = true;

  if(extraLangs.value.length) {
    extraLangs.value.some(item => {
      if(!item.lang?.id || !item.level?.id) isFilled = false;
    })
  }

  return isFilled;
})

function addExtraFields() {
  if(!computedNativeLang.value || !isExtraLangFieldsFilled.value) return;

  const newLang = {
    lang: {
      id: null,
      name: ''
    },
    level: {
      id: null,
      name: ''
    }
  };
  extraLangs.value.push(newLang)
}

function removeExtraLang(index: number) {
  extraLangs.value.splice(index, 1)
}

const unWatch = watch(() => props.extra, (newValue) => {
  extraLangs.value = newValue.map(item => {
    return {
      lang: item.language_id ? props.items.find(l => +l.id === +item.language_id!) : null,
      level: item.level_id ? props.levels.find(l => +l.id === +item.level_id!) : null
    }
  });

  unWatch();

  watch(extraLangs, (newValue) => {
    const modifiedLangs  = newValue.map(item => {
      return {
        language_id: item.lang.id,
        level_id: item.level.id
      }
    })
    emit('update:extra', modifiedLangs);
  }, {deep: true})
}, {deep: true});

</script>

<template>
  <div class="bg-white rounded-lg pa-5">
    <h2 class="block-title--bordered block-title--20 mb-8">{{ $t('cv.languageSkills') }}</h2>

    <AppSelect
        v-model="computedNativeLang"
        :items="computedLangsList"
        item-value="id"
        item-title="name"
        :label="$t('nativeLang')"
        :has-error="v$.errors.value.native_language_id?.message"
        return-object
        class="mb-8"
    />

    <div v-if="extraLangs.length">
      <div class="block-title--16 mb-3">{{ $t('cv.foreignLanguages') }}</div>

      <div
          v-for="(item, index) in extraLangs"
          :key="index"
          class="d-flex mb-5"
      >
        <AppSelect
            v-model="item.lang"
            :items="computedLangsList"
            item-value="id"
            item-title="name"
            placeholder="Выберите язык"
            return-object
            class="w-50 mr-2"
        />

        <AppSelect
            v-model="item.level"
            :items="levels"
            item-value="id"
            item-title="name"
            :placeholder="$t('cv.ChooseLevel')"
            return-object
            class="w-50 ml-2"
        />

        <v-btn
            width="46px"
            height="46px"
            icon
            elevation="0"
            variant="outlined"
            class="v-btn--gray rounded-lg pa-0 ml-2"
            @click="removeExtraLang(index)"
        >
          <svg
              data-src="/img/icons/close.svg"
              color="#CB1520"
          />
        </v-btn>

      </div>
    </div>

    <v-btn
        v-if="computedLangsList.length"
        class="v-btn--soft-blue no-uppercase rounded-lg"
        height="46px"
        elevation="0"
        :disabled="!computedNativeLang || !isExtraLangFieldsFilled"
        @click="addExtraFields"
    >
      <v-icon
          icon="mdi-plus"
          class="mr-2"
          size="25px"
      />
      {{ $t('cv.addForeignLanguages') }}
    </v-btn>
  </div>
</template>