<script
    setup
    lang="ts"
>
import { computed, ref, watch } from "vue";
import {useI18n} from "vue-i18n";

type PropsType = {
  modelValue: string
  placeholder?: string
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue', 'send']);
const {t} = useI18n();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

function textAreaAdjust(element: HTMLTextAreaElement) {
  const match = /\r|\n/.exec(computedModelValue.value);
  if (match) {
    const splitted = match.input.split('\n');

    switch (splitted.length) {
      case 2:
        return element.style.height = "48px";
      case 3:
        return element.style.height = "72px";
      case 4:
        return element.style.height = "96px";
    }
  } else {
    element.style.height = "24px";
  }
}

function newLine() {
  computedModelValue.value += '\r\n'
}

watch(computedModelValue, () => {
  textAreaAdjust(textareaRef.value!)
})

const unWatch = watch(() => textareaRef.value, (newValue) => {
  if(newValue) {
    newValue.focus();
    unWatch();
  }
})
</script>

<template>
  <div
      class="app-chat-input"
      @click="textareaRef?.focus()"
  >
    <textarea
        ref="textareaRef"
        v-model="computedModelValue"
        :placeholder="placeholder ?? t('main.enter') + '...'"
        class="app-chat-input__textarea"
        @keydown.ctrl.enter.prevent="newLine"
        @keydown.enter.prevent="($event.metaKey || $event.shiftKey) ? newLine() : emit('send')"
    />

    <div class="app-chat-input__append">
      <button
          class="app-chat-input__btn"
          @click="emit('send')"
      >
        <svg
            data-src="/img/icons/textarea-send.svg"
            color="#2988F5"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.app-chat-input {
  width: 100%;
  border: 1px solid #CCD6EC;
  border-radius: 30px;
  display: flex;
  align-items: center;
  cursor: text;

  &__textarea {
    width: 100%;
    height: 24px;
    resize: none;
    margin: 15px;
    cursor: auto;

    &:focus {
      outline: none;
    }

    &::-webkit-scrollbar {
      display: block;
      width: 6px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $soft-black;
      border-radius: 5px;
    }
  }

  &__append {
    padding-right: 15px;
    display: flex;
    align-items: center;
    align-self: stretch;
    cursor: default;
  }

  &__btn {
    display: flex;
  }
}
</style>