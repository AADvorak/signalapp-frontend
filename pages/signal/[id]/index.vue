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
              <v-btn color="secondary" v-if="signal.id" @click="saveSignalAsNew">
                Save as new
              </v-btn>
              <v-btn color="secondary" @click="exportSignalToTxt">
                Export txt
              </v-btn>
              <v-btn color="secondary" v-if="!signalIsStoredLocally" @click="exportSignalToWav">
                Export wav
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
    <transformer-dialog :opened="transformerDialog.opened" :title="transformerDialog.title" :bus="bus"
                 @ok="transformerDialog.ok" @cancel="closeTransformerDialog">
      <component v-bind:is="transformerDialog.selectedTransformer" :signal="signal" :bus="bus"></component>
    </transformer-dialog>
    <message :opened="message.opened" :text="message.text" @hide="message.onHide"></message>
  </NuxtLayout>
</template>

<script>
import ChartDrawer from "../../../components/chart-drawer";
import {dataStore} from "../../../stores/data-store";
import TransformerDialog from "../../../components/transformer-dialog";
import LinearAmp from "../../../components/transformers/linear-amp";
import DummyTransformer from "../../../components/transformers/dummy-transformer";
import Integrator from "../../../components/transformers/integrator";
import Differentiator from "../../../components/transformers/differentiator";
import Inverter from "../../../components/transformers/inverter";
import SelfCorrelator from "../../../components/transformers/self-correlator";
import SpectrumAnalyser from "../../../components/transformers/spectrum-analyser";
import LinearOscillator from "../../../components/transformers/linear-oscillator";
import mitt from 'mitt'
import formValidation from "../../../mixins/form-validation";
import PageBase from "../../../components/page-base";
import FileUtils from "../../../utils/file-utils";

export default {
  name: "index",
  extends: PageBase,
  components: {
    TransformerDialog, ChartDrawer, LinearAmp,
    DummyTransformer, Integrator, Differentiator, Inverter,
    SelfCorrelator, SpectrumAnalyser, LinearOscillator
  },
  data: () => ({
    signalKey: '',
    signal: {},
    validation: {
      name: [],
      description: []
    },
    transformerDialog: {
      opened: false,
      title: '',
      selectedTransformer: '',
      ok: () => {
      }
    },
    bus: new mitt()
  }),
  mixins: [formValidation],
  computed: {
    transformers() {
      return dataStore().getTransformers
    },
    signalIsSaved() {
      return !!this.signal.id
    },
    signalIsStoredLocally() {
      return this.signalKey.includes('-')
    }
  },
  methods: {
    sendToTransformer(transformer) {
      this.transformerDialog.selectedTransformer = transformer.module
      this.transformerDialog.title = transformer.name
      this.transformerDialog.opened = true
    },
    closeTransformerDialog() {
      this.transformerDialog.opened = false
    },
    async loadSignal(id) {
      let response = await this.getApiProvider().get('/api/signals/' + id)
      if (response.ok) {
        this.signal = response.data
      } else if (response.status === 404) {
        this.signalNotFound()
      }
    },
    async saveSignalAsNew() {
      delete this.signal.id
      await this.saveSignal()
    },
    async saveSignal() {
      this.clearValidation()
      let response
      if (this.signalIsSaved) {
        response = await this.getApiProvider().putJson('/api/signals/' + this.signal.id, this.signal)
      } else {
        response = await this.getApiProvider().postJson('/api/signals/', this.signal)
      }
      if (response.ok) {
        dataStore().clearSignalHistory()
        useRouter().push('/signalmanager')
      } else if (response.status === 400) {
        this.parseValidation(response.errors)
        for (let error of response.errors) {
          if (error.field === 'data') {
            this.showMessage({
              text: 'Error saving signal data: ' + error.message
            })
          }
        }
      } else {
        for (let error of response.errors) {
          this.showMessage({
            text: 'Error saving signal: ' + error.message
          })
        }
      }
    },
    signalNotFound() {
      this.showMessage({
        text: 'Signal is not found',
        onHide: () => {
          useRouter().push('/signalmanager')
        }
      })
    },
    exportSignalToTxt() {
      FileUtils.saveSignalToTxtFile(this.signal)
    },
    exportSignalToWav() {
      FileUtils.saveSignalToWavFile(this.signal)
    },
  },
  mounted() {
    this.signalKey = this.$route.params.id
    if (this.signalIsStoredLocally) {
      let signal = dataStore().getSignalFromHistory(this.signalKey)
      if (signal) {
        this.signal = signal
      } else {
        this.signalNotFound()
      }
    } else {
      let signalId = parseInt(this.signalKey)
      if (!isNaN(signalId)) {
        this.loadSignal(signalId)
      } else {
        this.signalNotFound()
      }
    }
    this.transformerDialog.ok = () => {
      this.bus.emit('transform')
    }
  }
}
</script>

<style scoped>

</style>