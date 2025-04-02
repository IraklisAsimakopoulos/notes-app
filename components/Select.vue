<template>
  <div class="w-full" ref="dropdownRef">
    <label
      v-if="label"
      :class="[
        'block text-[14px] font-medium mb-[6px]',
        {
          'text-[#333]': !isFocused && (!error || modelValueHasValue),
          'text-[#007AFF]': isFocused,
          'text-[#FF3B30]': error && !modelValueHasValue,
        },
      ]"
    >
      {{ label }}
    </label>

    <!-- Main select component -->
    <div
      @click="toggleDropdown"
      :class="[
        'flex items-center relative w-full min-h-[56px] outline-none border rounded-[16px] p-2 cursor-pointer',
        {
          'text-[#7D7D7D]': !modelValueHasValue,
          'border-[#007AFF] shadow-[0_0_0_3px_#D9EBFF] bg-[#FFF]':
            isFocused && (!error || modelValueHasValue),
          'border-[#FF3B30] shadow-[0_0_0_3px_#F84B5F33] bg-[#FFF]':
            error && !modelValueHasValue,
          'border-[#F4F4F4] bg-[#F4F4F4]':
            !isFocused && (!error || modelValueHasValue),
          'opacity-50 cursor-not-allowed': disabled,
        },
      ]"
    >
      <!-- Display selected pills -->
      <div v-if="multiple" class="flex flex-wrap gap-[8px] items-center">
        <span
          v-for="(option, index) in selectedOptions.slice(0, 2)"
          :key="index"
          class="bg-[#007AFF26] text-[#070707] px-3 py-2 rounded-full text-xs flex items-center gap-[10px]"
        >
          <span>{{ option.label }}</span>
          <Icon
            @click.stop="removeOption(option)"
            size="12"
            icon-name="close"
            class="text-[#7D7D7D] hover:text-[#070707]"
          />
        </span>
        <span
          v-if="selectedOptions.length > 2"
          class="text-[#7D7D7D] h-min text-xs font-bold"
        >
          {{ `+${selectedOptions.length - 2}` }}
        </span>
      </div>

      <!-- Display selected value if not multiple -->
      <span
        v-else-if="model"
        class="text-[#070707] text-sm flex items-center gap-[8px]"
      >
        {{ selectedOptions?.[0].label }}
      </span>

      <span v-if="!modelValueHasValue" class="text-[#7D7D7D] text-sm">
        {{ placeholder }}
      </span>

      <!-- Dropdown component for the options -->
      <div
        v-if="isFocused"
        @click.stop
        class="z-10 overflow-y-auto max-h-[216px] absolute w-[calc(100%+2px)] top-[100%] left-[-1px] bg-white mt-1 text-[#070707] rounded-[16px] shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_32px_-4px_rgba(12,12,13,0.1)]"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="hover:bg-[#007AFF26] cursor-pointer"
          @click="!multiple ? selectSingle(option) : undefined"
          @change="multiple && toggleMultiple(option)"
        >
          <label class="flex items-center gap-2 cursor-pointer p-4 leading-4">
            <!-- Hidden default checkbox -->
            <input
              v-if="multiple"
              type="checkbox"
              class="hidden peer"
              :checked="Array.isArray(model) && model.includes(option.value)"
              :disabled="disabled"
            />

            <!-- Custom Material Icon checkbox -->
            <Icon
              v-if="multiple"
              icon-name="check_box_outline_blank"
              size="22"
              class="text-[#7D7D7D] peer-checked:hidden"
            />
            <Icon
              v-if="multiple"
              size="22"
              icon-name="check_box"
              class="hidden text-[#007AFF] peer-checked:block"
            />

            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>

      <Icon
        icon-name="arrow_forward_ios"
        size="12"
        :class="[
          'absolute right-[8px] text-[#7D7D7D]',
          {
            'rotate-90': !isFocused,
            '-rotate-90': isFocused,
          },
        ]"
      />
    </div>

    <div
      v-if="supportingText"
      :class="[
        'text-[12px] py-0 px-[16px] text-[#6b7280] mt-[4px]',
        { 'text-[#FF3B30]': error && !modelValueHasValue },
      ]"
    >
      {{ supportingText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: "",
  },
  options: {
    type: Array,
    default: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
      { label: "Option 4", value: "option4" },
      { label: "Option 5", value: "option5" },
      { label: "Option 6", value: "option6" },
    ],
  },
  multiple: { type: Boolean, default: true },
  label: { type: [String, null], default: "Default label" },
  placeholder: { type: [String, null], default: "Select..." },
  supportingText: { type: [String, null], default: "Default supporting text" },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
});

const isFocused = ref(false);
const model = ref(props.modelValue);
const dropdownRef = ref(null);

// Computed property to show if there is a selected value
const modelValueHasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(model.value) && model.value.length > 0;
  } else {
    return (
      model.value !== "" && model.value !== null && model.value !== undefined
    );
  }
});

// Selected options (for display as pills)
const selectedOptions = computed(() => {
  return props.options.filter((option) => model.value.includes(option.value));
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== model.value) {
      model.value = newVal;
    }
  },
  { immediate: true }
);

const emit = defineEmits(["update:modelValue"]);

const toggleDropdown = () => {
  if (!props.disabled) {
    isFocused.value = !isFocused.value;
  }
};

// Single selection logic
const selectSingle = (option) => {
  model.value = option.value;
  isFocused.value = false;
  emit("update:modelValue", model.value);
};

// Multiple selection logic
const toggleMultiple = (option) => {
  let updatedValue = Array.isArray(model.value) ? [...model.value] : [];
  if (updatedValue.includes(option.value)) {
    updatedValue = updatedValue.filter((v) => v !== option.value);
  } else {
    updatedValue.push(option.value);
  }
  model.value = updatedValue;
  emit("update:modelValue", model.value);
};

// Remove option from selected list
const removeOption = (option) => {
  let updatedValue = Array.isArray(model.value) ? [...model.value] : [];
  updatedValue = updatedValue.filter((v) => v !== option.value);
  model.value = updatedValue;
  emit("update:modelValue", model.value);
};

// Close dropdown if clicked outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isFocused.value = false;
  }
};

onMounted(() => {
  // Add event listener for clicks outside
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Remove event listener to prevent memory leaks
  document.removeEventListener("click", handleClickOutside);
});
</script>
