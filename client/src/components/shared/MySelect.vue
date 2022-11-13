<template>
  <select
      v-model="modelValue"
      class="select"
      @change="handleChangeValue"
  >
    <option disabled value="">{{ defaultText }}</option>

    <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'my-select',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: '',

    },
    defaultText: String,
    options: {
      type: Array,
      default: () => [],
    }
  },
  methods: {
    handleChangeValue(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
}
</script>

<style scoped>
  .select {
    background-color: white;
    height: 47px;
    color: teal;
    padding: 0 20px;
    font-size: 15px;
    font-family: Arial;
  }

  option {
    font-weight: bold;
  }
</style>
