<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%">
        <v-card-text>
          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Description
              </th>
              <th class="text-left"></th>
              <th class="text-left"></th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="signal in signals" @click="openSignal(signal)">
              <td>{{ signal.name }}</td>
              <td>{{ signal.description }}</td>
              <td class="text-right">
                <v-icon @click.stop="loadSignalWav(signal)">
                  {{ mdi.mdiFile }}
                </v-icon>
              </td>
              <td class="text-right">
                <v-icon @click.stop="playOrStopSignal(signal)">
                  {{ isSignalPlayed(signal) ? mdi.mdiStop : mdi.mdiPlay }}
                </v-icon>
              </td>
              <td class="text-right">
                <v-icon @click.stop="askConfirmDeleteSignal(signal)">
                  {{ mdi.mdiDelete }}
                </v-icon>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>
    <confirm-dialog :opened="confirm.opened" :text="confirm.text"
                    @ok="confirm.ok" @cancel="confirm.cancel">
    </confirm-dialog>
  </NuxtLayout>
</template>

<script>
import {mdiDelete} from "@mdi/js";
import {mdiPlay} from "@mdi/js";
import {mdiStop} from "@mdi/js";
import {mdiFile} from "@mdi/js";
import SignalPlayer from "../audio/signal-player";
import FileUtils from "../utils/file-utils";
import PageBase from "../components/page-base";

export default {
  name: "signalmanager",
  extends: PageBase,
  data: () => ({
    signals: [],
    playedSignal: null,
    mdi: {
      mdiDelete,
      mdiPlay,
      mdiStop,
      mdiFile
    },
  }),
  methods: {
    async loadSignals() {
      let response = await this.getApiProvider().get('/api/signals')
      if (response.ok) {
        this.signals = response.data
      }
    },
    openSignal(signal) {
      useRouter().push('/signal/' + signal.id)
    },
    loadSignalWav(signal) {
      FileUtils.saveSignalToWavFile(signal)
    },
    async playOrStopSignal(signal) {
      if (this.isSignalPlayed(signal)) {
        SignalPlayer.stop()
        this.playedSignal = null
      } else {
        this.playedSignal = signal
        await SignalPlayer.setSignalId(signal.id).play(() => {
          if (this.isSignalPlayed(signal)) {
            this.playedSignal = null
          }
        })
      }
    },
    isSignalPlayed(signal) {
      return this.playedSignal === signal
    },
    askConfirmDeleteSignal(signal) {
      this.askConfirm({
        text: `Are you sure to delete signal ${signal.name}?`,
        ok: () => {
          this.deleteSignal(signal)
        }
      })
    },
    async deleteSignal(signal) {
      let response = await this.getApiProvider().del('/api/signals/' + signal.id)
      if (response.ok) {
        await this.loadSignals()
      }
    },
  },
  mounted() {
    this.loadSignals()
  }
}
</script>

<style scoped>

</style>