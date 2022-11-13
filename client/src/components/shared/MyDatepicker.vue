<template>
  <Datepicker
      v-model="dateTime"
      :timePicker="isTimePicker"
      :textInputOptions="textInputOptions"
      :locale="locale"
      textInput
      ref="datepicker"
      @open="menuOpen"
      @keydown.enter="updateModelValue"
  >
    <template #dp-input>
      <div>{{ modelValue }}</div>
      <input
          class="dp__input custom__input"
          :type="getPickerInputType"
          :value="formatPickerValue(dateTime)"
      />
    </template>
  </Datepicker>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

export default {
  components: { Datepicker },

  computed: {
    getPickerType() {
      return Object.values(this.pickerType).includes(this.type) ? this.type : this.pickerType.date;
    },

    getPickerInputType() {
      return this.getPickerType === this.pickerType.dateTime ? 'datetime-local' : this.getPickerType;
    },

    isTimePicker() {
      return this.getPickerType === this.pickerType.time;
    },
  },

  watch: {
    dateTime: {
      handler(value) {
        this.modelValueRef = this.isTimePicker ? this.setDateFromTime(value.hours, value.minutes) : value;

        this.$emit('update:modelValue', this.modelValueRef);
      },
      deep: true,
    }
  },

  props: {
    modelValue: {
      type: [Date, null],
      default: new Date(),
    },

    type: {
      type: String,
      default: 'date',
    },

    locale: {
      type: String,
      default: 'en-US',
    },

    isMenu: {
      type: Boolean,
      default: true,
    }
  },

  setup(props) {
    const modelValueRef = ref(props.modelValue);
    const pickerType = { date: 'date', time: 'time', dateTime: 'date-time'};

    const date = ref(props.modelValue instanceof Date ? props.modelValue : null);

    const time = ref(props.modelValue instanceof Date ? {
      hours: props.modelValue.getHours(),
      minutes: props.modelValue.getMinutes(),
      seconds: 0,
    } : null);

    const dateTime = props.type === pickerType.time ? time : date;

    const textInputOptions = ref({ openMenu: props.isMenu });

    const datepicker = ref(null);

    const parseStrToDate = (value) => {
      if (props.type === pickerType.time) {
        const timeArray = typeof value === 'string' ? value.split(':') : Object.values(value);
        const hours = Number(timeArray[0]);
        const minutes = Number(timeArray[1]);

        return isNaN(hours || minutes) ? null : setDateFromTime(Number(timeArray[0]), Number(timeArray[1]));
      }

      if (isNaN(Date.parse(value))) return null;

      if (props.type === pickerType.date) {
        const dateArray = value.split('-');
        return setDateFromFullYear(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]))
      }

      return new Date(value);
    }

    const updateModelValue = (event) => {
      const value = event.target.value;
      const dateValue = parseStrToDate(value);

      if (!dateValue) return;

      if (props.type === pickerType.time) {
        dateTime.value = { hours: dateValue.getHours(), minutes: dateValue.getMinutes(), seconds: 0 };
      } else {
        dateTime.value = dateValue;
      }

      datepicker.value.closeMenu();
    }

    const setDateFromTime = (hours, minutes) => {
      return new Date(new Date().setHours(hours, minutes));
    }

    const setDateFromFullYear = (year, month, day) => {
      return new Date(new Date().setFullYear(year, month - 1 , day))
    }

    const sliceStrDate = (dateStr) => {
      let startPosition = 0;
      let endPosition = 16;

      if (props.type === pickerType.date) {
        endPosition = 10;
      }

      if (props.type === pickerType.time) {
        startPosition = 11;
      }

      return dateStr.slice(startPosition, endPosition);
    }

    const formatPickerValue = (date) => {
      if (!date) return null;

      const value = date instanceof Date ? date : parseStrToDate(date);
      const dateStr = new Date(value.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString();

      return sliceStrDate(dateStr);
    }

    const menuOpen = () => {
      if (props.type === pickerType.date) {
        const dpBtn = document.querySelector('.dp__button');
        dpBtn.remove();
      }
    }

    const localeGB = 'en-GB';

    return {
      dateTime,
      textInputOptions,
      pickerType,
      localeGB,
      datepicker,
      menuOpen,
      formatPickerValue,
      updateModelValue,
      setDateFromTime,
      modelValueRef,
    }
  },
}
</script>

<style scoped>
::v-deep .dp__input_wrap .dp__input_icons {
  display: none;
}

</style>
