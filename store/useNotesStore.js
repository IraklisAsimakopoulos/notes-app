import { defineStore } from "pinia";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
    .substring(0, 100); // Limit to 100 characters
}

function generateUniqueSlug(title, notes) {
  let baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (notes.some((note) => note.slug === slug)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [],
  }),
  actions: {
    persistToLocalStorage() {
      if (process.client) {
        localStorage.setItem("notes", JSON.stringify(this.notes));
      }
    },
    initializeNotes() {
      if (process.client) {
        const storedNotes = localStorage.getItem("notes");
        this.notes = storedNotes ? JSON.parse(storedNotes) : [];
      }
    },
    addNote(note) {
      const slug = generateUniqueSlug(note.title, this.notes);
      this.notes.push({ ...note, slug });
      this.persistToLocalStorage();
    },
    editNote(id, updatedNote) {
      const index = this.notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        const slug = generateUniqueSlug(updatedNote.title, this.notes);
        this.notes[index] = { ...updatedNote, slug };
        this.persistToLocalStorage();
      }
    },
    deleteNote(id) {
      this.notes = this.notes.filter((note) => note.id !== id);
      this.persistToLocalStorage();
    },
    getNoteBySlug(slug) {
      return this.notes.find((note) => note.slug === slug);
    },
    getNotesByTypes(typesString) {
      if (!typesString) return [];
      const types = typesString.split(",").map((type) => type.trim());
      return this.notes.filter((note) => types.includes(note.cardType));
    },
  },
});
