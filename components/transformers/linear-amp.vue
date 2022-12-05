<template>
  <v-text-field
      v-model="form.coefficient"
      type="number"
      step="1"
      min="0"
      label="Coefficient"
      :error="!!validation.coefficient.length"
      :error-messages="validation.coefficient"
      required
  ></v-text-field>
</template>

<script>
import TransformerBase from "./transformer-base";

export default {
  extends: TransformerBase,
  name: "LinearAmp",
  data: () => ({
    form: {
      coefficient: 1
    },
    validation: {
      coefficient: []
    }
  }),
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by linear amplifier with coefficient = ${this.form.coefficient}`
      let data = this.signal.data
      for (let item of data) {
        item.y *= this.form.coefficient
      }
      return this.signal
    },
    validateFunction() {
      return this.validatePositiveNumber('coefficient')
    }
  }
}
</script>

<style scoped>

</style>