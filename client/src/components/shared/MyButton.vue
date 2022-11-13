<template>
  <button
      class="btn"
      ref="btnRef"
      :disabled="isDisabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'my-button',

  props: {
    colorButton: {
      type: String,
      default: 'white',
      validator(value) {
        return ['green', 'red', 'blue'].includes(value)
      }
    },

    isDisabled: {
      type: Boolean,
      default: false,
    }
  },

  mounted() {
    this.$refs.btnRef.classList.add(this.colorButton);
  }
}
</script>

<style scoped>
  .btn {
    align-self: flex-end;
    padding: 15px;
    border-style: none;
    border-radius: 10px;
    color: white;
    font-size: 15px;
    min-width: 130px;
  }

  .btn:hover {
    cursor: pointer;
    background-color: teal;
    color: white;
  }

  .btn:disabled {
    background-color: lightgray;
    color: black;
    cursor: not-allowed;
  }

  .white {
    background-color: white;
    border: 1px teal solid;
    color: teal;
  }

  .red {
    background-color: darkred;
  }

  .green {
    background-color: darkgreen;
  }

  .blue {
    background-color: darkblue;
  }

</style>
