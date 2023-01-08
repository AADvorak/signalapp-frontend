<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%">
        <v-card-text>
          <p>
            <span>Total: {{ pages }} pages, </span>
            <span>{{ elements }} entries</span>
          </p>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="size"
                    :rules="sizeRules"
                    type="number"
                    step="1"
                    label="Page size"
                    required
                ></v-text-field>
              </v-col>
              <v-col>
                <search-field
                    :init-search-value="filter"
                    @search="(search) => this.setFilter(search)"/>
              </v-col>
            </v-row>
          </v-form>
          <v-table>
            <thead>
            <tr>
              <th @click="setSortingName" class="text-left">
                Name {{sortingNameSign}}
              </th>
              <th @click="setSortingDescription" class="text-left">
                Description {{sortingDescriptionSign}}
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
          <v-pagination
              v-model="page"
              :length="pages"
          ></v-pagination>
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
    loadingSignals: false,
    signals: [],
    filter: '',
    elements: 0,
    pages: 0,
    page: 1,
    size: 10,
    sortBy: '',
    sortDir: '',
    playedSignal: null,
    mdi: {
      mdiDelete,
      mdiPlay,
      mdiStop,
      mdiFile
    },
    sizeRules: [
      v => !!v || 'This field is required',
      v => ( v && v <= 25 && v >= 5 ) || 'Size should be between 5 and 25'
    ],
    SORT_DIRS: {
      DESC: 'desc',
      ASC: 'asc'
    },
    SORT_COLS: {
      NAME: 'name',
      DESCRIPTION: 'description'
    }
  }),
  watch: {
    filter() {
      this.setUrlParams()
      this.loadSignals()
    },
    page() {
      this.setUrlParams()
      this.loadSignals()
    },
    size(newValue) {
      if (!newValue || newValue < 5 || newValue > 25) {
        return
      }
      this.setUrlParams()
      this.loadSignals()
    },
    sortBy() {
      this.setUrlParams()
      this.loadSignals()
    },
    sortDir() {
      this.setUrlParams()
      this.loadSignals()
    }
  },
  computed: {
    sortingNameSign() {
      if (this.sortBy === this.SORT_COLS.NAME) {
        return this.getSortDirSign()
      }
      return ''
    },
    sortingDescriptionSign() {
      if (this.sortBy === this.SORT_COLS.DESCRIPTION) {
        return this.getSortDirSign()
      }
      return ''
    }
  },
  methods: {
    async loadSignals() {
      if (this.loadingSignals) {
        return
      }
      this.loadingSignals = true
      try {
        let url = `/api/signals${this.makeUrlParams(true)}`
        let response = await this.getApiProvider().get(url)
        if (response.ok) {
          this.signals = response.data.data
          this.elements = response.data.elements
          this.pages = response.data.pages
        }
      } finally {
        this.loadingSignals = false
      }
    },
    setFilter(filter) {
      this.filter = filter
      this.page = 1
    },
    setSortingName() {
      this.setSorting(this.SORT_COLS.NAME)
    },
    setSortingDescription() {
      this.setSorting(this.SORT_COLS.DESCRIPTION)
    },
    setSorting(col) {
      if (this.sortBy !== col) {
        this.sortBy = col
        this.sortDir = this.SORT_DIRS.DESC
      } else {
        if (this.sortDir === this.SORT_DIRS.DESC) {
          this.sortDir = this.SORT_DIRS.ASC
        } else {
          this.sortDir = ''
          this.sortBy = ''
        }
      }
    },
    getSortDirSign() {
      if (this.sortDir === this.SORT_DIRS.ASC) {
        return '(^)'
      }
      if (this.sortDir === this.SORT_DIRS.DESC) {
        return '(v)'
      }
      return ''
    },
    readUrlParams() {
      const route = useRoute()
      const page = ref(route.query.page)
      if (page.value) {
        this.page = parseInt(page.value)
      }
      const size = ref(route.query.size)
      if (size.value) {
        this.size = parseInt(size.value)
      }
      const filter = ref(route.query.filter)
      if (filter.value) {
        this.filter = filter.value
      }
      const sortBy = ref(route.query.sortBy)
      if (sortBy.value) {
        this.sortBy = sortBy.value
      }
      const sortDir = ref(route.query.sortDir)
      if (sortDir.value) {
        this.sortDir = sortDir.value
      }
      return page.value || size.value || filter.value || sortBy.value || sortDir.value
    },
    setUrlParams() {
      let url = `/signalmanager${this.makeUrlParams()}`
      useRouter().push(url)
    },
    makeUrlParams(pageMinus1) {
      let params = `?page=${pageMinus1 ? this.page - 1 : this.page}&size=${this.size}`
      if (this.filter) {
        params += `&filter=${this.filter}`
      }
      if (this.sortBy) {
        params += `&sortBy=${this.sortBy}`
      }
      if (this.sortDir) {
        params += `&sortDir=${this.sortDir}`
      }
      return params
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
    if (!this.readUrlParams()) {
      this.setUrlParams()
    }
    this.loadSignals()
  }
}
</script>
