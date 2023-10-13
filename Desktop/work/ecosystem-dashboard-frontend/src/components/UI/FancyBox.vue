<script setup lang="ts">
import {Fancybox} from "@fancyapps/ui";
import {ref, onMounted, onUpdated, onUnmounted} from "vue";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {useAuthStore} from "@/store/Auth";

const myFancyBox = ref("");

const authStore = useAuthStore();

const emit = defineEmits(['isClosed', 'isViewed']);

const props = defineProps({
  options: {type: Object, required: true},
  view: {type: Boolean, required: false},
  videoId: {type: Number, required: false}
})

onMounted(() => {
  Fancybox.bind(myFancyBox.value, "[data-fancybox]", {
    ...(props.options || {}),
    on: {
      close: () => {
        emit('isClosed', true);
      },

      done: () => {
        setTimeout(() => {
          emit('isViewed', true);
        }, 3000);

        if (!props.view) {
          authStore.getAuthInfo()
              .then(res => {
                return;
              })
              .catch(err => {
                console.log("Not User", err);
              })
        }
      }
    }
  });
})

onUpdated(() => {
  Fancybox.unbind(myFancyBox.value);
  Fancybox.close();
  Fancybox.bind(myFancyBox.value, "[data-fancybox]", {
    ...(props.options || {}),
    on: {
      close: () => {
        emit("isClosed", true);
      },

      done: () => {
        setTimeout(() => {
          emit('isViewed', true);
        }, 3000);

        if (!props.view) {
          authStore.getAuthInfo()
              .then(res => {
                return;
              })
              .catch(err => {
                console.log("Not User", err);
              })
        }
      }
    }
  })
});

onUnmounted(()=> {
  Fancybox.destroy();
})

</script>

<template>
  <div ref="myFancyBox">
    <slot></slot>
  </div>
</template>