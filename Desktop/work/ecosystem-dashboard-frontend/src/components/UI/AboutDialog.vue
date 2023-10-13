<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, useSlots, watch} from "vue";


const props = defineProps(["aboutWidth", "modelValue"])

const emit = defineEmits(['update:modelValue', 'close']);
const slots = useSlots();
const content = ref(null);
const contentHeight = ref(null);
const offsetTop = ref(0);
const width = ref(0);
const rect = ref({});

function scrollHiddenHandler() {
  const html = document.querySelector('html');
  if (computedModelValue.value) {
    offsetTop.value = content.value.getBoundingClientRect().top;
    content.value.scrollIntoView({behavior: 'smooth', block: 'center'});
    // html.classList.add('html-hidden');
  } else {
    html.classList.remove('html-hidden');
  }
}

function handleResize() {
  let leftContentWidth = content.value.getBoundingClientRect().left;
  let innerWidth = window.innerWidth
  if(innerWidth> 2400){
    innerWidth = 2400;
    leftContentWidth = 80;
  }

  let contentWidth = getComputedStyle(content.value).getPropertyValue('width');
  const height = getComputedStyle(content.value).getPropertyValue('height');
  contentHeight.value = height;
  contentWidth = Number(contentWidth.slice(0,contentWidth.length - 2));
  width.value = innerWidth -  contentWidth - leftContentWidth - 150;
}


const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    if (!newValue) emit('close');
    emit('update:modelValue', newValue);
  }
})
watch(computedModelValue, () => {
  scrollHiddenHandler();
  handleResize();
}, {deep: true});

onMounted(()=>{
  window.addEventListener('resize', handleResize);
})

onUnmounted(()=>{
  window.removeEventListener('resize', handleResize);
})

</script>

<template>
  <div :class="modelValue ? 'about-overly v-overlay__scrim' : ''" @click="computedModelValue = false">
  </div>
  <div
      class="position-relative w-100 h-100"
      :style="{'min-height': contentHeight, 'top': offsetTop}"
  >
    <div :class="modelValue ? 'about-show' : 'w-100 h-100'">

      <div
          ref="content"
          class="w-100 h-100"
      >
        <slot/>
      </div>

      <div
          class="about-title"
          :style="{'right': -(width+40) + 'px'}"
          v-if="modelValue"
      >
        <div class="about-dialog">

          <v-btn
              class="dialog__outside_close-btn dialog__close-btn rounded-lg pa-0"
              icon
              width="40px"
              height="40px"
              elevation="0"
              style="background-color: #F1F5F9"
              @click="computedModelValue = false"
          >
            <v-icon
                icon="mdi-close"
                color="white"
                size="20px"
            />
          </v-btn>
          <v-card class="rounded-lg" :width="width" :style="{'max-width': aboutWidth}">
            <div class="px-5 pt-5 pb-9">
              <div class="block-title--20">
                <slot name="about"/>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.about-dialog {
  position: relative;

  &:before {
    left: -30px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    content: "";
    border-bottom: 22px solid transparent;
    border-top: 22px solid transparent;
    border-right: 30px solid #FFF;
  }
}

.about-show {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2400;

  .about-title {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2500;
  }
}

.about-overly {
  z-index: 2000;
  height: 100%;
}

.html-hidden {
  position: fixed;
  top: 86px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>