<script
    lang="ts"
    setup
>
import "external-svg-loader";
import { BreadCrumbs } from "@/components/UI";
import { Header, NavDrawer } from "@/components/Layout";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/Auth";
import AppToast from "@/components/UI/AppToast/AppToast.vue";
import useLoading from "@/composables/useLoading";
import CommonApi from "@/api/commonApi";
import type { NotificationsType, TotalStatsType } from "@/types";
import { useCommonStore } from "@/store/Common";
import ChatRobotIcon from "@/pages/Main/components/icons/ChatRobotIcon.vue";

import { initializeApp } from "firebase/app";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import useToast from "@/components/UI/AppToast/useToast";

const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const route = useRoute();
const { t, locale } = useI18n();
const { toast } = useToast();
const { changeIsRequestLoading, isRequestLoading } = useLoading();

const totalStats = ref<TotalStatsType | null>(null);

const firebaseConfig = {
  apiKey: "AIzaSyBuhLRqY00ab8CqVGuFOqTj8tmTIc7KPlo",
  authDomain: "testy-6e622.firebaseapp.com",
  projectId: "testy-6e622",
  storageBucket: "testy-6e622.appspot.com",
  messagingSenderId: "415640811508",
  appId: "1:415640811508:web:761b268ecaf78376e52ba1",
  measurementId: "G-FBNWZXMQXX"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();


onMessage(messaging, (payload) => {
  const id = +payload.data!['gcm.notification.id'];
  const title = JSON.parse(payload.notification?.title!)[locale.value];
  const description = JSON.parse(payload.notification?.body!)[locale.value];

  const newNotify: NotificationsType = {
    id,
    title,
    description,
    is_read: false
  }

  CommonStore.notifications.list.unshift(newNotify);
  toast.success(title);
});

function setTitle() {
  document.title = route.meta.title ? t(route.meta.title) : 'Davlat xizmatlari';
}

if (route.query.token) {
  localStorage.setItem('accessToken', 'Bearer ' + String(route.query.token));
  window.location.href = '/';
}

onMounted(async () => {
  if (route.query.code) {
    await AuthStore.signIn(`${ route.query.code }`);
  }
  if (localStorage.getItem('accessToken')) {
    getToken(messaging)
        .then(async (currentToken) => {
          await CommonApi.postFCMTokenApi(currentToken);
        })
        .catch((err) => {
          console.log("error ", err);
        });

    AuthStore.getAuthInfo()
        .then(() => {
          Promise.all([
            CommonStore.getProfilePhoto(),
            CommonStore.getNotifications(),
            CommonApi.getTotalStatsApi().then((data) => { totalStats.value = data })
          ]);

          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          } else if (Notification.permission === "granted") {

          } else if (Notification.permission !== "denied") {
            Notification.requestPermission()
          }
        })
  }
})

watch(() => route.meta.title, () => {
  setTitle();
})
</script>

<template>
  <v-app elevation="0">
    <v-layout full-height>
      <NavDrawer :totalStats="totalStats"/>

      <Header/>

      <v-main class="app__main">

        <v-progress-linear
            v-if="isRequestLoading('getAuthInfo')"
            indeterminate
            color="#2988F5"
            style="z-index: 999"
        />

        <v-container
            v-else-if="AuthStore.authInfo"
            class="app__main__container"
        >
          <BreadCrumbs/>

          <router-view :key="1"/>
        </v-container>

      </v-main>
    </v-layout>

    <v-btn
        width="70px"
        height="70px"
        small
        icon
        class="app__fixed-chat-btn"
        :to="{ name: 'ChatBot' }"
    >
      <chat-robot-icon />
    </v-btn>

    <app-toast/>
  </v-app>
</template>

<style lang="scss">
.app {
  &__main {
    background-color: #F1F5F9;
    min-height: 100vh;

    &__container.v-container {
      padding-top: 30px;
      padding-left: 30px;
      padding-right: 90px;
    }
  }

  &__fixed-chat-btn {
    position: fixed;
    right: 15px;
    bottom: 15px;
    box-shadow: 0 27px 35px 0 rgba(55, 59, 85, 0.20) !important;
    z-index: 999;

    .v-btn__overlay {
      opacity: 0 !important;
    }

    &__svg {
      width: 36px;
      height: 28px;
    }
  }
}
</style>