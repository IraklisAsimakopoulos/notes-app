<template>
  <button
    :class="[
      'inline-flex gap-[8px] items-center justify-center transition-colors duration-200 font-medium h-10 text-sm',
      iconOnly ? 'rounded-[16px]' : 'rounded-[36px]',
      variantClasses,
      iconOnlyClasses,
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      className,
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <Icon v-if="icon && iconPosition === 'left'" :icon-name="icon" />
    <slot />
    <Icon v-if="icon && iconPosition === 'right'" :icon-name="icon" />
    <Icon v-if="iconOnly" :icon-name="iconOnly" />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "outline", "green"].includes(value),
  },
  icon: {
    type: [String, null],
    default: null,
  },
  iconOnly: {
    type: [String, null],
    default: null,
  },
  iconPosition: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
  className: {
    type: String,
    default: "",
  },
});

defineEmits(["click"]);

const variantClasses = computed(() => {
  const padding =
    !props.iconOnly &&
    (props.iconPosition === "left"
      ? "px-[10px] pl-[14px] pr-[20px]"
      : "px-[10px] pr-[14px] pl-[20px]");

  switch (props.variant) {
    case "primary":
      if (props.disabled) {
        return `bg-[#8C929C] hover:bg-[#8C929C] text-white ${padding}`;
      }
      return `bg-[#007AFF] hover:bg-[#0075F5] text-white ${padding}`;
    case "outline":
      if (props.disabled) {
        return `bg-transparent border border-[#8A8A8A] text-[#8A8A8A] hover:border-[#8A8A8A] ${padding}`;
      }
      return `bg-transparent border border-[#373737] text-[#0A0C11] hover:border-[#8A8A8A] ${padding}`;
    case "green":
      if (props.disabled) {
        return `bg-[#8C929C] hover:bg-[#8C929C] text-white ${padding}`;
      }
      return `bg-green-500 hover:bg-green-600 text-white ${padding}`;
    default:
      if (props.disabled) {
        return `bg-[#8C929C] hover:bg-[#8C929C] text-white ${padding}`;
      }
      return `bg-[#007AFF] hover:bg-[#0075F5] text-white ${padding}`;
  }
});

const iconOnlyClasses = computed(() => {
  if (props.iconOnly) {
    return "p-[10px] w-9 h-9 flex items-center justify-center";
  }
  return "";
});
</script>
