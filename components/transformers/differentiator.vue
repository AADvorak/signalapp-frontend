<template>

</template>

<script>
import TransformerBase from "./transformer-base";
import SignalUtils from "../../utils/signal-utils";

export default {
  name: "Differentiator",
  extends: TransformerBase,
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by differentiator`
      return SignalUtils.differentiate(this.signal)
    },
  }
}
</script>

<style scoped>

</style>