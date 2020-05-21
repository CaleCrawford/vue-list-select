<template>
  <span :class="$style.listItemText">{{ item }}</span>
</template>

<script>
/**
 * The only true button.
 * @displayName Item
 */
export default {
  name: 'Item',
  props: {
    item: {
      required: true,
      type: String,
    },
  },
}
</script>

<style module>
.listItemText {
  width: calc(100% - 0.5rem);
  display: inline-block;
}
</style>
