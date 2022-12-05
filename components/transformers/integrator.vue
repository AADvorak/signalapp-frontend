<template>

</template>

<script>
import TransformerBase from "./transformer-base";
import SignalUtils from "../../utils/signal-utils";

export default {
  name: "Integrator",
  extends: TransformerBase,
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by integrator`
      return SignalUtils.integrate(this.signal)
    },
  }
}
</script>

<style scoped>

</style>