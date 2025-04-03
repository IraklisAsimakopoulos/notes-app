<template>
  <div
    v-if="open"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-[#fff] p-[22px] rounded-[16px] w-[496px] max-h-[634px] overflow-y-auto flex flex-col gap-[22px]"
    >
      <div class="flex justify-between items-center">
        <h2 class="text-[22px] font-bold">
          {{ isUpdate ? "Update Note" : "Create New Note" }}
        </h2>
        <Icon
          iconName="close"
          class="cursor-pointer text-[#0A0C11] w-[22px] h-[22px]"
          size="22"
          @click="closeModal"
        />
      </div>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-[16px]">
        <Select
          v-model="form.cardType"
          :error="error"
          :options="typeOptions"
          :multiple="false"
          placeholder="Select type of card"
        />
        <Input v-model="form.title" :error="error" placeholder="Header" />
        <ImageUploader
          v-if="form.cardType === '2'"
          v-model="form.image"
          :error="error"
        />
        <TextArea
          v-model="form.description"
          :error="error"
          placeholder="Description"
        />
        <h3
          v-if="form.cardType === '3'"
          class="text-[14px] font-bold leading-[140%]"
        >
          Add option
        </h3>
        <div v-if="form.cardType === '3'" class="flex flex-col gap-[8px]">
          <div
            v-for="(option, index) in form.options"
            :key="index"
            class="flex items-center gap-2"
          >
            <Input
              v-model="form.options[index]"
              :error="error"
              placeholder="Text placeholder"
            />
            <Icon
              v-if="form.options.length > 1"
              @click="removeOption(index)"
              iconName="do_not_disturb_on"
              class="cursor-pointer"
            />
          </div>
          <Button @click="addOption" icon="add" variant="green">
            Add option
          </Button>
        </div>
        <Button type="submit" :disabled="isDisabled">
          {{ isUpdate ? "Update" : "Create" }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useNotesStore } from "../store/useNotesStore";
import { v4 as uuidv4 } from "uuid";

const typeOptions = [
  { value: "1", label: "Default Note" },
  { value: "2", label: "Image Note" },
  { value: "3", label: "Checkbox Note" },
];

const props = defineProps({
  open: Boolean,
  onClose: Function,
  defaultValues: Object,
});

const error = ref(false);
const notesStore = useNotesStore();
const router = useRouter();

const form = ref({
  cardType: "",
  title: "",
  description: "",
  image: null,
  options: [""],
});

const isUpdate = computed(() => !!props.defaultValues);
watch(
  () => props.defaultValues,
  (newValues) => {
    if (newValues) {
      form.value = {
        ...newValues,
        options:
          newValues.cardType === "3"
            ? newValues.options.map((option) => option.text)
            : undefined,
      };
    }
  },
  { immediate: true }
);

const isDisabled = computed(() => {
  if (!form.value.cardType || !form.value.title || !form.value.description) {
    return true;
  }

  if (form.value.cardType === "2" && !form.value.image) {
    return true;
  }

  if (form.value.cardType === "3" && !form.value.options && isUpdate.value) {
    return true;
  }

  const isAnythingEmpty =
    form.value.cardType === "3" &&
    form.value.options?.some((option) => {
      return option === null || option === "";
    });

  if (isAnythingEmpty) {
    return true;
  }

  if (
    form.value.cardType === "3" &&
    (form.value.options.length === 0 ||
      (form.value.options.length === 1 && form.value.options[0] === ""))
  ) {
    return true;
  }

  return false;
});

const handleSubmit = async () => {
  if (isDisabled.value) {
    error.value = true;
    return;
  }

  error.value = false;

  const finalOptions = form.value.options?.map((option) => ({
    text: option,
    checked: false,
  }));

  const processNote = (imageData) => {
    const noteData = {
      id: isUpdate.value ? form.value.id : uuidv4(),
      cardType: form.value.cardType,
      title: form.value.title,
      description: form.value.description,
      image: form.value.cardType === "2" ? imageData : undefined,
      options: form.value.cardType === "3" ? finalOptions : undefined,
    };

    if (isUpdate.value) {
      const newUpdatedNote = notesStore.editNote(noteData);

      if (newUpdatedNote && newUpdatedNote.slug !== form.value.slug) {
        router.push({
          name: "note-slug",
          params: { slug: newUpdatedNote.slug },
        });
      }
    } else {
      notesStore.addNote(noteData);
    }

    closeModal();
  };

  if (form.value.cardType === "2" && form.value.image instanceof File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      processNote(base64Image);
    };
    reader.readAsDataURL(form.value.image);
  } else {
    processNote(form.value.image);
  }
};

const closeModal = () => {
  props.onClose();
  if (!isUpdate) {
    form.value = {
      cardType: "",
      title: "",
      description: "",
      image: null,
      options: [""],
    };
  }
};

const addOption = () => {
  if (Array.isArray(form.value.options)) {
    form.value.options.push("");
  } else {
    form.value.options = [""];
  }
};

const removeOption = (index) => {
  if (form.value.options.length > 1) {
    form.value.options.splice(index, 1);
  }
};
</script>
