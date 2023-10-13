<script setup lang="ts">
import { computed, ref } from "vue";
import { RightDialog } from "@/components/Composite";
import AppChatInput from "@/components/UI/AppChatInput.vue";

const props = defineProps({
  modelValue: Boolean,
  chats: Array
});
const emit = defineEmits(['update:modelValue']);

const newMessage = ref('');

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue);

    setTimeout(() => {
      if(!newValue) selectedChatID.value = null;
    }, 300)
  }
});

const ownAvatar = ref('https://s3-alpha-sig.figma.com/img/0593/2078/1f1718d2afcd41dc26333dac3254cd0f?Expires=1690156800&Signature=IJm5N-sdgocz~82AGZHb8XSJt74MKsKLZnScIKIQzuvKi5t1z8DXUdd78PWEuAdNQi5z-7YRQhUcc~BSbSin2ZfKDH1i-V2PH5x7ij1aTQWirinUTR~ndCdtOz7tK0dIEEWooLfbp3cWW-a~~me9kszy05DvQOu6fs0yz5lLs1ltxPiJHiBADB3MWspct5a66JFVfD4qxuqEDYkkG2QiNufPZKg3hRoHes6d4ZKFUQnvQmtqiz5sg-0gWYdXMYySJxYcxmlvJ5zP~bDBLUqPR3qMKLU5E~C7fTEV0rCsSFUaBi0bzrfRY5AtRd36S~H5yce0R8P2XJHAvhkwia~DKw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4');

const selectedChatID = ref<number | null>(null);

const computedSelectedChat = computed(() => {
  if(!selectedChatID.value || !props.chats?.length) return;

  const foundChat = JSON.parse(JSON.stringify(props.chats.find(item => item.id === selectedChatID.value)));

  if(foundChat) {
    foundChat.messages = foundChat.messages.reverse();
  }

  return foundChat;
})
</script>

<template>
  <RightDialog
      v-model="computedModelValue"
      width="389px"
      class="header-chat"
  >
    <template #title>{{ $t('header.messages') }}</template>

    <div class="d-flex flex-column">
      <button
          v-for="(item, index) in chats"
          :key="index"
          class="header-chat__card"
          @click="selectedChatID = item.id"
      >
        <img
            :src="item.sender.avatar"
            alt=""
            class="header-chat__card__avatar"
        />
        <div class="d-flex flex-column flex-grow-1">
          <div class="d-flex align-center mt-1">
            <h3 class="header-chat__card__title">{{ item.sender.name }}</h3>
            <div class="header-chat__card__new-msg-counter">1</div>
          </div>

          <div class="d-flex">
            <div class="header-chat__card__online-date">{{ item.sender.lastEntrance }}</div>
            <div class="header-chat__card__last-msg-date">{{ item.sender.lastMessageDate }}</div>
          </div>

        </div>
      </button>
    </div>

    <div
        :class="['header-chat__msgs', {
          'header-chat__msgs--active': computedSelectedChat
        }]"
    >
      <template v-if="computedSelectedChat">
        <div class="header-chat__msgs__header">
          <v-btn
              width="35px"
              height="35px"
              icon
              style="border-radius: 10px"
              class="pa-0 mr-4"
              elevation="0"
              @click="selectedChatID = null"
          >
            <svg
                data-src="/img/icons/arrow-up.svg"
                color="#373B55"
                style="width: 11px; height: 16px; transform: rotate(-90deg)"
            />
          </v-btn>

          <h3 class="header-chat__msgs__title">{{ computedSelectedChat.sender.name }}</h3>
        </div>

        <div class="header-chat__msgs__body">
          <div
              v-for="(msg, index) in computedSelectedChat.messages"
              :key="index"
              :class="['header-chat__msgs__item', {
                'header-chat__msgs__item--own': msg.isOwnMessage
              }]"
          >
            <img
                :src="msg.isOwnMessage ? ownAvatar : computedSelectedChat.sender.avatar"
                alt=""
                class="header-chat__msgs__item__avatar"
            />
            <span class="header-chat__msgs__item__text">{{ msg.text }}</span>
          </div>
        </div>

        <div class="header-chat__msgs__footer">
          <AppChatInput
              v-model="newMessage"
              :placeholder="$t('main.enterRequest') + ' ...'"
          />
        </div>
      </template>
    </div>
  </RightDialog>
</template>

<style lang="scss">
.header-chat {
  &__card {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid $stroke-color;
    background-color: #fff;
    transition: background-color .3s;

    &__avatar {
      min-width: 54px;
      max-width: 54px;
      height: 54px;
      border-radius: 50%;
      margin-right: 14px;
    }

    &__title {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      color: $black-color;
      max-width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 15px;
    }

    &__new-msg-counter {
      min-width: 28px;
      max-width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: $blue-color;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      color: #fff;
      margin-left: auto;
    }

    &__online-date {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: $soft-black;
      margin-top: 2.5px;
    }

    &__last-msg-date {
      display: flex;
      align-items: flex-end;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: $soft-black;
      margin-left: auto;
      margin-top: 8px;
    }

    &:hover {
      background-color: $light-gray;
    }
  }

  &__msgs {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 100%;
    height: 100%;
    width: 100%;
    background-color: #fff;
    transition: left .3s;

    &--active {
      left: 0;
    }

    &__header {
      display: flex;
      align-items: center;
      padding: 10px 20px 10px 10px;
      border-bottom: 1px solid $gray-stroke;
    }

    &__title {
      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      color: $black-color;
      max-width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__body {
      display: flex;
      flex-direction: column-reverse;
      flex: 1;
      padding: 15px 20px;
      overflow-y: auto;
    }

    &__footer {
      display: flex;
      position: relative;
      padding: 20px 20px;
    }

    &__item {
      display: flex;
      max-width: calc(100% - 50px);

      &__avatar {
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      &__text {
        background-color: $light-gray;
        border-radius: 0 10px 10px 10px;
        padding: 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }

      &--own {
        max-width: calc(100% - 80px);
        flex-direction: row-reverse;
        margin-left: auto;

        .header-chat__msgs__item {
          &__avatar {
            margin-right: 0;
            margin-left: 10px;
          }

          &__text {
            background-color: $blue-color;
            color: #fff;
            border-radius: 10px 0 10px 10px;
          }
        }
      }

      & + & {
        margin-bottom: 20px;
      }
    }
  }
}
</style>