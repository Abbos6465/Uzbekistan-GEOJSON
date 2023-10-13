<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";

const props = defineProps(['rate']);

const emit = defineEmits(['rateChange']);

const rateBase = ref(0);

onMounted(()=> {
})

watch(()=> {
  rateBase.value
  {
    emit('rateChange', rateBase.value);
  }
})

</script>

<template>
  <div class="rating-stars">
    <input type="radio" id="rating_star-5" name="rating" value="5" v-model="rateBase" />
    <label for="rating_star-5">5</label>
    <input type="radio" id="rating_star-4" name="rating" value="4" v-model="rateBase" />
    <label for="rating_star-4">4</label>
    <input type="radio" id="rating_star-3" name="rating" value="3" v-model="rateBase" />
    <label for="rating_star-3">3</label>
    <input type="radio" id="rating_star-2" name="rating" value="2" v-model="rateBase" />
    <label for="rating_star-2">2</label>
    <input type="radio" id="rating_star-1" name="rating" value="1" v-model="rateBase" />
    <label for="rating_star-1">1</label>
    <input class="rating-stars-clear" type="radio" id="rating_star-0" name="rating" value="0" v-model="rateBase" />
    <label for="rating_star-0">0</label>
  </div>
</template>

<style lang="scss">
.rating-stars {
  display: flex;
  align-items: center;
  font-size: 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  unicode-bidi: bidi-override;
  gap: 13px;
  direction: rtl;
}

.rating-stars * {
  font-size: 47px;
}

.rating-stars > input {
  display: none;
}

.rating-stars > input + label {
  display: inline-block;
  overflow: hidden;
  text-indent: 9999px;
  width: 1em;
  white-space: nowrap;
  cursor: pointer;
}

.rating-stars > input + label:before {
  display: inline-block;
  text-indent: -9999px;
  content: '☆';
  color: #888;
}

.rating-stars > input:checked ~ label:before,
.rating-stars > input + label:hover ~ label:before,
.rating-stars > input + label:hover:before {
  content: '★';
  color: #edac46;
  text-shadow: 0 0 1px #fff;
}

.rating-stars > .rating-stars-clear + label {
  text-indent: -9999px;
  width: 0.5em;
  margin-left: -0.5em;
}

.rating-stars > .rating-stars-clear + label:before {
  width: 0.5em;
}

.rating-stars:hover > input + label:before {
  content: '☆';
  color: #888;
  text-shadow: none;
}

.rating-stars:hover > input + label:hover ~ label:before,
.rating-stars:hover > input + label:hover:before {
  content: '★';
  color: #edac46;
  text-shadow: 0 0 1px #fff;
}
</style>