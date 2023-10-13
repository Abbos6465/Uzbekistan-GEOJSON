<script
    setup
    lang="ts"
>
import { computed, onMounted, ref, useSlots, watch } from "vue";
import { generateRandomID } from "@/utils/helper";
import useLoading from "@/composables/useLoading";

type PropsType = {
  modelValue?: File | FileList | string | null | ArrayBuffer
  value?: string | null
  type?: 'string' | 'file'
  placeholder?: string
  label?: string
  multiple?: boolean
  uploadFn?: Function
  required?: boolean
  hasError?: string[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const { changeIsRequestLoading, isRequestLoading } = useLoading();

const randomID = generateRandomID();
const fileImage = ref<string | null | ArrayBuffer>(null);

const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

async function uploadImage(e: Event) {
  let files = (<HTMLInputElement>e.target).files;

  if (!files?.length) return;

  if (props.multiple) computedModelValue.value = files;

  if (props.type !== 'string') {
    computedModelValue.value = files[0];
  }

  if (props.uploadFn) {
    const formData = new FormData();
    formData.append('file', files[0]);

    changeIsRequestLoading('uploadImage', true);
    await props
        .uploadFn(formData)
        .then(() => {
          readImage(files[0]);
        })
        .finally(() => {
          changeIsRequestLoading('uploadImage', false);
        })
  }
}

function clearImage() {
  computedModelValue.value = null;
  fileImage.value = null
}

function readImage(item: string | File) {
  if (File.prototype.isPrototypeOf(item)) {
    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      fileImage.value = reader.result;
      if (props.type === 'string') computedModelValue.value = reader.result;
    })

    reader.readAsDataURL(item)
  } else if (typeof item === 'string') {
    fileImage.value = item
  }
}

onMounted(() => {
  if (typeof props.value === 'string') fileImage.value = props.value
});

watch(() => props.value, () => {
  if (typeof props.value === 'string') fileImage.value = props.value
})

</script>

<template>
  <div :class="['image-uploader', {
    'image-uploader--has-error': Array.isArray(hasError) ? hasError?.length : hasError
  }]">
    <label
        v-if="slots.label || label"
        :for="randomID"
        class="image-uploader__label"
    >
      <slot
          v-if="slots.label"
          name="label"
      />

      <template v-else>{{ label }}</template>

      <span
          v-if="required"
          class="ml-1"
      >
        *
      </span>
    </label>

    <input
        :id="randomID"
        :multiple="multiple"
        type="file"
        accept="image/*"
        class="image-uploader__input"
        @change="uploadImage"
    />

    <div
        v-if="fileImage"
        class="image-uploader__handler"
    >
      <v-progress-circular
          v-if="isRequestLoading('uploadImage')"
          indeterminate
          color="#2988F5"
          class="position-absolute"
      />
      <img
          v-else
          :src="fileImage"
          alt=""
          class="image-uploader__image"
      />

      <v-btn
          icon
          size="25px"
          class="image-uploader__handler__close"
          @click="clearImage"
      >
        <v-icon
            icon="mdi-close"
            color="#000"
            size="15px"
        />
      </v-btn>
    </div>
    <label
        v-else
        :for="randomID"
        class="image-uploader__handler"
        tabindex="0"
    >
      <span class="image-uploader__handler__wrap">
        <v-progress-circular
            v-if="isRequestLoading('uploadImage')"
            indeterminate
            color="#2988F5"
            class="position-absolute"
        />

        <template v-else>
          <svg
              data-src="/img/icons/photo-plus.svg"
              class="image-uploader__handler__icon"
          />
        <span class="image-uploader__handler__title">{{ $t('UI.uploadPhoto') }}</span>
        </template>
      </span>
    </label>
  </div>
</template>

<style lang="scss">
.image-uploader {
  position: relative;

  &__label {
    width: fit-content;
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;
    color: $black-color;
    margin-bottom: 12px;
    cursor: pointer;
  }

  &__input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    visibility: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }

  &__handler {
    width: 135px;
    height: 143px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    outline: 2px dashed #C5D0DD;
    position: relative;

    &__wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: $light-gray;
      border-radius: 10px;
      cursor: pointer;
    }

    &__close {
      position: absolute !important;
      right: -10px;
      top: -10px;
      border-radius: 50%;
      padding: 0 !important;
    }

    &__icon {
      color: $soft-black;
      margin-bottom: 10px;
    }

    &__title {
      color: $soft-black;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
    }
  }

  &--has-error {
    .image-uploader__handler {
      outline-color: $soft-red;
    }
  }
}
</style>