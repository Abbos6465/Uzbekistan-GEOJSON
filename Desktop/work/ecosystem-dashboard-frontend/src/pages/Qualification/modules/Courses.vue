<script setup lang="ts">

import {DataTable} from "@/components/UI";
import {computed, onMounted, ref, watch} from "vue";
import QualificationApi from "@/pages/Qualification/api";
import {useRoute, useRouter} from "vue-router";
import Dialog from "@/components/UI/Dialog.vue";
import useLoading from "@/composables/useLoading";
import {useI18n} from "vue-i18n";
import AppInput from "@/components/UI/AppInput.vue";
import AppSelect from "@/components/UI/AppSelect.vue";
import Rate from "@/components/UI/Rate.vue";
import {useQualificationStore} from "@/pages/Qualification/store";
import {useAuthStore} from "@/store/Auth";
import useValidate from "@/composables/useValidate";
import Map from "../components/Map/MapIndex.vue";

const authStore = useAuthStore();

const authInfo = authStore.authInfo ?? null;

const coursesTableHeaders = computed(() => {
  return [
    {key: 'order', title: '№'},
    {key: 'status', title: t('main.status')},
    {key: 'edu_name', title: t('qualification.EducationalCenter')},
    {key: 'trained_profession', title: t('certificates.institutionName')},
    {key: 'start_date', title: t('qualification.StartDateTraining')},
    {key: 'end_date', title: t('qualification.DateGraduation')},
    {key: 'actions', title: t('my-job.Validity')},
  ]
});

enum ConditionsType {
  all = 'all',
  started = 'started',
  not_ended = 'not_ended',
  ended = 'ended',
}

const props = defineProps(["class"])
const QualificationStore = useQualificationStore();

const route = useRoute();
const router = useRouter();
const {changeIsRequestLoading, isRequestLoading} = useLoading();
const {t, locale} = useI18n();
const isCourseDialogOpen = ref(false);
const isApplyDialogOpen = ref(false);
const organizationData = ref({});

const user_name = ref('');

const applyForm = ref({
  phone: '',
  passport: '',
  pin: '',
  company_tin: null,
  birth_date: '',
  gender: '',
  period_weeks: null,
  structure_parent_id: null,
  parent_structure_soato: '',
  direction_id: null,
  address_latitude: '',
  address_longitude: '',
  address: '',
});

const mapForm = ref({
  region_id: null,
  city_soato: null,
  tin: null,
  coor: []
})

const rules = computed(() => {
  const modifiedObj = {
    passport: {
      required: true
    },
    pin: {
      required: true
    },
    birth_date: {
      required: true
    },
    phone: {
      required: true
    },
    company_tin: {
      required: true
    },
    direction_id: {
      required: true
    },
    structure_parent_id: {
      required: true
    },
    parent_structure_soato: {
      required: true
    }
  }

  return modifiedObj;
});

const v$ = useValidate(rules, applyForm);

const coursesConditions = ref(
    [
      {
        value: ConditionsType.all,
        title: t('qualification.AllCourses'),
        items: [],
        counter: 0
      },
      {
        value: ConditionsType.started,
        title: t('qualification.ThoseStudying'),
        items: [],
        counter: 0
      },
      {
        value: ConditionsType.not_ended,
        title: t('qualification.Outcasts'),
        items: [],
        counter: 0
      },
      {
        value: ConditionsType.ended,
        title: t('qualification.Graduates'),
        items: [],
        counter: 0
      }
    ]
)


const activeCondition = ref(ConditionsType.all);
const regions = ref([]);
const cities = ref([]);
const organizations = ref([]);
const directions = ref([]);
const periodWeeksData = ref([]);

function getPeriodWeeks() {
  for (let i = 1; i <= 40; i++) {
    const data = {
      title: `${i} ${t('qualification.week')}`,
      value: `${i}`
    }
    periodWeeksData.value.push(data);
  }
}

async function getRegions() {
  await QualificationApi.resourcesRegions()
      .then((res) => {
        regions.value = res;
      })
}

