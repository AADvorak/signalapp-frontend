<template>

  <v-dialog
      v-model="opened"
      persistent
      max-width="600px"
  >
    <v-card width="100%">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-form>
          <div class="mb-5">Transform signal with {{ title }}?</div>
          <slot/>
          <div class="d-flex">
          <v-btn :disabled="processing" color="success" class="mr-4" @click="ok">
            {{ processing ? 'Working...' : 'OK' }}
          </v-btn>
          <v-btn :disabled="processing" @click="cancel">
            Cancel
          </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "transformer-dialog",
  props: {
    opened: Boolean,
    title: String,
    bus: Object
  },
  data: () => ({
    processing: false
  }),
  emits: ['ok', 'cancel'],
  methods: {
    ok() {
      this.processing = true
      // todo next tick
      setTimeout(() => this.$emit('ok'), 100)
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  mounted() {
    this.bus.on('validationFailed', () => {
      this.processing = false
    })
  },
  beforeUnmount() {
    this.bus.off('validationFailed')
  }
}
</script>

<style scoped>

</style>