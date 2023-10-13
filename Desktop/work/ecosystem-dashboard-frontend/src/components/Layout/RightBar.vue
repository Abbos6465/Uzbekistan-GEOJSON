<script
    setup
    lang="ts"
>
import { computed, reactive, ref } from "vue";
import api from "@/pages/Main/api";
import { DataTable, Dialog } from "@/components/UI";
import { useI18n } from "vue-i18n";
import useToast from "@/components/UI/AppToast/useToast";
import SvgIcon from "@/pages/Main/components/icons/SvgIcon.vue";

type DisabilityInfoType = {
  'address': string,
  'passport_number': string,
  'which_organization': string,
  'in_reason': string,
  'disability_date_start': string,
  'disability_date_end': string | null,
  'epdate': string
}
type YouthBookType = {
  "address": string
  "start_date": string
  "in_reason": string,
  "end_date": string
  "out_reason": string,
  "benefit_amount": null,
}
type WomensBookType = {
  "fullname": string
  "passport_number": string
  "address": string
  "direction_name": string
  "entered_date": string
  "deregistration_date": string,
}
type UnifiedRegisterOfSocialProtectionType = {
  "FullName": string
  "ApplicationDate": string
  "EligibilityDate": string
  "ValidityDate": string
}
type DialogContentType = {
  title: string,
  data: DisabilityInfoType | YouthBookType | WomensBookType | UnifiedRegisterOfSocialProtectionType
}

const {t} = useI18n();
const {toast} = useToast();

const isTopPaddingRemoved = ref(false);
const rightBarLinks = reactive([
  {
    icon: '/img/social-status/protect.svg',
    title: t('main.registerSocialProtection'),
    loading: false,
    action: function() { getUnifiedRegisterOfSocialProtection(this) }
  },
  {
    icon: '/img/social-status/notebook.svg',
    title: t('main.ironNotebook'),
    loading: false,
    action: function() { getIronBook(this) }
  },
  {
    icon: '/img/social-status/female-book.svg',
    title: t('main.womensNotebook'),
    loading: false,
    action: function() { getWomensBook(this) }
  },
  {
    icon: '/img/social-status/book.svg',
    title: t('main.youthNotebook'),
    loading: false,
    action: function() { getYouthBook(this) }
  },
  {
    icon: '/img/social-status/disability.svg',
    title: t('main.certificateDisability'),
    loading: false,
    action: function() { getDisabilityInfo(this) }
  },
]);
const dialogContent = ref<DialogContentType| null>(null);
const isDialogOpen = ref(false);

const tableHeaders = computed(() => {
  if(!dialogContent.value.data[0]) return;

  return Object
      .keys(dialogContent?.value.data[0])
      .map(key => {
        return {
          key,
          title: t(`rightBar.${key}`)
        }
      })
})

function checkWindowScroll() {
  isTopPaddingRemoved.value = window.scrollY > 53
}

async function getUnifiedRegisterOfSocialProtection(item: {title: string, loading: boolean}) {
  item.loading = true;

  await api
      .getUnifiedRegisterOfSocialProtectionApi()
      .then((data) => {
        if(!data) return toast.error(t('additionalServicesNotFound.unifiedRegisterOfSocialProtection'));

        dialogContent.value = {
          title: item.title,
          data: {
            FullName: data.FullName,
            ApplicationDate: data.ApplicationDate.split('T')[0],
            EligibilityDate: data.EligibilityDate.split('T')[0],
            ValidityDate: data.ValidityDate.split('T')[0],
          }
        }

        isDialogOpen.value = true;
      })
      .finally(() => {
        item.loading = false
      })
}

async function getIronBook(item: {title: string, loading: boolean}) {
  item.loading = true;

  await api
      .getIronBookApi()
      .then((data) => {
        if(!data || (Array.isArray(data) && !data.length)) return toast.error(t('additionalServicesNotFound.ironBook'));

        dialogContent.value = {
          title: item.title,
          data
        }

        isDialogOpen.value = true;
      })
      .finally(() => {
        item.loading = false
      })
}

async function getWomensBook(item: {title: string, loading: boolean}) {
  item.loading = true;

  await api
      .getWomensBookApi()
      .then((data) => {
        if(!data) return toast.error(t('additionalServicesNotFound.womensBook'));

        dialogContent.value = {
          title: item.title,
          data: data.map((item) => {
            return {
              FullName: item.fullname,
              passport_number: item.passport_sn,
              address: item.address,
              direction_name: item.direction_name,
              entered_date: item.entered_date,
              deregistration_date: item.deregistration_date,
            }
          })
        }

        isDialogOpen.value = true;
      })
      .finally(() => {
        item.loading = false
      })
}

async function getDisabilityInfo(item: {title: string, loading: boolean}) {
  item.loading = true;

  await api
      .getDisabilityInfoApi()
      .then((data) => {
        if(!data) return toast.error(t('additionalServicesNotFound.disability'));

        const modifiedData: DisabilityInfoType = {
          address: data.address,
          passport_number: data.passport_number,
          which_organization: data.which_organization,
          in_reason: data.disability_reason,
          disability_date_start: data.disability_date_start,
          disability_date_end: data.disability_date_end,
          epdate: data.epdate,
        };

        dialogContent.value = {
          title: item.title,
          data: modifiedData
        }

        isDialogOpen.value = true;
      })
      .finally(() => {
        item.loading = false
      })
}

