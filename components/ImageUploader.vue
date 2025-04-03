<template>
  <div>
    <div
      class="min-h-[144px] relative rounded-[16px] border bg-[#F4F4F6] p-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors"
      :class="[
        {
          'border-[#007AFF]': !error || selectedFile,
          'border-[#FF3B30]': error && !selectedFile,
        },
      ]"
      @click="handleClick"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="props.acceptedFileTypes.join(',')"
        @change="handleFileChange"
      />

      <template v-if="!selectedFile">
        <div
          class="w-[40px] h-[40px] bg-[#007AFF] rounded-[8px] flex items-center justify-center mb-[14px]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66797 13.3333L10.0013 10M10.0013 10L13.3346 13.3333M10.0013 10V17.5M16.668 13.9524C17.6859 13.1117 18.3346 11.8399 18.3346 10.4167C18.3346 7.88536 16.2826 5.83333 13.7513 5.83333C13.5692 5.83333 13.3989 5.73833 13.3064 5.58145C12.2197 3.73736 10.2133 2.5 7.91797 2.5C4.46619 2.5 1.66797 5.29822 1.66797 8.75C1.66797 10.4718 2.36417 12.0309 3.49043 13.1613"
              stroke="white"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p
          class="text-center text-sm font-medium mb-[4px] leading-[18px]"
          :class="[
            {
              'text-[#007AFF]': !error || selectedFile,
              'text-[#FF3B30]': error && !selectedFile,
            },
          ]"
        >
          Click to upload
          <span class="text-[#070707] font-normal">or drag and drop</span>
        </p>
        <p class="text-center text-[#070707] text-sm leading-[18px]">
          {{ extensions }} (max. {{ props.maxWidth }}x{{ props.maxHeight }}px)
        </p>
      </template>

      <template v-else>
        <div class="relative w-full">
          <img
            :src="previewUrl"
            class="max-w-full object-contain"
            alt="Preview"
          />
          <button
            @click.stop="clearFile"
            class="absolute top-2 right-2 bg-[#FF3B30] text-white rounded-full w-4 h-4 flex items-center justify-center"
          >
            <Icon iconName="close" size="12" />
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-600">{{ selectedFile.name }}</p>
      </template>
    </div>

    <p v-if="errorMessage" class="mt-2 text-[#FF3B30] text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null,
  },
  maxWidth: {
    type: Number,
    default: 800,
  },
  maxHeight: {
    type: Number,
    default: 400,
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024, // 5MB default
  },
  acceptedFileTypes: {
    type: Array,
    default: () => ["image/svg+xml", "image/png", "image/jpeg", "image/gif"],
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "file-error"]);

const fileInput = ref(null);
const isDragging = ref(false);
const errorMessage = ref("");
const selectedFile = ref(props.modelValue);
const previewUrl = ref("");

// Check if we're on the client side before using browser APIs
const isClient = process.client;

// Create preview URL when selectedFile changes (client-side only)
watchEffect(() => {
  if (!isClient) return;

  if (previewUrl.value && selectedFile.value instanceof File) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
  }

  if (selectedFile.value) {
    if (selectedFile.value instanceof File) {
      previewUrl.value = URL.createObjectURL(selectedFile.value);
    } else {
      previewUrl.value = selectedFile.value;
    }
  }
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedFile.value = newValue;

    // Reset the file input when modelValue becomes null
    if (newValue === null && fileInput.value) {
      fileInput.value.value = "";
    }
  },
  { immediate: true }
);

const extensionMap = {
  "image/svg+xml": "SVG",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/gif": "GIF",
};
const extensions = Object.values(extensionMap).join(", ");

const acceptedExtensions = computed(() => {
  return props.acceptedFileTypes.map(
    (type) => extensionMap[type] || type.split("/")[1].toUpperCase()
  );
});

const handleClick = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const validateFile = (file) => {
  if (!isClient) return null;

  // Check file type
  if (!props.acceptedFileTypes.includes(file.type)) {
    return `File type not supported. Please upload ${acceptedExtensions.value.join(
      ", "
    )}`;
  }

  // Check file size
  if (file.size > props.maxSize) {
    const maxSizeMB = props.maxSize / (1024 * 1024);
    return `File size exceeds ${maxSizeMB}MB limit`;
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width > props.maxWidth || img.height > props.maxHeight) {
        resolve(
          `Image dimensions exceed ${props.maxWidth}x${props.maxHeight}px`
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve("Failed to load image for validation");
    };
    img.src = URL.createObjectURL(file);
  });
};

const updateModelValue = (file) => {
  selectedFile.value = file;
  emit("update:modelValue", file);

  // If file is null, reset the file input
  if (file === null && fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const error = await validateFile(file);
  if (error) {
    errorMessage.value = error;
    emit("file-error", error);
    // Reset the file input on error to allow selecting the same file again
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    return;
  }

  updateModelValue(file);
  errorMessage.value = "";
};

const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const error = await validateFile(file);
  if (error) {
    errorMessage.value = error;
    emit("file-error", error);
    return;
  }

  updateModelValue(file);
  errorMessage.value = "";
};

const clearFile = (e) => {
  e.stopPropagation();
  updateModelValue(null);
};

// Clean up object URL when component is unmounted (client-side only)
onBeforeUnmount(() => {
  if (isClient && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
