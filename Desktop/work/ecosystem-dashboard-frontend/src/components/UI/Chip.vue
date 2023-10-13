<script
    setup
    lang="ts"
>
type PropsType = {
  icon?: string
  title: string
  removable: boolean
}

defineProps<PropsType>();
const emit = defineEmits(['remove']);
</script>

<template>
  <div class="chip">
    <div class="chip__prepend-icon">
      <template v-if="$slots.icon">
        <slot name="icon"/>
      </template>
      <img
          v-else-if="icon"
          :src="icon"
          alt=""
          style="margin-right: 10px"
      />
    </div>

    <span class="chip__title">{{ title }}</span>

    <button
        v-if="removable"
        class="ml-5"
        @click="emit('remove')"
    >
      <v-icon
          icon="mdi-close"
          size="20px"
          color="#718193"
          class="chip__close-icon"
      />
    </button>
  </div>
</template>

<style lang="scss">
.chip {
  height: 40px;
  display: flex;
  align-items: center;
  border: 1px solid #E2E2E2;
  border-radius: 10px;
  padding: 10px;
  margin: 0 15px 15px 0;

  &__prepend-icon {
    display: flex;
    margin-right: 10px;

    img {
      width: 30px;
      object-fit: contain;
    }
  }

  &__close-icon {
    transition: transform .3s;

    &:hover {
      transform: rotate(360deg);
    }
  }

  &__title {
    color: $black-color;
    font-size: 16px;
    font-weight: 400;
    line-height: normal;
    margin-bottom: -2px
  }
}
</style>