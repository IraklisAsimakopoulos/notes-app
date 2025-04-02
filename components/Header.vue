<template>
  <div class="px-[24px] py-[10px] h-[79px] flex items-center">
    <div
      class="border-[2px] border-[#0A0C11] text-[#0A0C11] text-[22px] leading-[32px] font-[900] px-[13px] py-[3px] w-[173px] rounded-[8px]"
    >
      {{ title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Test project",
  },
});
</script>
