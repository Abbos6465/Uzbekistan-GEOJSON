<script setup lang="ts">
import { computed, ref } from "vue";
import AppChatInput from "@/components/UI/AppChatInput.vue";
import {useI18n} from "vue-i18n";

const chats = ref([
  {
    id: 1,
    sender: {
      name: 'Абдулбосидов Шерали Рустам ўғли',
      lastEntrance: 'был(а) в 14:50',
      lastMessageDate: '2 часа назад',
      avatar: 'https://s3-alpha-sig.figma.com/img/14ce/bffb/b57940f62c612ee7633f7334cde8f3f9?Expires=1690156800&Signature=PulAE0co7FV9-CDyyiKMHTuupYwlbUOoVqywqvdusu0JY5Dl4xBJYv9RtdH8znvTWS9SU~DbGgxupv8vMT31DorjlTUqZglLImbv3KGpVJkn3mQa8QI1rMa9vOMQuOVB5AsxXJAiB-m6Zo4jiOZ1Brof9-rzgACP2FJmh~8~5ydl-XDKrj2p6WRv1YKtAvUrcsTnSPJ7iSIUHrQDrRreOR2Ct4XSl9l3Kbz1e9vFSnB0z3CpPUWULneGEVzKWvaRuDtnAASNY4uHffVCqWw1kqgSq7JkCKsUvmS7EqrWNL0hgAUqqGryy4Fmj6P9Pmojf8j9t0Z61S81wiXlvXE5sw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4'
    },
    messages: [
      {
        date: new Date(),
        text: 'Здравствуйте. Я отправил директору заявку, которую вы отправили. Я дам вам знать, как только он подтвердит',
        isRead: true
      },
      {
        date: new Date(),
        text: 'Здравствуйте. Я отправил директору заявку, которую вы отправили. Я дам вам знать, как только он подтвердит',
        isRead: false
      },
      {
        date: new Date(),
        text: 'Здравствуйте. Большое спасибо',
        isOwnMessage: true
      }
    ]
  }
]);
const selectedChatID = ref(1);
const newMessage = ref('');
const ownAvatar = ref('https://s3-alpha-sig.figma.com/img/0593/2078/1f1718d2afcd41dc26333dac3254cd0f?Expires=1690156800&Signature=IJm5N-sdgocz~82AGZHb8XSJt74MKsKLZnScIKIQzuvKi5t1z8DXUdd78PWEuAdNQi5z-7YRQhUcc~BSbSin2ZfKDH1i-V2PH5x7ij1aTQWirinUTR~ndCdtOz7tK0dIEEWooLfbp3cWW-a~~me9kszy05DvQOu6fs0yz5lLs1ltxPiJHiBADB3MWspct5a66JFVfD4qxuqEDYkkG2QiNufPZKg3hRoHes6d4ZKFUQnvQmtqiz5sg-0gWYdXMYySJxYcxmlvJ5zP~bDBLUqPR3qMKLU5E~C7fTEV0rCsSFUaBi0bzrfRY5AtRd36S~H5yce0R8P2XJHAvhkwia~DKw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4');
const {t} = useI18n();

const computedChats = computed(() => {
  return chats.value.map(item => {
    item.sender.notReadMsgs = item.messages.reduce((acc, msg) => {
      if(msg.isRead) acc += 1;

      return acc;
    }, 0);

    return item;
  })
})

const computedSelectedChat = computed(() => {
  return chats.value.find(item => item.id === selectedChatID.value)
})
</script>

