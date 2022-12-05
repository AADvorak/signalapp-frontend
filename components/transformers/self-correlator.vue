<template>

</template>

<script>
import TransformerBase from "./transformer-base";
import SignalUtils from "../../utils/signal-utils";

export default {
  name: "SelfCorrelator",
  extends: TransformerBase,
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by self correlator`
      SignalUtils.calculateSignalParams(this.signal)
      this.signal.data = SignalUtils.estimateCorrelationFunction(this.signal, this.signal)
      return this.signal
    },
  }
}
</script>

<style scoped>

</style>