<script setup>
const props = defineProps({
  iconName: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "16",
  },
});
</script>

<template>
  <i class="material-icons" :style="{ fontSize: size + 'px' }">
    {{ iconName }}
  </i>
</template>
