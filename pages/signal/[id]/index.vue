<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%">
        <v-card-text>
          <div class="mb-5">
            <chart-drawer :signals="[signal]"></chart-drawer>
          </div>
          <v-form @submit.prevent="saveSignal">
            <v-text-field
                v-model="signal.name"
                label="Name"
                :error="!!validation.name.length"
                :error-messages="validation.name"
                required
            ></v-text-field>

            <v-textarea
                v-model="signal.description"
                label="Description"
                :error="!!validation.description.length"
                :error-messages="validation.description"
            >
            </v-textarea>

            <div class="d-flex">
              <v-btn>
                Send
              </v-btn>
              <v-btn color="success" class="mr-4" @click="saveSignal">
                Save
              </v-btn>
              <v-btn v-if="signal.id">
                Save as new
              </v-btn>
              <v-btn>
                Export txt
              </v-btn>
              <v-btn>
                Export wav
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script>
import ApiProvider from "../../../api/api-provider";
import ChartDrawer from "../../../components/chart-drawer";

export default {
  name: "index",
  components: {ChartDrawer},
  data: () => ({
    signal: {},
    validation: {
      name: [],
      description: []
    }
  }),
  methods: {
    async loadSignal(id) {
      let response = await ApiProvider.get('/api/signals/' + id)
      if (response.ok) {
        this.signal = response.data
      }
    },
    saveSignal() {

    }
  },
  mounted() {
    let id = this.$route.params.id
    let signalId = parseInt(id)
    if (signalId) {
      this.loadSignal(signalId)
    }
  }
}
</script>

<style scoped>

</style>