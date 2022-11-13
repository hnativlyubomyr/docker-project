<template>
  <div class="multiselect-container">
    <div v-for="(item, index) in modelValue">
      <input
          type="checkbox"
          v-model="item.value"
          :ref="`input_${index}`"
          :id="item.name"
          :key="index"
          :indeterminate="isIndeterminate(index)"
          @change="handleChange($event, index, true)"
      >
      <label for="item.name">{{ item.name }}</label>
      <div v-if="item.children" class="multiselect-children">
        <div v-for="(child, subIndex) in item.children">
          <input
              type="checkbox"
              v-model="child.value"
              :id="child.name"
              :key="subIndex"
              @change="handleChange($event, index)"
          >
          <label for="item.name">{{ child.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    modelValue: Array,
  },

  methods: {
    isIndeterminate(index) {
      const element = this.modelValue[index];

      if (!element.children) return false;

      const isAllChecked = element.children.every(item => item.value);
      const isAllUnChecked = element.children.every(item => !item.value);

      element.value = isAllChecked;

      return !(isAllChecked || isAllUnChecked)
    },

    handleChange(event, index, isRoot = false) {
      const updateModel = [...this.modelValue];
      const element = updateModel[index];

      if (isRoot && element.children) {
        element.children.forEach(item => {
          item.value = event.target.checked;
        });
      }

      this.$emit('update:modelValue', updateModel);
    }
  }
}
</script>

<style scoped>
.multiselect-container {
  padding: 20px;
  background-color: lightgoldenrodyellow;
  color: blue;
}

.multiselect-children {
  padding: 0 20px;
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

input[type='checkbox']+label {
  margin-left: 10px;
}
</style>
