<template>
  <svg
      data-src="/img/icons/chevron-bottom.svg"
      style="color: #373B55; transition: transform .3s"
      :class="[{'rotate-180-on-active' : isActive}, 'ml-2', 'align-self-center']"
  />
</template>

<script>
export default {
  name: "ChevronBottomIcon",
}
</script>