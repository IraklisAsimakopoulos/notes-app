<template>
  <div class="flex justify-between">
    <span class="text-[#141414] text-[22px] font-bold leading-[32px]">{{
      title
    }}</span>
    <div class="flex gap-[16px]">
      <FilterButton :onChange="onChange" />
      <Button @click="handleToggleForm" icon="add">Add New</Button>
    </div>
  </div>
  <NoteForm :open="isOpen" :onClose="handleCloseForm" />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Title",
  },
  onChange: {
    type: [Function, null],
    default: null,
  },
});

const isOpen = ref(false);

const handleCloseForm = () => {
  isOpen.value = false;
};

const handleToggleForm = () => {
  isOpen.value = !isOpen.value;
};
</script>
