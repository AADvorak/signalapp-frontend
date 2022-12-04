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
              <v-btn color="primary">
                Send
                <v-menu activator="parent">
                  <v-list>
                    <v-list-item v-for="transformer of transformers" @click="sendToTransformer(transformer)">
                      <v-list-item-title>{{ transformer.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
              <v-btn color="success" @click="saveSignal">
                Save
              </v-btn>
              <v-btn color="secondary" v-if="signal.id">
                Save as new
              </v-btn>
              <v-btn color="secondary">
                Export txt
              </v-btn>
              <v-btn color="secondary">
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
import {dataStore} from "../../../stores/data-store";

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
  computed: {
    transformers() {
      return dataStore().getTransformers
    }
  },
  methods: {
    getApiProvider() {
      return ApiProvider.setRouter(useRouter()).setRoute(useRoute())
    },
    sendToTransformer(transformer) {

    },
    async loadSignal(id) {
      let response = await this.getApiProvider().get('/api/signals/' + id)
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