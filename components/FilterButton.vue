<template>
  <div class="flex items-center gap-2">
    <div
      v-for="(type, index) in selectedTypes"
      :key="index"
      class="flex items-center gap-[6px]"
    >
      <span class="text-[#0A0C11] text-[14px] text-[400]">{{
        type.label
      }}</span>

      <Icon
        icon-name="close"
        size="14"
        class="cursor-pointer text-[#0A0C11] hover:text-[#0A0C0]"
        @click="removeType(type)"
      />
    </div>
    <Button
      icon="filter_list"
      iconPosition="right"
      className="!bg-[#090909] text-[#fff] relative"
      variant="outline"
      @click="toggleDropdown"
    >
      Filter
      <div
        v-if="isDropdownOpen"
        class="text-[#0A0C11] absolute top-[100%] left-0 mt-2 w-[152px] bg-[#ffffff] rounded-[16px] shadow-[0_4px_4px_-4px_#0C0C0D0D,0_16px_32px_-4px_#0C0C0D1A] z-10 overflow-hidden"
      >
        <div>
          <label
            class="flex items-center gap-2 cursor-pointer p-4 leading-4 hover:bg-[#007AFF26] cursor-pointer"
          >
            <input
              type="checkbox"
              class="hidden peer"
              @click.stop="toggleAll"
              :checked="allSelected"
            />
            <Icon
              icon-name="check_box_outline_blank"
              size="22"
              class="text-[#7D7D7D] peer-checked:hidden"
            />
            <Icon
              size="22"
              icon-name="check_box"
              class="hidden text-[#007AFF] peer-checked:block"
            />

            All
          </label>
          <div v-for="option in typeOptions" :key="option.value">
            <label
              class="flex items-center gap-2 cursor-pointer p-4 leading-4 hover:bg-[#007AFF26] cursor-pointer"
            >
              <input
                type="checkbox"
                class="hidden peer"
                @click.stop="toggleOption(option)"
                :checked="selectedValues.includes(option.value)"
              />
              <Icon
                icon-name="check_box_outline_blank"
                size="22"
                class="text-[#7D7D7D] peer-checked:hidden"
              />
              <Icon
                size="22"
                icon-name="check_box"
                class="hidden text-[#007AFF] peer-checked:block"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </Button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  onChange: {
    type: [Function, null],
    default: null,
  },
});

const typeOptions = [
  { value: "1", label: "Default Note" },
  { value: "2", label: "Image Note" },
  { value: "3", label: "Checkbox Note" },
];

const selectedValues = ref(["1", "2", "3"]);
const isDropdownOpen = ref(false);

const selectedTypes = computed(() => {
  return typeOptions.filter((option) =>
    selectedValues.value.includes(option.value)
  );
});

watch(selectedValues, (newValue) => {
  if (typeof props.onChange == "function") {
    const finalValue = newValue.join(",");
    props.onChange(finalValue);
  }
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleOption = (option) => {
  const index = selectedValues.value.indexOf(option.value);

  if (index !== -1) {
    selectedValues.value = selectedValues.value.filter(
      (value) => value !== option.value
    );
  } else {
    selectedValues.value = [...selectedValues.value, option.value];
  }
};
const allSelected = computed(() => {
  return selectedValues.value.length === typeOptions.length;
});

const toggleAll = () => {
  if (allSelected.value) {
    selectedValues.value = [];
  } else {
    selectedValues.value = typeOptions.map((option) => option.value);
  }
};

const removeType = (type) => {
  selectedValues.value = selectedValues.value.filter(
    (value) => value !== type.value
  );
};
</script>
