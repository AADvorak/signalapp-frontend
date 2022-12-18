<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%">
        <v-card-text>
          <h1>App description</h1>
          <div>This web app models signal transformations.</div>
          <div><b>App abilities:</b></div>
          <ul>
            <li>simple form signals generation,</li>
            <li>signal transformation,</li>
            <li>signal adding,</li>
            <li>signal storage on server,</li>
            <li>signal export to / import from txt and wav files,</li>
            <li>signal recording / playing.</li>
          </ul>
          <h2>Signal generation</h2>
          <div>Use <a @click="openSignalGenerator" href="#">signal generator</a> to generate signals and import from txt and wav files.</div>
          <h2>Signal recording</h2>
          <div>Use <a @click="openSignalRecorder" href="#">signal recorder</a> to record signals from your audio input device.</div>
          <h2>Signal management</h2>
          <div>Use <a @click="openSignalManager" href="#">signal manager</a> to see / edit / delete / play your stored signals, send them to transformers, view, export to txt and wav files, add and correlate several signals.</div>
          <div>Special module <a href="#">cable</a> helps to process signals. Every time you have generated new signal or done some transformation, the result is opened with cable, when you can preview it, edit description. Then you can save it or do further transformations.</div>
          <h2 style="color: brown">Warning</h2>
          <div>The app is for educational purposes only. Not for processing of real signals and sound. Maximal length of</div>
          <ul>
            <li>generated signals is 512000 points,</li>
            <li>stored on server signals is 1024000 points,</li>
            <li>imported wav files is 2048000 bytes.</li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  methods: {
    openSignalGenerator() {

    },
    openSignalRecorder() {

    },
    openSignalManager() {

    },
  },
  mounted() {
    const route = useRoute()
    const goto = ref(route.query.goto)
    if (goto.value) {
      useRouter().push('/' + goto.value)
    }
  }
}

</script>
