<template>
  <div
    v-if="open"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-[#fff] p-[22px] rounded-[16px] w-[496px] max-h-[634px] overflow-y-auto flex flex-col gap-[22px]"
    >
      <div class="flex justify-between items-center">
        <h2 class="text-[22px] font-bold">Create New Note</h2>
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
          :label="null"
          :supportingText="null"
        />
        <Input
          v-model="form.title"
          :error="error"
          placeholder="Header"
          :label="null"
          :supportingText="null"
        />
        <ImageUploader
          v-if="form.cardType === '2'"
          v-model="form.image"
          :error="error"
        />
        <TextArea
          v-model="form.description"
          :error="error"
          placeholder="Description"
          :label="null"
          :supportingText="null"
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
            class="flex items-center gap-[10px]"
          >
            <Input
              v-model="form.options[index]"
              :error="error"
              placeholder="Text placeholder"
              :label="null"
              :supportingText="null"
            />
            <Icon
              @click="removeOption(index)"
              iconName="do_not_disturb_on"
              :class="[
                'cursor-pointer',
                {
                  hidden: form.options.length <= 1,
                },
              ]"
            />
          </div>
          <Button @click="addOption" icon="add" variant="green">
            Add option
          </Button>
        </div>
        <Button type="submit" :disabled="isDisabled"> Create </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const typeOptions = [
  { value: "1", label: "Default Note" },
  { value: "2", label: "Image Note" },
  { value: "3", label: "Checkbox Note" },
];

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
  },

  onSubmit: {
    type: [Function, null],
    default: null,
  },
});

const error = ref(false);

const form = ref({
  cardType: "",
  title: "",
  description: "",
  image: null,
  options: [""],
});

const isDisabled = computed(() => {
  if (!form.value.cardType || !form.value.title || !form.value.description) {
    return true;
  }

  if (form.value.cardType === "2" && !form.value.image) {
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

const handleSubmit = () => {
  if (isDisabled.value) {
    error.value = true;
    return;
  }

  if (typeof props.onSubmit !== Function) {
    return;
  }

  error.value = false;
  onSubmit(form.value);

  // Clear form values
  form.value.cardType = "";
  form.value.title = "";
  form.value.description = "";
  form.value.image = null;
  form.value.options = [""];

  onClose();
};

const closeModal = () => {
  props.onClose();
  form.value.cardType = "";
  form.value.title = "";
  form.value.description = "";
  form.value.image = null;
  form.value.options = [""];
};

const addOption = () => {
  form.value.options.push("");
};

const removeOption = (index) => {
  if (form.value.options.length > 1) {
    form.value.options.splice(index, 1);
  }
};
</script>
