<template>

</template>

<script>
import TransformerBase from "./transformer-base";

export default {
  name: "Inverter",
  extends: TransformerBase,
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by inverter`
      for (let point of this.signal.data) {
        point.y = -point.y
      }
      return this.signal
    },
  }
}
</script>

<style scoped>

</style>