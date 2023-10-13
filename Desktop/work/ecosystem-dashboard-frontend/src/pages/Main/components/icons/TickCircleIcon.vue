<template>
  <svg
      data-src="/img/icons/tick-circle.svg"
      :class="['menu-content__item__tick', 'menu-content__item__tick--active']"
  />
<!--   :class="['menu-content__item__tick', {
        'menu-content__item__tick--active': work.company_tin === CommonStore.selectedJob
      }]"-->
</template>

<script>
export default {
  name: "ChevronBottomIcon",
}
</script>