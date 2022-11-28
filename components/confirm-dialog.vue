<template>

  <v-dialog
      v-model="opened"
      persistent
      max-width="600px"
  >
    <v-card width="100%">
      <v-card-title>Confirmation</v-card-title>

      <v-card-text>
        <div class="d-flex mb-4">
          {{ text }}
        </div>

        <div class="d-flex">
          <v-btn color="success" class="mr-4" @click="ok">
            Ok
          </v-btn>
          <v-btn @click="cancel">
            Cancel
          </v-btn>
        </div>

      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script>
export default {
  name: "confirm-dialog",
  props: {
    opened: Boolean,
    text: String
  },
  emits: ['ok', 'cancel'],
  methods: {
    ok() {
      this.$emit('ok')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>