async function getYouthBook(item: {title: string, loading: boolean}) {
  item.loading = true;

  await api
      .getYouthBookApi()
      .then((data) => {
        if(!data) return toast.error(t('additionalServicesNotFound.youthBook'));

        dialogContent.value = {
          title: item.title,
          data: {
            address: data.address,
            start_date: data.start_date,
            end_date: data.end_date,
            in_reason: data.in_reason.service_name ? data.in_reason.service_name : data.in_reason.child_field_name ? data.in_reason.child_field_name : '',
            out_reason: data.out_reason.name ? data.out_reason.name : data.out_reason.child_name ? data.out_reason.child_name : '',
            benefit_amount: data.benefit_amount,
          }
        }

        isDialogOpen.value = true;
      })
      .finally(() => {
        item.loading = false
      })
}

function clearDialog() {
  setTimeout(() => {
    dialogContent.value = null
  }, 300)
}

window.addEventListener('scroll', checkWindowScroll);
</script>

<template>
  <div :class="['right-bar', {'right-bar--top-padding-removed': isTopPaddingRemoved}]">
    <div class="right-bar__wrap">
      <h2 class="right-bar__title">{{ t('main.socialStatus') }}</h2>

      <div class="right-bar__items">
        <v-btn
            v-for="(link, index) in rightBarLinks"
            :key="index"
            :loading="link.loading"
            elevation="0"
            class="right-bar__item"
            @click="link.action()"
        >
          <span class="right-bar__item__icon">
            <svg-icon :src="link.icon"/>
          </span>

          <span class="right-bar__item__title">{{ link.title }}</span>

          <svg
              data-src="/img/icons/chevron-bottom.svg"
              class="right-bar__item__arrow"
          />
        </v-btn>
      </div>
    </div>

    <teleport to="body">
      <Dialog
          v-model="isDialogOpen"
          @update:modelValue="clearDialog"
          :width="Array.isArray(dialogContent?.data) ? '1200px' : '600px'"
      >
        <template #title>{{ dialogContent?.title }}</template>

        <div class="d-flex flex-wrap">
          <div
              v-if="!Array.isArray(dialogContent?.data)"
              v-for="(item, index) in dialogContent?.data"
              :key="index"
              :class="['mt-4',
                [
                  'EligibilityDate',
                  'ValidityDate',
                  'disability_date_start',
                  'disability_date_end',
                  'start_date',
                  'end_date'
                 ].includes(index) ? 'w-50' : 'w-100'
              ]"
          >
            <h4 class="block-title--16 soft-black">{{ $t(`rightBar.${index}`) }}</h4>
            <p class="block-title--16">{{ item ? item : t('main.noInformationFound') }}</p>
          </div>

          <DataTable
              v-else
              :headers="tableHeaders"
              :items="dialogContent?.data"
              class="mt-4"
          >
            <template #entered_date="item">
              <div class="text-no-wrap">{{ item.columns.entered_date }}</div>
            </template>
          </DataTable>
        </div>
      </Dialog>
    </teleport>
  </div>
</template>

<style lang="scss">
.right-bar {
  width: 60px;
  height: calc(100vh - 56px);
  position: fixed;
  z-index: 2;
  top: 56px;
  right: 0;
  padding-top: 54px;
  background-color: #fff;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.05);
  transition: width .3s, padding-top .3s;

  &__wrap {
    width: 389px;
    padding: 15px 10px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: $black-color;
    padding: 0 10px;
    margin-bottom: 15px;
    opacity: 0;
    transition: opacity .3s;
  }

  &__items {
    margin-left: -10px;
    transition: margin-left .3s;
  }

  &__item {
    width: 100%;
    height: 60px!important;
    display: flex;
    align-items: center;
    padding: 10px!important;
    border-radius: 10px;
    text-transform: unset;
    transition: box-shadow .3s;

    .v-btn__content {
      white-space: unset;
    }

    &__icon {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: $soft-red;
      margin-right: 15px;
      color: #fff;
    }

    &__title {
      font-size: 14px;
      color: $black-color;
      margin-right: 15px;
    }

    &__arrow {
      width: 10px;
      height: 4px;
      margin-left: auto;
      color: $black-color;
      transform: rotate(-90deg);
    }

    &:nth-child(2) &__icon {
      background: $orange-color;
    }

    &:nth-child(3) &__icon {
      background: $purple-color;
    }

    &:nth-child(4) &__icon {
      background: $blue-color;
    }

    &:nth-child(5) &__icon {
      background: $soft-green;
    }

    & + & {
      margin-top: 15px;
    }

    &:hover {
      box-shadow: 0 0 12px rgba(0, 0, 0, .05);
    }
  }

  &:hover {
    width: 389px;

    .right-bar {
      &__title {
        opacity: 1;
      }

      &__items {
        margin-left: 0;
      }
    }
  }

  &--top-padding-removed {
    padding-top: 0;
  }
}
</style>