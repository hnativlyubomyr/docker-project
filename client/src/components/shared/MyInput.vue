<template>
  <input
      class="input"
      :type="type"
      :value="modelValue"
      @input="emitValue"
  />
</template>

<script>
export default {
  name: 'my-input',

  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text',
      validator(value) {
        return ['password', 'email', 'text'].includes(value)
      }
    },
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
