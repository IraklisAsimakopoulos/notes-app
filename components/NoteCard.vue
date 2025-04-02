<template>
  <div
    class="flex flex-col gap-[22px] bg-[#ffffff] rounded-[16px] shadow-[0_8px_36px_0_#3A395912] p-[22px] w-full max-h-[380px]"
  >
    <h2 class="text-[17px] font-[590] text-[#070707] line-clamp-1">
      {{ title }}
    </h2>

    <img
      v-if="type === '2' && image"
      :src="image"
      :alt="title"
      class="w-full h-[172px] rounded-[12px] object-cover"
    />

    <div
      class="text-[#070707] leading-[140%] flex flex-col gap-[8px]"
      :class="[
        {
          'h-[288px] overflow-y-auto text-ellipsis': type === '1',
          'line-clamp-4': type === '2' || type === '3',
        },
      ]"
    >
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </div>

    <div
      v-if="type === '3' && options.length > 0"
      class="mt-4 flex flex-col gap-[8px]"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        class="flex items-start gap-[8px]"
      >
        <Icon
          v-if="isChecked(option)"
          size="22"
          icon-name="check_box"
          class="text-[#007AFF]"
        />
        <Icon
          v-else
          icon-name="check_box_outline_blank"
          size="22"
          class="text-[#7D7D7D]"
        />
        <label
          :for="`option-${index}`"
          class="text-[#0A0C11] leading-[140%] line-clamp-4"
        >
          {{ option.text }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    default: "1",
    validator: (value) => ["1", "2", "3"].includes(value),
  },
  image: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
    // Each option should have: { text: String, checked: Boolean }
  },
});

const paragraphs = computed(() => props.description?.split("\n\n") || []);
const isChecked = (option) => {
  return option.checked;
};
</script>
