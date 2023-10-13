<script setup lang="ts">
export type NavListLinkType = {
  title: string
  value: string
  icon?: string
  disabled?: boolean
  stats?: string | number | null
  children?: NavListLinkType[]
}

type PropsType = {
  items: NavListLinkType[]
}

defineProps<PropsType>();
</script>

<template>
  <v-list class="nav-list nav-list-tree">
    <template
        v-for="item in items"
        :key="item.value"
    >
      <v-list-item
          v-if="!item.children?.length"
          :value="item.value"
          :to="{
            name: !item.children ? item.value : ''
          }"
          height="40px"
          :class="['pl-4 nav-list-tree__item', {
            'nav-list-tree__item--active': $route.name.includes(item.value)
          }]"
          :disabled="item.disabled"
      >
        <template #prepend>
          <div class="nav-list__item__dot"/>
        </template>
        <template #title>
          <div class="nav-list-tree__item__title">{{ item.title }}</div>
        </template>
        <template #append>
          <v-icon
              v-if="item.disabled"
              icon="mdi-timer-sand"
              class="disabled-sand-icon"
          />
          <div
              v-else-if="typeof item.stats !== 'undefined'"
              class="nav-list-tree__item__stat"
          >
            {{item.stats}}
          </div>
        </template>
      </v-list-item>

      <v-list-group v-else>
        <template #activator="{props}">
          <v-list-item
              v-bind="props"
              height="40px"
          >
            <template #prepend>
              <div class="nav-list__item__dot"/>
            </template>
            <template #title>
              <div class="nav-list-tree__item__title">{{ item.title }}</div>
            </template>
          </v-list-item>
        </template>

        <div class="pl-6">
          <NavListTree :items="item.children"/>
        </div>
      </v-list-group>
    </template>
  </v-list>
</template>

<style lang="scss">
.nav-list.nav-list-tree {
  .nav-list-tree {
    &__item {
      min-height: unset!important;
      height: 40px;
      box-sizing: border-box;

      .v-list-item-title {
        white-space: unset;
      }

      &__title {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: $black-color;
      }

      .nav-list-tree__item__stat{
        padding: 5px;
        background: rgba(41, 136, 245, 0.20);
        border-radius: 98px;
        font-size: 12px;
        font-style: normal;
        display: flex;
        font-weight: 500;
        line-height: normal;
        color: #2988F5;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 18px;
        min-width: 18px;
      }

      &.v-list-item--active .v-list-item__overlay {
        background: none !important;
      }

      &--active {

        .nav-list__item__dot {
          background-color: $blue-color;
        }

        .nav-list-tree__item__title {
          color: $blue-color;
        }

        .nav-list-tree__item__icon {
          color: #{$blue-color}
        }
      }
    }
  }
}
</style>