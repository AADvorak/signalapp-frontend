<template>

</template>

<script>
import formValidation from "../../mixins/form-validation";
import {dataStore} from "../../stores/data-store";
import formValuesSaving from "../../mixins/form-values-saving";

export default {
  name: "TransformerBase",
  props: {
    signal: Object,
    bus: Object
  },
  mixins: [formValidation, formValuesSaving],
  methods: {
    doTransform() {
      if (this.form) {
        this.clearValidation()
        if (!this.validateFunction()) {
          this.bus.emit('validationFailed')
          return
        }
        this.saveFormValues()
      }
      let signalKey = dataStore().addSignalToHistory(this.transformFunction())
      useRouter().push('/signal/' + signalKey)
    },
    transformFunction() {
      return this.signal
    },
    validateFunction() {
    },
    validatePositiveNumber(key) {
      let value = this.form[key]
      let invalidMsg = ''
      if (isNaN(value)) {
        invalidMsg = 'Should be a number'
      } else if (value < 0) {
        invalidMsg = 'Must have positive value'
      }
      if (invalidMsg) {
        this.validation[key].push(invalidMsg)
      }
      return !invalidMsg
    },
  },
  mounted() {
    this.form && this.restoreFormValues()
    this.bus.on('transform', () => {
      this.doTransform()
    })
  },
  beforeUnmount() {
    this.bus.off('transform')
  }
}
</script>

<style scoped>

</style>