<script setup lang="ts">
defineProps({
  items: Array,
  md: [Number,String],
})

async function itemClicked(item:any) {
  if(!item.onClick) return;

  item.isRequestPending = true;

  await item.onClick()
      .finally(() => {
        item.isRequestPending = false;
      });
}
</script>

<template>
  <v-row class="service-items">
    <v-col
        v-for="(item, index) in items"
        :key="index"
        :md="md"
    >
      <v-btn
          elevation="0"
          class="service-item"
          :loading="item.isRequestPending"
          @click="itemClicked(item)"
      >
        <div class="service-item__icon">
          <img
              :src="item.icon"
              alt=""
          />
        </div>

        <div class="service-item__title">{{ item.title }}</div>

        <v-icon
            icon="mdi-chevron-right"
            color="#718193"
            class="ml-auto"
        />
      </v-btn>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.service-items {
  .v-col {
    &:nth-child(2) .service-item__icon {
      background-color: $soft-green;
    }

    &:nth-child(3) .service-item__icon {
      background-color: $yellow;
    }

    &:nth-child(4) .service-item__icon {
      background-color: $soft-red;
    }
  }
}

.service-item {
  width: 100%;
  height: unset!important;
  background-color: #fff;
  display: flex;
  align-items: center;
  border: 1px solid #E8EEF3;
  border-radius: 10px;
  padding: 15px 20px!important;

  &__icon {
    min-width: 44px;
    max-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #8679F2;
    margin-right: 15px;
  }

  &__title {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: $black-color;
    margin-right: 15px;
    text-transform: none;
    white-space: normal;
    text-align: left;
  }
}
</style>