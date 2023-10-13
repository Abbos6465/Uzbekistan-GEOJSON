<template>
  <svg :data-src="src"/>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    src: {
      type: String,
      default: ''
    },
  }
}
</script>