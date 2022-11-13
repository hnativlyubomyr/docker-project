<template>
  <div
      v-if="isShow"
      class="dialog-wrapper"
      @click="closeDialog"
  >
    <div class="dialog-window" @click.stop>
      <div class="dialog-header">
        <slot name="header"></slot>
        <div class="close-button" @click="closeDialog">x</div>
      </div>
      <div class="dialog-content">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-dialog',

  props: {
    isShow: {
      type: Boolean,
      default: false,
    }
  },

  emits: ['update:isShow'],

  methods: {
    closeDialog() {
      this.$emit('update:isShow', false);

    }
  }
}
</script>

<style scoped>
  .dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
  }

  .dialog-window {
    margin: auto;
    background-color: white;
    min-width: 500px;
    min-height: 200px;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background-color: teal;
    color: white;
  }

  .close-button {
    font-weight: bold;
    font-family: Verdana;
    font-size: 20px;
    cursor: pointer;
  }

  .dialog-footer {
    display: flex;
    padding: 10px;
    background-color: lightgray;
    justify-content: flex-end;
  }

</style>
