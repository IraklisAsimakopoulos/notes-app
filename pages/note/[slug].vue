<template>
  <div class="min-h-screen bg-[#F8F8F8] p-[48px]">
    <div
      v-if="note"
      class="max-w-[900px] mx-auto bg-[#ffffff] p-[48px] rounded-[16px] shadow-[0_4px_4px_-4px_#0C0C0D0D,0_16px_32px_-4px_#0C0C0D1A] flex flex-col"
    >
      <h1 class="text-3xl font-bold text-[#070707] mb-4">{{ note.title }}</h1>
      <p class="text-[#070707] mb-6">{{ note.description }}</p>
      <div v-if="note.cardType === '2' && note.image" class="mb-6">
        <img
          :src="note.image"
          alt="Note Image"
          class="w-full h-auto rounded-md shadow-sm"
        />
      </div>
      <div
        v-if="note.cardType === '3' && note.options"
        class="mb-6 max-w-[500px]"
      >
        <h2 class="text-xl font-semibold text-[#070707] mb-3">Options:</h2>
        <div class="space-y-2">
          <label
            v-for="(option, index) in note.options"
            :key="index"
            class="flex items-center gap-2 cursor-pointer p-2 leading-4 hover:bg-[#007AFF26] rounded-md"
          >
            <input
              type="checkbox"
              class="hidden peer"
              :checked="option.checked"
              @change="toggleOption(index)"
            />
            <Icon
              icon-name="check_box_outline_blank"
              size="22"
              class="text-[#7D7D7D] peer-checked:hidden"
            />
            <Icon
              size="22"
              icon-name="check_box"
              class="hidden text-[#007AFF] peer-checked:block"
            />
            <span class="text-[#070707]">{{ option.text }}</span>
          </label>
        </div>
      </div>
      <div class="flex justify-between">
        <Button @click="handleOpenForm" class="w-[200px]"> Edit Note </Button>
        <Button
          @click="isDeleteDialogOpen = true"
          class="w-[200px] !bg-[#FF3B30]"
        >
          Delete Note
        </Button>
      </div>
    </div>
    <div v-else-if="loading" class="text-center text-[#070707] mt-20">
      <p>Loading note...</p>
    </div>
    <div
      v-else
      class="text-center text-red-500 mt-[300px] flex flex-col gap-[32px] max-w-[400px] mx-auto items-center"
    >
      <p class="text-[60px]">404 error</p>
      <p>Note not found.</p>
      <p>Please check the URL or return to the home page.</p>
      <Button @click="handleRedirect" class="max-w-[100px]">Go home</Button>
    </div>

    <NoteForm
      :open="isFormOpen"
      :onClose="handleCloseForm"
      :defaultValues="note"
    />

    <ConfirmationDialog
      :isOpen="isDeleteDialogOpen"
      @update:isOpen="isDeleteDialogOpen = $event"
      :onAccept="handleDeleteNote"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../store/useNotesStore";

const { slug } = useRoute().params;
const notesStore = useNotesStore();

const loading = ref(true);
const isFormOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const router = useRouter();

onMounted(() => {
  if (!notesStore.notes.length) {
    notesStore.initializeNotes();
  }
  loading.value = false;
});

const note = computed(() => {
  const tempNote = notesStore.getNoteBySlug(slug);
  if (tempNote) {
    return {
      ...tempNote,
      options: tempNote.options?.map((option) => option),
    };
  } else {
    return null;
  }
});

const toggleOption = (index) => {
  notesStore.toggleOptionChecked(note.value.id, index);
};

const handleDeleteNote = () => {
  notesStore.deleteNote(note.value.id);
  isDeleteDialogOpen.value = false;
  router.push({ name: "index" });
};
const handleOpenForm = () => {
  isFormOpen.value = true;
};

const handleCloseForm = () => {
  isFormOpen.value = false;
};

const handleRedirect = () => {
  router.push({ name: "index" });
};
</script>
