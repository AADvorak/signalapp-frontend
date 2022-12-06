<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%" min-width="400">
        <v-card-title>
          Generate
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="generateAndOpenSignal">
            <v-text-field
                v-model="form.begin"
                type="number"
                step="0.01"
                label="Signal begin (B)"
                :error="!!validation.begin.length"
                :error-messages="validation.begin"
                required
            ></v-text-field>
            <v-text-field
                v-model="form.length"
                type="number"
                step="0.1"
                min="0"
                label="Signal length (L)"
                :error="!!validation.length.length"
                :error-messages="validation.length"
                required
            ></v-text-field>
            <v-text-field
                v-model="form.sampleRate"
                type="number"
                step="100"
                min="0"
                label="Signal sample rate (S)"
                :error="!!validation.sampleRate.length"
                :error-messages="validation.sampleRate"
                required
            ></v-text-field>
            <v-text-field
                v-model="form.frequency"
                type="number"
                step="10"
                min="0"
                label="Signal frequency (F)"
                :error="!!validation.frequency.length"
                :error-messages="validation.frequency"
                required
            ></v-text-field>
            <v-text-field
                v-model="form.amplitude"
                type="number"
                step="1"
                min="0"
                label="Signal amplitude (A)"
                :error="!!validation.amplitude.length"
                :error-messages="validation.amplitude"
                required
            ></v-text-field>
            <v-text-field
                v-model="form.offset"
                type="number"
                step="1"
                label="Signal offset (O)"
                :error="!!validation.offset.length"
                :error-messages="validation.offset"
                required
            ></v-text-field>
            <v-autocomplete
                v-model="form.form"
                :items="signalForms"
                label="Signal form"
            ></v-autocomplete>
            <div class="d-flex">
              <v-btn color="success" @click="generateAndOpenSignal">
                Generate
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script>
import formValidation from "../mixins/form-validation";
import formValuesSaving from "../mixins/form-values-saving";
import {dataStore} from "../stores/data-store";

export default {
  name: "signalgenerator",
  mixins: [formValidation, formValuesSaving],
  data: () => ({
    form: {
      begin: 0,
      length: 0.1,
      sampleRate: 3000,
      frequency: 100,
      amplitude: 1,
      offset: 0,
      form: 'sine'
    },
    validation: {
      begin: [],
      length: [],
      sampleRate: [],
      frequency: [],
      amplitude: [],
      offset: []
    },
    SIGNAL_FORMS: {
      sine: ({x, frequency, amplitude, offset}) => {
        return offset + amplitude * Math.sin(x * 2 * Math.PI * frequency)
      },
      square: ({x, frequency, amplitude, offset}) => {
        return Math.sin(x * 2 * Math.PI * frequency) >= 0 ? offset + amplitude : offset - amplitude
      },
      triangle: ({x, frequency, amplitude, offset}) => {
        return offset + (2 * amplitude / Math.PI) * Math.asin(Math.sin(x * 2 * Math.PI * frequency))
      },
      sawtooth: ({x, frequency, amplitude, offset}) => {
        return offset + (2 * amplitude / Math.PI) * Math.atan(Math.tan(x * Math.PI * frequency))
      },
      noise: ({x, frequency, amplitude, offset}) => {
        return offset + amplitude * (Math.random() * 2 - 1)
      }
    },
    VALIDATION_MSG: {
      greaterThanZero: 'Must be greater than zero',
      number: 'Must be a number',
    },
    VALIDATION_FUNCTIONS: {
      length(values, ctx) {
        if (values.length <= 0) return ctx.VALIDATION_MSG.greaterThanZero
        let pointsNumber = values.length * values.sampleRate
        if (!ctx.VALIDATION_FUNCTIONS.sampleRate(values) && (pointsNumber < 2 || pointsNumber > 512000)) {
          return 'Number of signal points (S * L) must be in range from 2 to 512000. Now it is ' + Math.floor(pointsNumber)
        }
      },
      sampleRate(values, ctx) {
        if (values.sampleRate <= 0) return ctx.VALIDATION_MSG.greaterThanZero
        if (values.sampleRate > 48000) return 'Must be not greater than 48000'
      },
      frequency(values, ctx) {
        if (values.frequency <= 0) return ctx.VALIDATION_MSG.greaterThanZero
        if (!ctx.VALIDATION_FUNCTIONS.sampleRate(values) && 2 * values.frequency > values.sampleRate) {
          return 'Must be less than a half of sample rate'
        }
      },
      amplitude(values, ctx) {
        if (values.amplitude < 0) return ctx.VALIDATION_MSG.greaterThanZero
      },
    },
  }),
  computed: {
    signalForms() {
      let forms = []
      for (let form in this.SIGNAL_FORMS) {
        forms.push(form)
      }
      return forms
    }
  },
  methods: {
    generateAndOpenSignal() {
      this.clearValidation()
      if (!this.validateForm()) {
        return
      }
      this.saveFormValues()
      let data = []
      let step = 1 / this.form.sampleRate
      for (let x = this.form.begin; x < this.form.begin + this.form.length; x += step) {
        let y = this.SIGNAL_FORMS[this.form.form]({x, ...this.form})
        data.push({x, y})
      }
      let signalKey = dataStore().addSignalToHistory({
        id: 0,
        name: `Generated ${this.form.form} signal`,
        description: `B = ${this.form.begin}, L = ${this.form.length}, S = ${this.form.sampleRate}, F = ${this.form.frequency}, A = ${this.form.amplitude}, O = ${this.form.offset} (${data.length} points)`,
        data
      })
      useRouter().push('/signal/' + signalKey)
    },
    validateForm() {
      let validated = true
      for (let fieldName in this.form) {
        if (fieldName !== 'form') {
          let value = this.form[fieldName]
          let validationMsg = ''
          if (isNaN(value)) {
            validationMsg = this.VALIDATION_MSG.number
          } else {
            let validationFunction = this.VALIDATION_FUNCTIONS[fieldName]
            if (validationFunction) {
              validationMsg = validationFunction(this.form, this)
            }
          }
          if (validationMsg) {
            this.validation[fieldName].push(validationMsg)
            validated = false
          }
        }
      }
      return validated
    },
  },
  mounted() {
    this.restoreFormValues()
  }
}
</script>

<style scoped>

</style>