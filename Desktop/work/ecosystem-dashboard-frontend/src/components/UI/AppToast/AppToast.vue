<script setup lang="ts">
import useToast from "./useToast";

const {items} = useToast();

function mouseOver(e: { target: HTMLInputElement }) {
  e.target.setAttribute('isHovered', '1')
}

function mouseLeave(e: { target: HTMLInputElement }) {
  e.target.setAttribute('isHovered', '0')
}
</script>

<template>
  <div class="app-toast">
    <div class="app-toast__items">
      <div
        v-for="item in items"
        :id="item.id"
        :key="item.index"
        :class="['app-toast__item', `app-toast__item--${item.type}`]"
        @mouseover="mouseOver"
        @mouseleave="mouseLeave"
      >
        {{ item.text }} {{item.index}}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-toast {
  position: fixed;
  right: 15px;
  top: 60px;
  width: fit-content;
  height: fit-content;
  z-index: 99999;

  &__items {
    display: flex;
    flex-direction: column;
  }

  &__item {
    min-width: 200px;
    padding: 5px 15px 4px;
    border-radius: 5px;
    margin: 5px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    &--success {
      background-color: $soft-green;
    }

    &--error {
      background-color: $soft-red;
    }
  }
}
</style>