<template>
  <div class="chat">
    <div class="chat__chats">
      <button
          v-for="(chat, index) in computedChats"
          :key="index"
          :class="['chat__chats__item', {
            'chat__chats__item--active': selectedChatID === chat.id
          }]"
          @click="selectedChatID = chat.id"
      >
        <span class="d-flex align-center">
          <span class="chat__chats__item__name">{{ chat.sender.name }}</span>

          <span class="chat__chats__item__not-read-msgs">{{ chat.sender.notReadMsgs }}</span>
        </span>
        <span class="d-flex mt-1">
          <span class="chat__chats__item__last-entrance">{{ chat.sender.lastEntrance }}</span>

          <span class="chat__chats__item__last-msg-date">{{ chat.sender.lastMessageDate }}</span>
        </span>
      </button>
    </div>
    <div class="chat__window">
      <div
          v-if="computedSelectedChat"
          class="chat__window__wrap"
      >
        <div class="chat__window__content">
          <div
              v-for="(msg, index) in computedSelectedChat.messages"
              :key="index"
              :class="['chat__msg', {
                'chat__msg--own': msg.isOwnMessage
              }]"
          >
            <img
                :src="msg.isOwnMessage ? ownAvatar : computedSelectedChat.sender.avatar"
                alt=""
                class="chat__msg__avatar"
            />
            <span class="chat__msg__text">{{ msg.text }}</span>
          </div>
        </div>
        <div class="chat__window__footer">
          <AppChatInput
              v-model="newMessage"
              :placeholder="t('main.enterRequest') + '...'"
          />
        </div>
      </div>
      <div
          v-else
          class="chat__window__not-selected"
      >

      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat {
  display: flex;
  width: 100%;
  height: 476px;

  &__chats {
    width: 250px;
    display: flex;
    flex-direction: column;

    &__item {
      width: 100%;
      height: 65px;
      padding: 10px;
      border-bottom: 1px solid $stroke-color;
      transition: background-color .3s;

      &__name {
        max-width: 146px;
        font-size: 14px;
        font-weight: 500;
        line-height: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
      }

      &__not-read-msgs {
        height: 22px;
        min-width: 22px;
        border-radius: 100px;
        background-color: $blue-color;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        line-height: normal;
        color: #fff;
        padding-top: 1px;
        margin-left: auto;
      }

      &__last-entrance {
        color: $soft-black;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
        margin-right: 10px;
      }

      &__last-msg-date {
        align-self: flex-end;
        color: $soft-black;
        font-size: 12px;
        font-weight: 400;
        line-height: normal;
        margin-left: auto;
        margin-top: 4px;
      }

      &:hover, &--active {
        background-color: $light-gray;
      }

      &:first-child {
        border-top-left-radius: 10px;
      }

      &:not(&:first-child):last-child {
        border-bottom-left-radius: 10px;
      }
    }
  }

  &__window {
    display: flex;
    width: calc(100% - 250px);
    background-color: $light-gray;
    border-radius: 0 10px 10px 0;

    &__wrap {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      height: 100%;
    }

    &__content {
      max-height: calc(100% - 80px);
      padding: 10px 15px;
    }

    &__footer {
      display: flex;
      width: 100%;
      min-height: 72px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid $stroke-color;
      border-radius: 0 0 10px 0;
      position: relative;

      &__send-btn {
        display: flex;
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        color: $blue-color;
      }
    }

    &__textarea {
      width: 100%;
      border: 1px solid #CCD6EC;
      border-radius: 80px;
      max-height: 100px;
      resize: none;
      padding: 4px 60px 4px 15px;
    }
  }

  &__msg {
    display: flex;
    max-width: 70%;

    &__avatar {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 20px;
    }

    &__text {
      background-color: #fff;
      border-radius: 0 10px 10px 10px;
      padding: 10px;
      font-size: 16px;
      font-weight: 400;
      line-height: normal;
    }

    &--own {
      flex-direction: row-reverse;
      margin-left: auto;

      .chat__msg {
        &__avatar {
          margin-right: 0;
          margin-left: 20px;
        }

        &__text {
          background-color: $blue-color;
          color: #fff;
          border-radius: 10px 0 10px 10px;
        }
      }
    }

    & + & {
      margin-top: 20px;
    }
  }
}
</style>