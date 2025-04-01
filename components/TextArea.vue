<template>
  <div class="w-full">
    <label
      :class="[
        'block text-[14px] font-medium mb-[6px]',
        {
          'text-[#333]': !isFocused && (!error || modelValue),
          'text-[#007AFF]': isFocused,
          'text-[#FF3B30]': error && !modelValue,
        },
      ]"
    >
      {{ label }}
    </label>

    <div
      :class="[
        'relative text-[#070707] h-min rounded-[16px] overflow-hidden p-[6px] text-[14px]',
        textAreaClasses,
        {
          'border border-[#007AFF] shadow-[0_0_0_3px_#D9EBFF] bg-[#FFF]':
            isFocused && (!error || modelValue),
          'border border-[#FF3B30] shadow-[0_0_0_3px_#F84B5F33] bg-[#FFF]':
            error && !modelValue,
          'border border-[#F4F4F4] bg-[#F4F4F4]':
            !isFocused && (!error || modelValue),
        },
      ]"
    >
      <textarea
        :class="[
          textAreaClasses,
          'min-h-[59px]  caret-[#007AFF] resize-y bg-transparent placeholder:text-[#7D7D7D]',
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
        { 'text-[#FF3B30]': error && !modelValue },
      ]"
    >
      {{ supportingText }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const model = defineModel();
const textAreaClasses = "w-full outline-none";

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
