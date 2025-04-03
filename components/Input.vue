<template>
  <div class="w-full">
    <div class="w-full">
      <label
        v-if="label"
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

      <input
        :class="[
          'w-full text-[#070707] outline-none placeholder:text-[#7D7D7D] min-h-[56px] p-[6px] text-[14px] caret-[#007AFF] resize-y rounded-[16px]',
          {
            'border border-[#007AFF] shadow-[0_0_0_3px_#D9EBFF] bg-[#FFF]':
              isFocused && (!error || modelValue),
            'border border-[#FF3B30] shadow-[0_0_0_3px_#F84B5F33] bg-[#FFF]':
              error && !modelValue,
            'border border-[#F4F4F4] bg-[#F4F4F4]': modelValue && !isFocused,
            'border border-[#F4F4F4] bg-[#F4F4F4]':
              !modelValue && !isFocused && !error,
            'bg-[#FFF]': isFocused || (error && !modelValue),
            'bg-[#F4F4F4]': !isFocused && (!error || modelValue),
          },
        ]"
        v-model="model"
        :placeholder="placeholder"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :disabled="disabled"
      />
    </div>

    <div
      v-if="supportingText"
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
const model = defineModel();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: [String, null],
    default: null,
  },
  placeholder: {
    type: [String, null],
    default: null,
  },
  supportingText: {
    type: [String, null],
    default: null,
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
