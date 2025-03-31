<script setup>
const props = defineProps({
  iconName: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "6",
  },
});
</script>

<template>
  <i :class="['material-icons', `w-${size} h-${size}`]">
    {{ iconName }}
  </i>
</template>
