<script
    setup
    lang="ts"
>
import { AppInput, AppInputSalary, AppSelect, AppTextarea, DatePicker, ImageUploader, Switcher } from "@/components/UI";
import {
  BlockEducation,
  BlockExperience,
  BlockInterests,
  BlockLanguages,
  BlockQualities,
  BlockSocialMedias
} from "./index";
import CVApi from "@/pages/CV/api";
import CommonApi from "@/api/commonApi";
import { computed, onMounted, provide, ref, watch } from "vue";
import type {
  DrivingExperienceType, HobbyType,
  LanguageLevelType,
  LanguageType, NewCVType,
  PersonalQualityType,
  SocialMediaType
} from "@/pages/CV/types";
import { useCommonStore } from "@/store/Common";
import { useAuthStore } from "@/store/Auth";
import { useCVStore } from "@/pages/CV/store";
import useLoading from "@/composables/useLoading";
import { useRouter } from "vue-router";
import useValidate from "@/composables/useValidate";
import useToast from "@/components/UI/AppToast/useToast";

type PropsType = {
  form?: NewCVType
  submit: Function
  avatar?: string | null
}

const props = defineProps<PropsType>();

const data = ref<NewCVType>({
  first_name: '',
  middle_name: '',
  surname: '',
  phone_number: '',
  birth_date: '',
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

const CommonStore = useCommonStore();
const AuthStore = useAuthStore();
const CVStore = useCVStore();
const {toast} = useToast();
const {changeIsRequestLoading, isRequestLoading} = useLoading();
const router = useRouter();

const drivingExperience = ref<DrivingExperienceType[]>([]);
const socialMedias = ref<SocialMediaType[]>([]);
const hobbies = ref<HobbyType[]>([]);

const rules = ref({
  first_name: {
    required: true
  },
  surname: {
    required: true
  },
  middle_name: {
    required: true
  },
  birth_date: {
    required: true
  },
  phone_number: {
    required: true
  },
  salary: {
    required: true
  },
  email: {
    required: true,
    email: true
  },
  address: {
    required: true
  },
  work_type_id: {
    required: true
  },
  avatar: {
    required: true
  },
  about: {
    required: true
  },
  position_name: {
    required: true
  },
  native_language_id: {
    required: true
  }
})

const v$ = useValidate(rules, data);
provide('v$', v$);

function toggleDrivingLicense(value: string) {
  if(data.value.driving_experience.includes(value)) {
    const index = data.value.driving_experience.findIndex((key: string) => key === value);

    data.value.driving_experience.splice(index, 1);
  }
  else {
    data.value.driving_experience.push(value)
  }
}

async function getDrivingExperience() {
  drivingExperience.value = await CVApi.getDrivingExperienceApi();
}

async function getSocialMedias() {
  socialMedias.value = await CVApi.getSocialMediasApi();
}

async function getHobbies() {
  hobbies.value = await CVApi.getHobbiesApi();
}

async function uploadAvatar(formData: FormData) {
  return await CommonApi
      .uploadFileApi(formData)
      .then(({file_name}) => {
        data.value.avatar = file_name;
        return Promise.resolve();
      });
}

async function submit() {
  if(v$.validate()) {
    changeIsRequestLoading('submit', true);
    const modifiedForm: NewCVType = JSON.parse(JSON.stringify(data.value));
    modifiedForm.work_type_id = '' + modifiedForm.work_type_id;

    await props
        .submit(modifiedForm)
        .then(() => {
          router.push({
            name: 'CV'
          })
        })
        .finally(() => {
          changeIsRequestLoading('submit', false);
        });
  }
  else {
    toast.error('Проверьте все поля ещё раз!')
    window.scrollTo({top: 0});
  }
}

onMounted(() => {
  Promise.all([
    CVStore.getWorkTypes(),
    CVStore.getPersonalQualities(),
    CommonStore.getLanguages(),
    CommonStore.getLanguageLevels(),
    getDrivingExperience(),
    getSocialMedias(),
    getHobbies()
  ])
})

watch(() => props.form, (newValue) => {
  if(newValue) {
    data.value = newValue;
    data.value.work_type_id = +data.value.work_type_id;
  }
})
</script>

<template>
  <div class="cv-form">
    <v-progress-linear
        v-if="isRequestLoading('getCV')"
        indeterminate
        color="#2988F5"
    />

    <template v-else>
      <div class="bg-white rounded-lg pa-5">
        <h2 class="block-title--bordered block-title--20">{{ $t('title.personalData') }}</h2>

        <v-row>
          <!--        ИМЯ-->
          <v-col md="4">
            <AppInput
                v-model="data.first_name"
                :label="$t('common.name')"
                placeholder="Введите имя"
                class="mt-5"
                :has-error="v$.errors.value.first_name?.message"
            />
          </v-col>

          <!--        ФАМИЛИЯ-->
          <v-col md="4">
            <AppInput
                v-model="data.surname"
                :label="$t('common.surname')"
                placeholder="Введите фамилия"
                class="mt-5"
                :has-error="v$.errors.value.surname?.message"
            />
          </v-col>

          <!--        ОТЧЕСТВО-->
          <v-col md="4">
            <AppInput
                v-model="data.middle_name"
                :label="$t('common.middleName')"
                placeholder="Введите отчество"
                class="mt-5"
                :has-error="v$.errors.value.middle_name?.message"
            />
          </v-col>

          <!--        НОМЕР ТЕЛЕФОНА-->
          <v-col md="4">
            <AppInput
                v-model="data.phone_number"
                :label="$t('common.phoneNumber')"
                placeholder="+998"
                class="mt-5"
                :has-error="v$.errors.value.phone_number?.message"
            />
          </v-col>

          <!--        ДАТА РОЖДЕНИЕ-->
          <v-col md="4">
            <DatePicker
                v-model="data.birth_date"
                :label="$t('common.birthdate')"
                format="yyyy-MM-dd"
                placeholder="Выберите дату"
                class="mt-5"
                :has-error="v$.errors.value.birth_date?.message"
            />
          </v-col>

          <!--        Ожидаемая заработная плата-->
          <v-col md="4">
            <AppInputSalary
                v-model="data.salary"
                required
                :label="$t('common.expectedSalary')"
                :has-error="v$.errors.value.salary?.message"
                class="mt-5"
            />
          </v-col>

          <!--        Электронная почта-->
          <v-col md="4">
            <AppInput
                v-model="data.email"
                required
                :label="$t('common.email')"
                :placeholder="$t('common.email')"
                :has-error="v$.errors.value.email?.message"
                @change="v$.validate('email')"
                class="mt-5"
            />
          </v-col>

          <!--        АДРЕС-->
          <v-col md="4">
            <AppInput
                v-model="data.address"
                required
                :label="$t('common.address')"
                :placeholder="$t('common.enterAddress')"
                :has-error="v$.errors.value.address?.message"
                class="mt-5"
            />
          </v-col>

          <!--        ТИП РАБОТЫ-->
          <v-col md="4">
            <AppSelect
                v-model="data.work_type_id"
                item-value="id"
                item-title="name"
                required
                :items="CVStore.workTypes"
                :label="$t('common.jobType')"
                :has-error="v$.errors.value.work_type_id?.message"
                class="mt-5"
            />
          </v-col>

          <!--        Ваше фото-->
          <v-col md="4">
            <ImageUploader
                :value="avatar"
                type="string"
                class="mt-5"
                required
                :has-error="v$.errors.value.avatar?.message"
                :label="$t('title.yourPhoto')"
                :uploadFn="uploadAvatar"
            />
          </v-col>

          <!--        Позиция-->
          <v-col md="4">
            <AppInput
                v-model="data.position_name"
                required
                :label="$t('common.position')"
                :placeholder="$t('common.enterPosition')"
                :has-error="v$.errors.value.position_name?.message"
                class="mt-5"
            />
          </v-col>
        </v-row>
      </div>

      <div class="bg-white rounded-lg pa-5 mt-7">
        <h2 class="block-title--bordered block-title--20">{{ $t('cv.aboutMe') }}</h2>

        <v-row>
          <v-col md="12">
            <AppTextarea
                v-model="data.about"
                :placeholder="$t('cv.Tell-us-about-your-qualities-knowledge-hobbies-that-you-think-will-be-useful-to-the-employer')"
                :has-error="v$.errors.value.about?.message"
                class="mt-5 mb-4"
            />
          </v-col>
        </v-row>

      </div>

      <BlockSocialMedias
          v-model="data.social_medias"
          :items="socialMedias"
          class="mt-7"
      />

      <BlockExperience
          v-model="data.work_histories"
          class="mt-7"
      />

      <BlockEducation
          v-model="data.education_histories"
          class="mt-7"
      />

      <BlockInterests
          v-model="data.hobbies"
          :items="hobbies"
          class="mt-7"
      />

      <BlockQualities
          v-model="data.personal_qualities"
          :items="CVStore.personalQualities"
          class="mt-7"
      />

      <div class="bg-white rounded-lg pa-5 mt-7">
        <h2 class="block-title--bordered block-title--20">{{ $t('cv.DrivingExperience') }}</h2>

        <div class="d-flex flex-column mt-8">
          <h4 class="block-title--16 mb-4">{{ $t('cv.CategoryRight') }}</h4>

          <div class="d-flex align-end">
            <v-btn
                v-for="(item, index) in drivingExperience"
                :key="index"
                width="37px"
                height="37px"
                :class="[
                  'v-btn--gray rounded-lg pa-0 mr-2',
                    {'v-btn--gray-active': data.driving_experience.includes(item)}
                  ]"
                variant="outlined"
                icon
                @click="toggleDrivingLicense(item)"
            >
              <div
                  class="soft-black no-uppercase"
                  style="font-size: 14px;"
              >
                {{ item }}
              </div>
            </v-btn>

            <Switcher
                v-model="data.has_car"
                class="ml-8"
            >
              <template #label>{{ $t('cv.HavePrivateCar') }}</template>
            </Switcher>
          </div>
        </div>
      </div>

      <BlockLanguages
          v-model:native="data.native_language_id"
          v-model:extra="data.languages"
          :items="CommonStore.languages"
          :levels="CommonStore.languageLevels"
          class="mt-7"
      />

      <div class="cv-form__footer">
        <div class="cv-form__footer__title">{{ $t('cv.By-clicking-the-Continue-button-you-accept-the-term') }}
          <a href="#/">{{ $t('cv.UserAgreement') }}</a>
        </div>

        <div class="d-flex ml-auto">
          <v-btn
              height="46px"
              class="v-btn--gray no-uppercase rounded-lg"
              variant="outlined"
              :to="{name: 'CV'}"
          >
            <svg
                data-src="/img/icons/arrow-up.svg"
                class="mr-4"
                style="transform: rotate(-90deg); width: 11px; height: 16px"
            />

            {{ $t('common.Back') }}
          </v-btn>

          <v-btn
              height="46px"
              class="v-btn--primary no-uppercase rounded-lg ml-3"
              elevation="0"
              :loading="isRequestLoading('submit')"
              @click="submit"
          >
            {{ $t('common.ready') }}

            <svg
                data-src="/img/icons/tick.svg"
                class="ml-2"
                style="width: 16px; height: 12px"
            />
          </v-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.cv-form {
  &__footer {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 20px;
    margin-top: 27px;
    border-radius: 8px;

    &__title {
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      color: $black-color;

      a {
        color: $blue-color;
      }
    }
  }
}
</style>