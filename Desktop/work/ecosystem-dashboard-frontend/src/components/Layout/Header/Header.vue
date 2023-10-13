<script setup lang="ts">
import { changeI18nLang } from "@/i18n";
import {computed, onMounted, reactive, ref} from "vue";
import { RightDialog } from "@/components/Composite";
import HeaderChatDialog from "./HeaderChatDialog.vue";
import { useAuthStore } from "@/store/Auth";
import { useCommonStore } from "@/store/Common";
import { useRoute } from "vue-router";
import useLoading from "@/composables/useLoading";
import NotificationDialog from "@/components/Composite/NotificationDialog.vue";

const route = useRoute();
const AuthStore = useAuthStore();
const CommonStore = useCommonStore();
const {isRequestLoading} = useLoading();

const activeLang = ref(localStorage.getItem('lang') ?? 'uz');
const langs = {
  uz: {
    title: "O'zbek",
    icon: '/img/flags/uz.svg'
  },
  ru: {
    title: "Русский",
    icon: '/img/flags/ru.svg'
  }
};
const isNotificationDialogOpen = ref(false);
const isChatDialogOpen = ref(false);
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
        text: 'Last message',
        isOwnMessage: true
      }
    ]
  },
  {
    id: 2,
    sender: {
      name: 'Eshmat Toshmat o\'g\'li',
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

const computedOneIDUrl = computed(() => {
  const oneIDUrl = import.meta.env.VITE_AUTH_ONEID_URL;
  if(!oneIDUrl) return '';

  return oneIDUrl.replace('{baseUrl}', encodeURIComponent(document.URL))
})

function changeLang(lang: string) {
  activeLang.value = lang;
  localStorage.setItem('lang', lang);
  window.__localeId__ = activeLang.value;
  changeI18nLang(lang);
  location.reload();
}

window.__localeId__ = activeLang.value;

</script>

<template>
  <v-app-bar
      height="56"
      style="box-shadow: 0 4px 9px rgba(0, 0, 0, 0.05); position: fixed"
  >
    <v-container class="header__container">
      <div class="d-flex align-center">
        <div class="mr-auto">
          {{ $route.meta.title ? $t($route.meta.title) : '' }}
        </div>
<!--        <v-menu>-->
<!--          <template v-slot:activator="{ props }">-->
<!--            <v-btn-->
<!--                v-bind="props"-->
<!--                small-->
<!--                icon-->
<!--                class="ml-4"-->
<!--            >-->
<!--              <img-->
<!--                  src="/img/icons/menu.svg"-->
<!--                  alt=""-->
<!--              />-->
<!--            </v-btn>-->
<!--          </template>-->

<!--          <div class="menu-content">-->
<!--            <v-btn-->
<!--                v-for="(service, index) in servicesList"-->
<!--                :key="index"-->
<!--                variant="flat"-->
<!--                class="justify-start"-->
<!--                height="70px"-->
<!--                block-->
<!--            >-->
<!--              <div-->
<!--                  class="menu-content__item__icon"-->
<!--              >-->
<!--                <img-->
<!--                    :src="service.logo"-->
<!--                    alt=""-->
<!--                />-->
<!--              </div>-->

<!--              <div class="d-flex flex-column w-100">-->
<!--                <div class="menu-content__item__title">{{ service.title }}</div>-->
<!--                <div class="menu-content__item__subtitle">{{ service.desc }}</div>-->
<!--              </div>-->
<!--            </v-btn>-->
<!--          </div>-->
<!--        </v-menu>-->

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                small
                icon
                class="ml-2"
                @click="isNotificationDialogOpen = true"
            >
              <v-icon
                  icon="mdi-bell-outline"
                  color="#373B55"
              />

              <span
                  v-if="CommonStore.notifications.list.length"
                  class="red-badge"
              >
                {{ CommonStore.notifications.list.filter(i => !i.is_read).length }}
              </span>
            </v-btn>
          </template>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                small
                icon
                class="ml-2"
                @click="isChatDialogOpen = true"
            >
              <v-icon
                  icon="mdi-email-outline"
                  color="#373B55"
              />

              <span class="red-badge">
               5
             </span>
            </v-btn>
          </template>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                style="text-transform: capitalize; letter-spacing: 0"
                class="ml-3 mr-4 px-2"
            >
              <v-img
                  :src="langs[activeLang].icon"
                  width="22"
                  aspect-ratio="16/9"
                  class="mr-2"
              />
              {{ langs[activeLang].title }}
            </v-btn>
          </template>
          <v-list
              class="pa-0"
              width="100%"
          >
            <template
                v-for="(item, index) in langs"
            >
              <v-list-item
                  v-if="activeLang !== index"
                  :key="index"
                  :value="index"
                  @click="changeLang(index)"
              >
                <v-list-item-title
                    class="d-flex"
                    style="font-size: 14px"
                >
                  <v-img
                      :src="item.icon"
                      width="22"
                      class="mr-2 flex-0-0"
                  />
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

        <a
            v-if="!AuthStore.isAuth"
            :href="computedOneIDUrl"
        >
          {{ $t('header.comeIn') }}
        </a>

        <v-menu v-else>
          <template v-slot:activator="{ props }">
            <button
                v-bind="props"
                class="rounded-circle overflow-hidden pa-0"
                style="width: 50px; height: 50px"
            >
              <img
                  v-if="CommonStore?.profilePhoto"
                  :src="CommonStore.profilePhoto"
                  class="user-avatar d-flex w-100 h-100"
                  alt=""
              >
              <svg
                  v-else
                  data-src="/img/icons/user.svg"
                  class="w-100 h-100"
              />
            </button>
          </template>
          <v-list
              class="pa-0 rounded-lg"
              width="100%"
              min-width="200px"
          >
            <v-list-item
                :to="{name: 'Cabinet'}"
                min-height="40px"
                style="cursor: pointer"
            >
              <v-list-item-title>
                {{ $t('header.personalCabinet') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
                min-height="40px"
                style="cursor: pointer"
                @click="AuthStore.signOut"
            >
              <v-list-item-title class="text-red">
                {{ $t('header.comeOut') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <teleport to="body">
        <NotificationDialog
            v-model="isNotificationDialogOpen"
        />

        <HeaderChatDialog
            v-model="isChatDialogOpen"
            :chats="chats"
        />
      </teleport>
    </v-container>
  </v-app-bar>
</template>

<style lang="scss">
.header {
  &__container.v-container {
    padding-left: 30px;
    padding-right: 90px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $black-color;
  }
}

.notification-card {
  display: flex;
  padding: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color .3s;

  &__avatar {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 14px;
  }

  &__subtitle {
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: $soft-black;
    margin-bottom: 5px;
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }

  &--not-read {
    background-color: $light-gray;

    &:before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $blue-color;
      left: 8px;
      top: 37px;
    }
  }

  &:hover {
    background-color: $stroke-color;
  }
}

.rounded-circle .user-avatar {
  object-fit: contain;
}

</style>