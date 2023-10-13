<script
    setup
    lang="ts"
>
import { onMounted, ref, watch } from "vue";
import AppChatInput from "@/components/UI/AppChatInput.vue";
import SupportApi from "@/pages/Support/api";
import useLoading from "@/composables/useLoading";
import { generateRandomID } from "@/utils/helper";
import {useI18n} from "vue-i18n";
import { Vue3Lottie } from 'vue3-lottie'
import robotJSON from '@/assets/robot.json'

const LSKey = 'ChatBot';

type MessageType = {
  id?: string
  isBot?: boolean
  text: string
}

const { changeIsRequestLoading, isRequestLoading } = useLoading();
const {t} = useI18n()
const messages = ref<MessageType[]>([]);
const question = ref<string>('');

async function askQuestion() {
  if(isRequestLoading('askQuestion')) return;
  changeIsRequestLoading('askQuestion', true);

  const generatedID = generateRandomID();
  const text = JSON.parse(JSON.stringify(question.value));

  question.value = '';

  messages.value.unshift({
    id: generatedID,
    text
  });

  await SupportApi
      .postQuestion(text)
      .then(({answer}) => {
        messages.value.unshift({
          isBot: true,
          text: answer
        });
      })
      .catch(() => {
        const foundIndex = messages.value.findIndex(i => i.id === generatedID);
        messages.value.splice(foundIndex, 1);
      })
      .finally(() => {
        changeIsRequestLoading('askQuestion', false);
      });
}

function clearLS() {
  localStorage.removeItem(LSKey);
  messages.value = [];
}

onMounted(() => {
  if(localStorage.getItem(LSKey)) messages.value = JSON.parse(localStorage.getItem(LSKey)) ?? [];
})

watch(messages, (newValue) => {
  localStorage.setItem(LSKey, JSON.stringify(newValue));
}, {deep: true})

</script>

<template>
  <div class="chat-bot bg-white pa-10 rounded-lg">
    <v-btn
        height="45px"
        elevation="0"
        class="v-btn--soft-red d-flex ml-auto rounded-lg no-uppercase mb-5"
        style="color: #CB1520; font-size: 16px;"
        :disabled="messages.length < 2"
        @click="clearLS"
    >
      {{ $t('support.ClearHistory') }}
      <svg
          data-src="/img/icons/trash-can.svg"
          color="#CB1520"
          class="ml-2"
      />
    </v-btn>

    <div class="chat-bot__msgs">
      <div
          v-if="isRequestLoading('askQuestion')"
          class="chat-bot__msg chat-bot__msg--bot"
      >
        <Vue3Lottie
            :animationData="robotJSON"
            :autoPlay="true"
            class="chat-bot__msg__robot-icon"
        />

        <div class="loader-chat align-self-end">
          <div
              v-for="i in 4"
              :key="i"
          />
        </div>
      </div>

      <div
          v-if="!messages.length"
          class="chat-bot__msg chat-bot__msg--bot"
      >
        <Vue3Lottie
            :animationData="robotJSON"
            :autoPlay="true"
            class="chat-bot__msg__robot-icon"
        />

        <div class="chat-bot__msg__text">
          {{ $t('support.Hello-I-am-Robot-Max-Write-the-name-of-the-service-or-department') }}
        </div>
      </div>

      <div
          v-if="messages.length"
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-bot__msg', {
            'chat-bot__msg--bot': msg.isBot
          }]"
      >
        <Vue3Lottie
            v-if="msg?.isBot"
            :animationData="robotJSON"
            :autoPlay="true"
            class="chat-bot__msg__robot-icon"
        />

        <div class="chat-bot__msg__text">
          {{ msg.text }}
        </div>

        <div
            v-if="!msg.isBot"
            class="chat-bot__msg__person"
        >
          <svg
              data-src="/img/avatars/chat-person.svg"
              class="chat-bot__msg__person__svg"
          />
        </div>
      </div>
    </div>
    <div class="chat-bot__input-field">
      <AppChatInput
          v-model="question"
          :placeholder="$t('main.enterRequest') + '...'"
          class="mt-10"
          @send="askQuestion"
      />
    </div>
  </div>
</template>

<style lang="scss">
.chat-bot {
  &__input-field {
    margin-top: 40px;
    border-top: 1px solid #CCD6EC;
  }

  &__msgs {
    display: flex;
    flex-direction: column-reverse;
    max-height: calc(100vh - 56px - 60px - 280px);
    overflow-y: auto;
    margin-right: -15px;
    padding-right: 15px;
  }

  &__msg {
    display: flex;
    width: fit-content;
    max-width: 50%;
    margin-left: auto;

    &__robot-icon {
      min-width: 96px;
      max-width: 96px;
      margin-right: 20px;
    }

    &__text {
      height: fit-content;
      padding: 15px;
      white-space: pre-line;
      border-radius: 15px 15px 0 15px;
      background-color: #F4F6FA;
      font-size: 20px;
      font-weight: 400;
      line-height: 25px;
      color: $black-color;
      margin-top: 2px;
    }

    &__person {
      min-width: 60px;
      max-width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: $light-gray;
      margin-left: 20px;

      &__svg {
        width: 14px;
        height: 19px;
      }
    }

    &--bot {
      margin-left: unset;

      .chat-bot__msg__text {
        background-color: $blue-color;
        color: #fff;
        border-radius: 15px 15px 15px 0;
        margin-top: 15px;
      }
    }

    & + & {
      margin-bottom: 15px;
    }
  }
}

$background-color_1: #f1f5f9;
$background-color_2: #c0c0c0;

@-webkit-keyframes chat-loader1 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes chat-loader1 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@-webkit-keyframes chat-loader3 {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@keyframes chat-loader3 {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@-webkit-keyframes chat-loader2 {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  100% {
    -webkit-transform: translate(24px, 0);
    transform: translate(24px, 0);
  }
}
@keyframes chat-loader2 {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  100% {
    -webkit-transform: translate(24px, 0);
    transform: translate(24px, 0);
  }
}
.loader-chat {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 75px;
  height: 32px;
  min-height: 32px;
  border-radius: 15px;
  background-color: $background-color_1;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  div {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: $background-color_2;
    -webkit-animation-timing-function: cubic-bezier(0, 1, 1, 0);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 8px;
      -webkit-animation: chat-loader1 0.6s infinite;
      animation: chat-loader1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 8px;
      -webkit-animation: chat-loader2 0.6s infinite;
      animation: chat-loader2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 32px;
      -webkit-animation: chat-loader2 0.6s infinite;
      animation: chat-loader2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 56px;
      -webkit-animation: chat-loader3 0.6s infinite;
      animation: chat-loader3 0.6s infinite;
    }
  }
}
</style>