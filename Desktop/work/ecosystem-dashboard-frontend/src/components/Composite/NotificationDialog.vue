<script
    setup
    lang="ts"
>
import { RightDialog } from "@/components/Composite/index";
import { computed } from "vue";
import useLoading from "@/composables/useLoading";
import { useCommonStore } from "@/store/Common";
import CommonApi from "@/api/commonApi";
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll';

type PropsType = {
  modelValue: boolean
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);

const CommonStore = useCommonStore();
const {isRequestLoading} = useLoading();

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

async function markNotificationAsRead(id: string | number) {
  await CommonApi.updateNotificationAsReadApi(id);
  const foundNotify = CommonStore.notifications.list.find(i => i.id === id);
  if(foundNotify) foundNotify.is_read = true;
}

async function loadNextPage({done}: {done: Function}) {
  if(CommonStore.notifications.paginate.current_page === CommonStore.notifications.paginate.last_page) return;

  await CommonStore.getNotifications(CommonStore.notifications.paginate.current_page + 1);
}
</script>

<template>
  <RightDialog
      v-model="computedModelValue"
      width="389px"
  >
    <template #title>{{ $t('header.notifications') }}</template>

    <v-progress-linear
        v-if="isRequestLoading('getNotifications')"
        indeterminate
        color="#2988F5"
    />

    <v-infinite-scroll
        v-if="CommonStore.notifications.list.length"
        height="100%"
        @load="loadNextPage"
    >
      <button
          v-for="(item, index) in CommonStore.notifications.list"
          :key="index"
          :class="['notification-card', {
                  'notification-card--not-read': !item.is_read
                }]"
          @click="!item.is_read && markNotificationAsRead(item.id)"
      >
        <div class="d-flex flex-column text-left">
          <h3 class="block-title--16 mb-1">{{ item.title }}</h3>
          <p class="notification-card__subtitle">{{ item.description }}</p>
        </div>
      </button>

      <template #loading>

      </template>
    </v-infinite-scroll>
  </RightDialog>
</template>

<style lang="scss">
.v-infinite-scroll__side {
  padding: 0;
}
.v-infinite-scroll-intersect {
  height: 0;
  overflow: hidden;
}
</style>