<template>
  <div class="min-h-[100vh] bg-[#F8F8F8] h-min">
    <div class="max-w-[1440px] mx-auto">
      <Header />
      <div
        class="p-[24px] pt-[16px] min-h-[calc(100vh-79px)] flex flex-col gap-[22px]"
      >
        <ActionBar :onChange="onChange" />
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <NuxtLink
            v-for="note in filteredNotes"
            :key="note.id"
            :to="`/note/${note.slug}`"
          >
            <NoteCard
              :title="note.title"
              :description="note.description"
              :type="note.cardType"
              :image="note.image"
              :options="note.options"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotesStore } from "../store/useNotesStore";

const notesStore = useNotesStore();
const typesRef = ref("1,2,3");

const onChange = (newValue) => {
  typesRef.value = newValue || "";
};

onMounted(() => {
  notesStore.initializeNotes();
});

const filteredNotes = computed(() =>
  notesStore.getNotesByTypes(typesRef.value)
);
</script>
