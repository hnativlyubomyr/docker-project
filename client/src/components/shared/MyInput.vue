<template>
  <input
      class="input"
      type="text"
      :value="modelValue"
      @input="emitValue"
  />
</template>

<script>
export default {
  name: 'my-input',

  props: {
    modelValue: [String, Number],
  },

  emits: ['update:modelValue'],

  methods: {
    emitValue(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }

}
</script>

<style scoped>
  .input {
    width: 100%;
    padding: 15px;
    font-size: 15px;
    border: 1px teal solid;
    box-sizing: border-box;
    border-radius: 10px;
}

input:focus {
    border-color: green;
    border-width: 2px;
    outline: none;
}

</style>
