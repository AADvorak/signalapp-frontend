<template>
  <v-text-field
      v-model="form.frequency"
      type="number"
      step="1"
      min="0"
      label="Frequency"
      :error="!!validation.frequency.length"
      :error-messages="validation.frequency"
      required
  ></v-text-field>
  <v-text-field
      v-model="form.damping"
      type="number"
      step="0.1"
      min="0"
      label="Damping"
      :error="!!validation.damping.length"
      :error-messages="validation.damping"
      required
  ></v-text-field>
</template>

<script>
import TransformerBase from "./transformer-base";
import SignalUtils from "../../utils/signal-utils";

export default {
  name: "LinearOscillator",
  extends: TransformerBase,
  data: () => ({
    form: {
      frequency: 100,
      damping: 0.1,
    },
    validation: {
      frequency: [],
      damping: [],
    },
    EQUATIONS: [
      (input, variables, params) => variables[1],
      (input, variables, params) => input - 2 * params.damping * variables[1] -
          Math.pow(2 * Math.PI * params.frequency, 2) * variables[0]
    ],
  }),
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by linear oscillator with frequency = ${this.form.frequency}, damping = ${this.form.damping}`
      this.signal.data = SignalUtils.solveDifEq({
        inData: this.signal.data,
        equations: this.EQUATIONS,
        params: this.form,
        initial: [0.0, 0.0],
        outNumber: 0
      })
      return this.signal
    },
    validateFunction() {
      let validated = []
      for (let key in this.form) {
        validated.push(this.validatePositiveNumber(key))
      }
      return !validated.includes(false)
    },
  }
}
</script>

<style scoped>

</style>