async function getCities() {
  await QualificationApi.resourcesCities(applyForm.value.structure_parent_id)
      .then((res) => {
        cities.value = res;
      }).catch(err => {
        console.log(err);
      })
}

async function getOrganizations() {
  await QualificationApi.resourceOrganization({city_soato: applyForm.value.parent_structure_soato})
      .then(res => {
        organizations.value = res;
      })
      .catch(err => console.log(err));
}

const direction_weekly = ref(null);

async function getDirections() {
  await QualificationApi.resourceDirections({company_tin: applyForm.value.company_tin})
      .then(res => {
        directions.value = res;
        directions.value.map((element, index) => {
          element.title_uz = `${element.direction_name_uz} (${element.payment_type_uz})`;
          element.title_ru = `${element.direction_name_ru} (${element.payment_type_ru})`;
        })
      })
      .catch(err => console.log(err));
}

async function getCourses(params = {}) {
  await QualificationStore.getMyCourses(params)
      .then(() => {
        const data = QualificationStore.courses;
        if (data) {
          if (!Object.keys(params).length) {
            coursesConditions.value[0].items = data;
            coursesConditions.value[0].counter = data.length;
          }
          if (params && params.status == 'started') {
            coursesConditions.value[1].items = data;
            coursesConditions.value[1].counter = data.length;
          }
          if (params && params.status == 'not_ended') {
            coursesConditions.value[2].items = data;
            coursesConditions.value[2].counter = data.length;
          }
          if (params && params.status == 'ended') {
            coursesConditions.value[3].items = data;
            coursesConditions.value[3].counter = data.length;
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
}

function showOrganizationHandler(company_tin) {
  QualificationApi.showByOrganization(company_tin)
      .then(res => {
        organizationData.value = res;
        isCourseDialogOpen.value = true;
      });
}

function applyHandler() {
  isApplyDialogOpen.value = true;
}

const isSelectOrganization = ref(false);

function selectOrganizationHandler(organization){
  isSelectOrganization.value = true;
  applyForm.value.structure_parent_id = organization.region_id;
  applyForm.value.parent_structure_soato = organization.city_soato;
  applyForm.value.company_tin = organization.tin;

  setTimeout(()=> {
    isSelectOrganization.value = false;
  },1000)
}

function storeAppealCourseHandler() {
  if (v$.validate()) {
    applyForm.value.f_name = authInfo.person_name;
    applyForm.value.l_name = authInfo.person_surname;
    applyForm.value.m_name = authInfo.person_patronymic;
    applyForm.value.gender = authInfo.gender;

    QualificationApi.storeAppealCourse(applyForm.value)
        .then(res => {
          applyDialogCloseHandler();
        })
        .catch(err => {
          console.log(err);
        })
  } else {
    if (applyForm.value.pin > 0 && applyForm.value.pin.length != 14) {
      v$.errors.value.pin = {
        message: [
          t("qualification.PINFL-must-be-14-digits-long")
        ]
      }
    }

    if (applyForm.value.birth_date.length < 10) {
      v$.errors.value.birth_date = {
        message: [
          t('common.valueIsRequired')
        ]
      }
    }
  }
}

function applyDialogCloseHandler() {
  isApplyDialogOpen.value = false;
  setTimeout(() => {
    applyForm.value = {
      phone: authInfo?.person_phone ?? '',
      passport: authInfo?.person_passport ?? '',
      pin: authInfo?.person_pin ?? '',
      company_tin: null,
      birth_date: authInfo.birth_date.substr(0, 10) ?? '',
      gender: '',
      period_weeks: null,
      structure_parent_id: null,
      parent_structure_soato: '',
      direction_id: null,
      address_latitude: '',
      address_longitude: '',
      address: '',
    }
    v$.clear();
  }, 500)
}

function updateCoorHandler(data = {}){
  if (data && data.address_latitude && data.address_longitude) {
   mapForm.value.coor = [Number(data.address_latitude), Number(data.address_longitude)]
  }
}

onMounted(async () => {
  await getCourses();
  await getCourses(({status: "started"}))
  await getCourses(({status: "not_ended"}))
  await getCourses(({status: "ended"}))
  await getRegions();
});

let oldValue = Object.assign({}, applyForm.value);

watch(() => applyForm.value, (newValue) => {
  if (newValue.structure_parent_id != oldValue.structure_parent_id) {

    if(!isSelectOrganization.value) newValue.parent_structure_soato = null;

    if (newValue.structure_parent_id) {
      getCities();
      mapForm.value.region_id = newValue.structure_parent_id;
      const region = regions.value.find(e => e.STRUCTURE_ID == newValue.structure_parent_id);
      updateCoorHandler(region);

    } else {
      cities.value = [];
    }
  }
  if (newValue.parent_structure_soato != oldValue.parent_structure_soato) {
    if(!isSelectOrganization.value) newValue.company_tin = null;
    if (newValue.parent_structure_soato) {
      getOrganizations();
      mapForm.value.city_soato = newValue.parent_structure_soato;

      const city = cities.value.find(e => e.SOATO == newValue.parent_structure_soato);
      updateCoorHandler(city);
    } else {
      organizations.value = [];
    }
  }

  if (newValue.company_tin != oldValue.company_tin) {
    if(!isSelectOrganization.value) newValue.direction_id = null;
    if (newValue.company_tin) {
      getDirections()
      mapForm.value.tin = newValue.company_tin;

      const organization = organizations.value.find(e => e.tin == newValue.company_tin);
      updateCoorHandler(organization);
    } else {
      directions.value = [];
    }
  }

  if (newValue.direction_id != oldValue.direction_id) {
    newValue.period_weeks = null;
    if (newValue.direction_id) {
      const direction = directions.value.find(obj => obj.direction_id == newValue.direction_id);
      direction_weekly.value = direction.weekly;
      getPeriodWeeks();
      newValue.period_weeks = direction_weekly.value;
    } else {
      periodWeeksData.value = [];
    }

  }

  oldValue = Object.assign({}, newValue);
}, {deep: true});

watch(() => isApplyDialogOpen.value, (newValue) => {
  if (newValue) {
    if (authInfo) {
      user_name.value = `${authInfo.person_surname} ${authInfo.person_name} ${authInfo.person_patronymic}`;
      applyForm.value.passport = authInfo.person_passport;
      applyForm.value.pin = authInfo.person_pin;
      applyForm.value.birth_date = authInfo.birth_date.substr(0, 10);
      applyForm.value.phone = authInfo.person_phone;
    }
  }
})

</script>

<template>
  <div class="bg-white px-5 pt-5 rounded-lg h-100 my-courses" :class="props.class">
    <v-tabs
        v-model="activeCondition"
        class="courses__tabs"
    >
      <v-tab
          v-for="item in coursesConditions"
          :key="item.value"
          :value="item.value"
          height="40px"
          class="courses__tab no-uppercase block-title--16 rounded-b-0"
      >
        {{ item.title }}
        <div class="courses__tab__counter">{{ item.counter }}</div>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeCondition">
      <v-window-item
          v-for="(item, index) in coursesConditions"
          :key="index"
          :value="item.value"
      >


        <DataTable
            maxHeight="500px"
            :headers="coursesTableHeaders"
            :items="item.items"
            :loading="isRequestLoading('getCourses')"
        >

          <template #order="item">
            {{ item.index + 1 }}
          </template>

          <template #status="item">
            <div class="d-flex align-center w-100 h-100">
              <v-chip
                  v-if="item.selectable.status"
                  class="p-1 courses__table__status align-center"
                  :class="`courses__table__status-${item.selectable.status}`"
                  label
              >
                <span v-if="item.selectable.status=='started'">{{ t('qualification.beingTrained') }}</span>
                <span v-if="item.selectable.status=='ended'">{{ t('qualification.Finished') }}</span>
                <span v-if="item.selectable.status=='not_ended'">
                {{ t('qualification.Excluded') }}
              </span>
              </v-chip>
            </div>
          </template>

          <template #edu_name="item">
            <div class="d-flex align-center w-100 h-100">
              {{ item.selectable.institution_name }}
            </div>
          </template>

          <template #trained_profession="item">
            <div class="d-flex align-center w-100 h-100">
              {{ item.selectable.direction_name }}
            </div>
          </template>

          <template #start_date="item">
            <div class="d-flex align-center w-100 h-100">
              {{ item.selectable.start_date }}
            </div>
          </template>

          <template #end_date="item">
            <div class="d-flex align-center w-100 h-100">
              {{ item.selectable.end_date }}
            </div>
          </template>

          <template #actions="item">
            <div class="d-flex align-center w-100 h-100">
              <button
                  class="text-blue d-flex align-center"
                  @click="showOrganizationHandler(item.selectable.company_tin)"
              >
                <span class="mr-2">{{ t('common.more') }}</span>
                <svg data-src="/img/icons/next.svg" class="more__next-icon"></svg>
              </button>
            </div>
          </template>

        </DataTable>
      </v-window-item>
    </v-window>

    <div class="d-flex justify-end mt-5 applyBtn_wrapper">
      <button
          class="px-5 py-4 rounded-lg v-btn v-btn--primary d-flex align-center justify-center"
          style="height: 46px"
          @click="applyHandler"
      >
        <span class="text-white text-none block-title--16">
            {{ t('qualification.Apply-now') }}
        </span>
      </button>
    </div>
  </div>

  <Dialog
      v-model="isCourseDialogOpen"
      width="1020px"
      :outsideClose="true"
  >
    <template #title>
      <div class="d-flex align-center justify-space-between">
        <div class="block-title--20">
          {{ t('cv.interest') }}
        </div>
        <v-chip
            label
            class="courses__table__status-started">
          <span>
            {{ organizationData.status == 1 ? t('qualification.Working') : t('qualification.Not-working') }}
          </span>
        </v-chip>
      </div>
    </template>

    <div class="py-10 d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <div>
          <svg data-src="/img/icons/interest.svg"></svg>
        </div>
        <div class="ms-4 organization-title">
          <div class="block-title--20 text-h5">
            {{ organizationData.name }}
          </div>
          <Rate :rate="organizationData.rate"/>
        </div>
      </div>
      <div class="ms-5">
        <a v-if="organizationData.phone" :href="`tel:${organizationData.phone}`"
           class="px-5 py-4 rounded-lg v-btn v-btn--primary d-flex justify-space-between align-center"
           style="min-height: 46px; min-width: 180px"
        >
          <svg data-src="/img/icons/tel.svg"></svg>
          <span class="text-white block-title--16 ms-2">
            {{ organizationData.phone }}
          </span>
        </a>
      </div>
    </div>
    <div class="course-dialog_body">
      <div class="item">
        <div class="item__left">
            <span class="item__left-title">
              {{ t('qualification.NumberOfCourses') }}:
            </span>
          <span class="item__left-content">
              {{ organizationData.direction_organizations_count ?? 0 }}
            </span>
        </div>
        <div class="item__right">
          <svg data-src="/img/icons/book.svg"></svg>
        </div>
      </div>
      <div class="item">
        <div class="item__left">
            <span class="item__left-title">
              {{ t('qualification.Students-are-being-trained') }}:
            </span>
          <span class="item__left-content">
              {{ organizationData.PaidCourseStudentCount ?? 0 }}
            </span>
        </div>
        <div class="item__right">
          <svg data-src="/img/icons/students.svg"></svg>
        </div>
      </div>
      <div class="item">
        <div class="item__left">
            <span class="item__left-title">
              {{ t('qualification.Head-of-the-organization') }}:
            </span>
          <span class="item__left-content">
              {{ organizationData.director_name }}
            </span>
        </div>
        <div class="item__right">
          <svg data-src="/img/icons/user_2.svg"></svg>
        </div>
      </div>
    </div>
    <div class="course-dialog_footer mt-7">
      <div class="block-title--16">
        {{ t('qualification.AdditionalInformation') }}

      </div>
      <v-row class="mt-6">
        <v-col md="6">
          <div class="course-dialog__col">
            <div class="course-dialog__col-icon">
              <svg data-src="/img/icons/user_2.svg" class="icon"></svg>
            </div>
            <div class="course-dialog__col-contents">
              <div class="title">
                {{ t('qualification.Founders') }}
              </div>
              <div class="text">
                {{ organizationData.founder_name }}
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="6">
          <div class="course-dialog__col">
            <div class="course-dialog__col-icon">
              <svg data-src="/img/icons/open-book.svg"></svg>
            </div>
            <div class="course-dialog__col-contents">
              <div class="title">
                {{ t('qualification.Activity') }}
              </div>
              <div class="text">
                {{ organizationData.oked }}
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="6">
          <div class="course-dialog__col">
            <div class="course-dialog__col-icon">
              <svg data-src="/img/icons/address.svg" class="icon address-icon"></svg>
            </div>
            <div class="course-dialog__col-contents">
              <div class="title">
                {{ t('qualification.OrganizationAddress') }}:
              </div>
              <div class="text">
                {{ organizationData.address_us }}
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="6">
          <div class="course-dialog__col">
            <div class="course-dialog__col-icon">
              <svg data-src="/img/icons/organizational.svg" class="icon organizational-icon"></svg>
            </div>
            <div class="course-dialog__col-contents">
              <div class="title">
                {{ t('qualification.Organizational-and-legal-form') }}:
              </div>
              <div class="text">
                {{ organizationData.opf }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </Dialog>
  <Dialog
      v-model="isApplyDialogOpen"
      width="1020px"
      :outsideClose="true"
      @close="applyDialogCloseHandler"
  >
    <template #header>
      <div class="apply-dialog__title block-title--20 d-flex align-center justify-center my-5">
        {{ t('qualification.WillRespond') }}
      </div>
    </template>
    <v-row class="align-end">
      <v-col md="6">
        <AppInput
            :label="t('rightBar.FullName')"
            type="text"
            required
            :placeholder="t('qualification.EnterFullName')"
            v-model="user_name"
            :has-error="v$.errors.value.user_name?.message"
            :disabled="user_name ? true : false"
        />
      </v-col>
      <v-col md="6">
        <AppSelect
            :label="t('qualification.region')"
            :placeholder="t('qualification.Choose')"
            :items="regions"
            item-value="STRUCTURE_ID"
            :itemTitle="locale=='uz' ? 'STRUCTURE_NAME_OZ' : 'STRUCTURE_NAME_RU'"
            v-model="applyForm.structure_parent_id"
            :has-error="v$.errors.value.structure_parent_id?.message"
        />
      </v-col>
      <v-col md="6">
        <AppInput
            :label="t('qualification.Series-and-passport-number')"
            required
            :placeholder="t('qualification.EnterPassport')"
            v-model="applyForm.passport"
            :has-error="v$.errors.value.passport?.message"
            :disabled="authInfo?.person_passport ? true : false"
        />
      </v-col>
      <v-col md="6">
        <AppSelect
            :label="t('qualification.city')"
            :placeholder="t('qualification.Choose')"
            :items="cities"
            item-value="SOATO"
            :itemTitle="locale=='uz' ? 'STRUCTURE_NAME_OZ' : 'STRUCTURE_NAME_RU'"
            v-model="applyForm.parent_structure_soato"
            :has-error="v$.errors.value.parent_structure_soato?.message"
        />
      </v-col>
      <v-col md="6">
        <AppInput
            v-model="applyForm.pin"
            :label="t('cabinet.pinfl')"
            required
            :placeholder="t('qualification.EnterPinfl')"
            :has-error="v$.errors.value.pin?.message"
            :disabled="authInfo?.person_pin ? true : false"
        />
      </v-col>
      <v-col md="6">
        <AppSelect
            :items="organizations"
            item-value="tin"
            item-title="name"
            :placeholder="t('qualification.selectEdu')"
            :label="t('qualification.EducationalCenter')"
            v-model="applyForm.company_tin"
            :has-error="v$.errors.value.company_tin?.message"
        />
      </v-col>
      <v-col md="6">
        <AppInput
            v-model="applyForm.birth_date"
            :label="t('qualification.Date-of-Birth')"
            :placeholder="t('qualification.selectDate')"
            type="date"
            :has-error="v$.errors.value.birth_date?.message"
            :disabled="authInfo?.birth_date ? true : false"
        />
      </v-col>
      <v-col md="6">
        <AppSelect
            :items="directions"
            item-value="direction_id"
            :item-title="locale == 'uz' ? 'title_uz' : 'title_ru'"
            :placeholder="t('qualification.Choose-a-course')"
            :label="t('qualification.Course')"
            v-model="applyForm.direction_id"
            :has-error="v$.errors.value.direction_id?.message"
        />
      </v-col>
      <v-col md="6">
        <AppInput
            :label="t('qualification.PhoneNumber')"
            :placeholder="t('qualification.EnterPhoneNumber')"
            v-model="applyForm.phone"
            :disabled="authInfo?.person_phone ? true : false"
        />
      </v-col>
      <v-col md="6">
        <AppSelect
            v-model="applyForm.period_weeks"
            :items="periodWeeksData"
            item-title="title"
            item-value="value"
            :placeholder="t('qualification.selectPeriod')"
            :label="t('qualification.period')"
            :disabled="direction_weekly ? true : false"
        />
      </v-col>
    </v-row>
    <div class="mt-5">
      <Map
          @selectOrganization="selectOrganizationHandler"
          :form="mapForm"
      />
    </div>
    <div class="d-flex justify-end mt-5">
      <button
          class="px-5 py-4 rounded-lg v-btn v-btn--primary d-flex align-center justify-center"
          style="height: 46px" @click="storeAppealCourseHandler">
        <span class="text-white text-none block-title--16">
            {{ t('my-job.send') }}
        </span>
      </button>
    </div>
  </Dialog>
</template>

<style lang="scss">

.more__next-icon {
  margin-top: -3.5px;
  width: 8px;
  height: 12px;

  path {
    fill: #2196F3 !important;
  }
}

.my-courses {
  position: relative;
  padding-bottom: 100px !important;

  .v-table__wrapper {
    margin-top: 0 !important;
  }
}

.course-dialog_body {
  display: flex;
  align-items: start;
  background-color: #F1F5F9;
  border-radius: 10px;

  .item {
    width: calc(100% / 3);
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;


    &__left {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &-title {
        font-size: 16px;
        font-weight: 400;
        color: #718193;
      }

      &-content {
        color: #373B55;
        font-size: 18px;
        font-weight: 600;
        min-height: 27px;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 5px;
      border-radius: var(--10-px, 10px);
      background: #FFF;
      box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.05);
      min-width: 45px;
      min-height: 45px;
    }

    &:not(:last-child) {
      border-right: 1px solid #C0C0C0;
    }
  }
}

.course-dialog_footer {

  .course-dialog__col {
    display: flex;
    align-items: center;
    gap: 10px;

    &-icon {
      min-height: 40px;
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 10px;
      background-color: #F1F5F9;

      .icon {
        width: 12px;
        height: 16px;

        path {
          stroke: #718193;
        }

        .address-icon {
          width: 12px;
          height: 14px;
        }

        .organizational-icon {
          width: 14px;
          height: 14px;
        }
      }
    }

    &-contents {
      display: flex;
      flex-direction: column;
      gap: 3px;

      .title {
        color: #718193;
        font-size: 14px;
        font-weight: 400;
      }

      .text {
        font-size: 14px;
        font-weight: 500;
        color: #373B55;
        min-height: 21px;
      }
    }
  }
}

.applyBtn_wrapper {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.organization-title {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>