<template>
  <div>
    <input
        ref="inputElement"
        type="checkbox"
        v-model="selected"
        :id="name"
        @change="handleCheckboxes"
    >
    <label for="name">{{ name }}</label>

    <div v-if="children.length" class="sub-items-container">
      <my-multi-select-item
          v-for="(item, index) in children"
          :key="index"
          :name="item.name"
          :value="item.value || false"
          :parent="inputElement"
          :children="item.children"
          @handle-parent="handleParent"
      >
      </my-multi-select-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-multi-select-item',

  props: {
    name: {
      type: String,
      required: true,
    },
    value: Boolean,
    children: Array,
    parent: [Object, null]
  },

  data() {
    return {
      selected: false,
      inputElement: null,
    }
  },
  methods: {
    handleCheckboxes(event) {
      const children = event.target.parentElement.querySelectorAll('.sub-items-container input');

      children.forEach(item => {
        item.checked = event.target.checked;
        item.indeterminate = false;
      });

      this.handleParent(this.parent);
    },

    handleParent(element) {
      if(!element) return;

      const subContainer = element.nextElementSibling.nextElementSibling;
      const parentChildren = subContainer.querySelectorAll('.sub-items-container input');
      const parentChildrenArray = Array.from(parentChildren);
      const isAllChecked = parentChildrenArray.every(item => item.checked);
      const isAllUnChecked = parentChildrenArray.every(item => !item.checked);


      if (isAllChecked || isAllUnChecked) {
        element.indeterminate = false;
        element.checked = isAllChecked;
      } else {
        element.indeterminate = true;
      }

      this.$emit('handleParent', this.parent);
    },
  },

  mounted() {
    this.inputElement = this.$refs.inputElement;
    this.selected = this.value;
    //console.log(this.parent);
    this.$nextTick(() => {
      this.handleParent(this.parent);
    })

  }
}
</script>

<style scoped>
.sub-items-container {
  padding: 20px;
}
input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

input[type='checkbox']+label {
  margin-left: 10px;
}
</style>
