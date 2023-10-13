<script setup lang="ts">
import {onMounted,ref} from "vue";

const props = defineProps(["rate","imgClassName","textClassName"])

// {
//   rate: {type: [Number,String], required: true},
//   imgClassName: {type: String, required: false},
//   textClassName: {type: String, required: false}
// }

onMounted(()=> {
})

</script>

<template>
  <div class="stars" v-if="props.rate">
    <div class="stars__imgs">
      <img v-for="n in Math.floor(Number(props.rate))" src="/img/icons/active-star.svg" alt="" :class="imgClassName ?? 'rate_img'">
      <img v-for="n in (5-Math.floor(Number(props.rate)))" src="/img/icons/star.svg" alt="" :class="imgClassName ?? 'rate_img'">
    </div>
    <span class="rate_num" :class="textClassName ?? ''">
      {{ props.rate }}
    </span>
  </div>
</template>

<style lang="scss">
.stars {
  display: flex;
  align-items: end;
  gap: 10px;

  &__imgs {
    display: flex;
    align-items: center;
    gap: 10px;

    .rate-img{
      width: 20px;
      height: 20px;
    }

  }

  .rate_num {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: -5px;
  }

  .kitchen-rate{

    &__img{
      width: 18px;
      height: 18px;
    }

    &__text{
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>