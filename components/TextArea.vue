<template>
  <div class="w-full">
    <label
      :class="[
        'block text-[14px] font-medium mb-[6px] text-[#333]',
        {
          'text-[#007AFF]': isFocused && !error,
          'text-[#FF3B30]': error,
        },
      ]"
    >
      {{ label }}
    </label>

    <div
      :class="[
        'relative h-min rounded-[16px] overflow-hidden p-[6px] text-[14px]',
        textAreaClasses,
        {
          'border border-[#007AFF] rounded-[16px] shadow-[0_0_0_1px_#D9EBFF] bg-[#FFF]':
            isFocused && !error,
          'border border-[#FF3B30] rounded-[16px] shadow-[0_0_0_1px_#F84B5F33] bg-[#FFF]':
            error,
          'border border-[#F4F4F4] rounded-[16px] ': modelValue && !isFocused,
          'border border-[#F4F4F4]': !modelValue && !isFocused && !error,
        },
      ]"
    >
      <textarea
        :class="[
          textAreaClasses,
          'min-h-[59px]  caret-[#007AFF] resize-y',
          { 'bg-[#FFF]': isFocused || error },
        ]"
        v-model="model"
        :placeholder="placeholder"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :disabled="disabled"
      />
    </div>

    <div
      :class="[
        'text-[12px] py-0 px-[16px] text-[#6b7280] mt-[4px]',
        { 'text-[##FF3B30]': error },
      ]"
    >
      {{ supportingText }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const model = defineModel();
const textAreaClasses = "w-full outline-none bg-[#F4F4F4]";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Default",
  },
  placeholder: {
    type: String,
    default: "Text Placeholder",
  },
  supportingText: {
    type: String,
    default: "Supporting text",
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isFocused = ref(false);
</script>
