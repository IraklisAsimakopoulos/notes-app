<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-white p-[24px] rounded-[16px] shadow-[0_4px_4px_-4px_#0C0C0D0D,0_16px_32px_-4px_#0C0C0D1A] max-w-sm w-full"
    >
      <h2 class="text-lg font-semibold mb-4">Are you sure?</h2>
      <div class="flex justify-end gap-[16px]">
        <Button @click="closeDialog" class="bg-gray-500 hover:bg-gray-600">
          Close
        </Button>
        <Button @click="accept" class="!px-[16px]"> Yes </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  onAccept: Function,
});

const emit = defineEmits(["update:isOpen"]);

const closeDialog = () => {
  emit("update:isOpen", false);
};

const accept = () => {
  if (typeof props.onAccept === "function") {
    props.onAccept();
  }
  closeDialog();
};
</script>
