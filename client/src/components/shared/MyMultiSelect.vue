<template>
  <div class="multiselect-container">
    <my-multi-select-item
        v-for="(item, index) in inputData"
        :key="index"
        :name="item.name"
        :parent="null"
        :children="item.children">
    </my-multi-select-item>
  </div>
</template>

<script>
import MyMultiSelectItem from "./MyMultiSelectItem";

export default {
  name: 'my-multi-select',

  components: { MyMultiSelectItem },

  data() {
    return {
      inputData: [
        {
          name: 'Visitor1',
          value: true,
          children: [
            {
              name: 'Emp_1_1',
              children: [],
            },
            {
              name: 'Emp_1_2',
              children: [],
            },
          ]
        },
        {
          name: 'Visitor2',
          children: [
            {
              name: 'Emp_2_1',
              children: [
                {
                  name: 'Emp_2_1_1',
                  children: [],
                }
              ],
            },
            {
              name: 'Emp_2_2',
              children: [],
            },
          ]
        },
        {
          name: 'Visitor3',
          children: [
            {
              name: 'Emp_3_1',
              children: [
                {
                  name: 'Emp_3_1_1',
                  children: [
                    {
                      name: 'Emp_3_1_1_1',
                      value: true,
                      children: [],
                    },
                    {
                      name: 'Emp_3_1_2_1',
                      children: [],
                    }
                  ],
                },
                {
                  name: 'Emp_3_1_2',
                  children: [],
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.multiselect-container {
  padding: 10px;
  background-color: lightgoldenrodyellow;
  color: blue;
}
</style>
